import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
import { ec2 } from '../../config/aws-config';

const ENV_FILE_PATH = path.resolve(__dirname, '../../../.env');
dotenv.config();

function updateEnvFile(instanceId: string): void {
  const envContent = fs.readFileSync(ENV_FILE_PATH, 'utf8');
  if (!envContent.includes(`INSTANCE_ID=${instanceId}`)) {
    const newContent = envContent.replace(/INSTANCE_ID=.*/g, `INSTANCE_ID=${instanceId}`);
    fs.writeFileSync(ENV_FILE_PATH, newContent, 'utf8');
    dotenv.config({ path: ENV_FILE_PATH });
    console.log(`.env atualizado com INSTANCE_ID: ${instanceId}`);
  }
}

export async function checkEc2InstanceStatus(): Promise<boolean> {
  const instanceId = process.env.INSTANCE_ID;
  if (!instanceId) {
    console.log('INSTANCE_ID não encontrado no arquivo .env. Criando uma nova instância...');
    return !!(await createInstance());
  }
    
  const instance = await describeInstance(instanceId);
  if (!instance) {
    console.log('Instância não encontrada. Crie uma nova ou verifique o arquivo .env.');
    return false;
  }
    
  if (instance.State?.Name === 'running') {
    console.log(`Instância EC2 ${instance.InstanceId} está ${instance.State?.Name}`);
    return true;
  }
    
  if (instance.State?.Name === 'stopped') {
    await startInstance(instanceId);
    const instance = await describeInstance(instanceId);
    console.log(`Instância EC2 ${instance?.InstanceId} está ${instance?.State?.Name}`);
    return true;
  }
    
  return false;
}

async function createInstance(): Promise<string | null> {
  try {
    const result = await ec2.runInstances({
      ImageId: 'ami-12345678',
      InstanceType: 't2.micro',
      MinCount: 1,
      MaxCount: 1,
    }).promise();
      
    const instanceId = result.Instances?.[0].InstanceId || null;
    if (instanceId) {
      console.log(`Instância EC2 criada com sucesso. ID: ${instanceId}`);
      updateEnvFile(instanceId);
    }
    return instanceId;
  } catch (error) {
    console.error('Erro ao criar instância EC2:', error);
    return null;
  }
}
  

async function describeInstance(instanceId: string): Promise<AWS.EC2.Instance | null> {
  try {
    const result = await ec2.describeInstances({ InstanceIds: [instanceId] }).promise();
    return result.Reservations?.[0]?.Instances?.[0] || null;
  } catch (error: any) {
    if (error.code === 'InvalidInstanceID.NotFound') {
      return null;
    }    
    console.error('Erro ao descrever a instância:', error);
    throw error;
  }
}

async function startInstance(instanceId: string): Promise<void> {
  console.log('Iniciando a instância...');
  await ec2.startInstances({ InstanceIds: [instanceId] }).promise();
}
