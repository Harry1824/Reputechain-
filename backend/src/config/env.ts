import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
  GITHUB_ACCESS_TOKEN: Joi.string().optional().allow(''),
  ETHEREUM_RPC_URL: Joi.string().required(),
  PRIVATE_KEY: Joi.string().required(),
  CONTRACT_ADDRESS: Joi.string().required(),
  PINATA_API_KEY: Joi.string().optional().allow(''),
  PINATA_SECRET_API_KEY: Joi.string().optional().allow(''),
}).unknown(true);

const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
  port: envVars.PORT,
  mongoUri: envVars.MONGO_URI,
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
    refreshSecret: envVars.JWT_REFRESH_SECRET,
    refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN,
  },
  github: {
    token: envVars.GITHUB_ACCESS_TOKEN,
  },
  web3: {
    rpcUrl: envVars.ETHEREUM_RPC_URL,
    privateKey: envVars.PRIVATE_KEY,
    contractAddress: envVars.CONTRACT_ADDRESS,
  },
  pinata: {
    apiKey: envVars.PINATA_API_KEY,
    secretApiKey: envVars.PINATA_SECRET_API_KEY,
  }
};
