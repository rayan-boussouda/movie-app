import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const file = fs.readFileSync(
  path.join(__dirname, '../../docs/openapi.yaml'),
  'utf8',
);

export const swaggerSpec = yaml.load(file) as Record<string, unknown>;
