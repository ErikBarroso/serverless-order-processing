/* eslint-disable no-undef */
'use strict';
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'serveless-order-processing'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  logging: {
    level: 'info',
  },
};