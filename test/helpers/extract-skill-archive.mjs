import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export function extractSkillArchive(archive, destination, { platform = process.platform, run = spawnSync } = {}) {
  fs.mkdirSync(destination, { recursive: true });
  const result = platform === 'win32'
    ? run('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
      "$ErrorActionPreference = 'Stop'; Expand-Archive -LiteralPath $env:ARCHIFY_TEST_ARCHIVE -DestinationPath $env:ARCHIFY_TEST_EXTRACT -ErrorAction Stop"], {
      encoding: 'utf8',
      env: { ...process.env, ARCHIFY_TEST_ARCHIVE: archive, ARCHIFY_TEST_EXTRACT: destination },
    })
    : run('unzip', ['-q', archive, '-d', destination], { encoding: 'utf8' });
  const detail = [result.error?.message, result.stdout, result.stderr].filter(Boolean).join('\n');
  assert.equal(result.status, 0, detail);
  let entry;
  try { entry = fs.lstatSync(path.join(destination, 'archify', 'SKILL.md')); } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR') throw error;
  }
  assert.ok(entry?.isFile(), `Extractor returned success without a regular packaged SKILL.md\n${detail}`);
}
