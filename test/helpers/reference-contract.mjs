import fs from 'node:fs';
import path from 'node:path';

// Contract assertions still cover the normative text after its on-demand split.
export function readReferenceContract(skillRoot, kind) {
  const directory = path.join(skillRoot, 'references');
  const entry = `${kind}-contract.md`;
  const index = fs.readFileSync(path.join(directory, entry), 'utf8');
  const files = [...new Set([...index.matchAll(/\]\(([^)#]+\.md)(?:#[^)]+)?\)/g)]
    .map(match => match[1]).filter(file => file !== entry && file.startsWith(`${kind}-`)))];
  return [index.split('\n## Topics\n')[0], ...files.map(file => fs.readFileSync(path.join(directory, file), 'utf8'))].join('\n');
}
