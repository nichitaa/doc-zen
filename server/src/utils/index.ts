import { config } from 'dotenv';

config();

export const isLocalEnv = (): boolean => process.env.NODE_ENV === 'local';

export const isEmpty = (value: any): boolean => !value || value.length === 0;
