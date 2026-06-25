import { execSync } from 'child_process';
import path from 'path';

const cwd = path.resolve(__dirname, '../..');

export async function setup() {
  execSync('./node_modules/.bin/prisma migrate deploy', { stdio: 'inherit', cwd });
  execSync('./node_modules/.bin/ts-node prisma/seed.ts', { stdio: 'inherit', cwd });
}
