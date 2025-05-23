#!/bin/bash

# Parar o script em caso de erro
set -e

# Carregar variáveis de ambiente se existir .env
if [ -f .env ]; then
    source .env
fi

# Definir variáveis
LAMBDA_NAME="create-order"
LAMBDA_DIR="lambdas/create-orders"
AWS_REGION="us-east-2"
TEMP_DIR="temp-lambda-deploy"

echo "🔨 Preparando deploy da lambda ${LAMBDA_NAME}..."

# Criar diretório temporário
mkdir -p $TEMP_DIR

# Copiar apenas o arquivo TypeScript para compilar
echo "📁 Copiando arquivo source..."
cp $LAMBDA_DIR/index.ts $TEMP_DIR/

# Navegar para o diretório temporário
cd $TEMP_DIR

# Compilar TypeScript para JavaScript
echo "🔨 Compilando TypeScript..."
npx tsc index.ts --target es2020 --module commonjs --esModuleInterop --allowSyntheticDefaultImports --moduleResolution node

# Criar package.json mínimo apenas com dependências de produção
echo "📦 Criando package.json otimizado..."
cat > package.json << EOF
{
  "name": "create-order-lambda",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "aws-sdk": "^2.1692.0",
    "jsonwebtoken": "^9.0.2"
  }
}
EOF

# Instalar apenas dependências de produção
echo "📦 Instalando dependências de produção..."
npm install --production --no-optional

# Criar o zip apenas com arquivos essenciais
echo "📦 Criando pacote zip otimizado..."
zip -r ../lambda-deployment.zip index.js package.json node_modules/ -x \
  "node_modules/@types/*" \
  "node_modules/*/test/*" \
  "node_modules/*/tests/*" \
  "node_modules/*/*.md" \
  "node_modules/*/README*" \
  "node_modules/*/CHANGELOG*" \
  "node_modules/*/.npmignore" \
  "node_modules/*/.github/*" \
  "*.ts" \
  "*.d.ts" \
  "tsconfig.json"

# Voltar para o diretório principal
cd ..

# Fazer deploy da lambda
echo "🚀 Fazendo deploy da lambda..."
aws lambda update-function-code \
    --function-name $LAMBDA_NAME \
    --zip-file fileb://lambda-deployment.zip \
    --region $AWS_REGION

# Limpar arquivos temporários
echo "🧹 Limpando arquivos temporários..."
rm -rf $TEMP_DIR
rm lambda-deployment.zip

echo "✅ Deploy da lambda ${LAMBDA_NAME} concluído com sucesso!" 