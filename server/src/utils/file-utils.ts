import crypto from "crypto";
import toArray from 'stream-to-array';
import {config} from 'dotenv';

config()

export const stream2buffer = async (stream: NodeJS.ReadableStream): Promise<Buffer> => {
  const parts = await toArray(stream);
  let buffer: any[] = [];
  parts.forEach(part => buffer.push((part instanceof Buffer) ? part : new Buffer(part)))
  return Buffer.concat(buffer);
}

export const encryptBuffer = (buffer: Buffer): Buffer => {
  const key = process.env.FILE_ENCRYPTION_KEY as string;
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
  return Buffer.concat([iv, cipher.update(buffer), cipher.final()]);
}

export const decryptBuffer = (buffer: Buffer): Buffer => {
  const key = process.env.FILE_ENCRYPTION_KEY as string;
  let iv = buffer.slice(0, 16);
  let chunk = buffer.slice(16);
  let decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
  return Buffer.concat([decipher.update(chunk), decipher.final()]);
}
