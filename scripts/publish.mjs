#!/usr/bin/env node

import { execFileSync, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    if (options.capture && result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }

  return options.capture ? result.stdout.trim() : '';
}

function currentBranch() {
  return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
}

function statusPorcelain() {
  return run('git', ['status', '--porcelain'], { capture: true });
}

function usage() {
  console.log(`Usage:
  npm run publish
  npm run publish -- "Commit message"
  npm run publish -- --dry-run`);
}

function defaultCommitMessage() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
    now.getDate()
  )} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
  return `Update blog: ${stamp}`;
}

function main() {
  const rawArgs = process.argv.slice(2);
  if (rawArgs.includes('--help') || rawArgs.includes('-h')) {
    usage();
    return;
  }

  const dryRun = rawArgs.includes('--dry-run');
  const message =
    rawArgs.filter((arg) => arg !== '--dry-run').join(' ').trim() ||
    defaultCommitMessage();
  const branch = currentBranch();

  if (branch !== 'source') {
    console.error(
      `Refusing to publish from branch "${branch}". Blog source lives on "source": git switch source`
    );
    process.exit(1);
  }

  console.log('Building site before publishing...');
  run('npm', ['run', 'build']);

  const beforeStage = statusPorcelain();
  if (dryRun) {
    console.log('Dry run complete. No commit or push was made.');
    if (beforeStage) {
      console.log('Changes that would be published:');
      console.log(beforeStage);
    } else {
      console.log('No local source changes found.');
    }
    return;
  }

  if (!beforeStage) {
    console.log('No local source changes to commit.');
  } else {
    console.log('Staging and committing local changes...');
    run('git', ['add', '-A']);

    const hasStagedChanges =
      spawnSync('git', ['diff', '--cached', '--quiet'], { cwd: ROOT }).status !== 0;

    if (hasStagedChanges) {
      run('git', ['commit', '-m', message]);
    } else {
      console.log('Nothing changed after staging.');
    }
  }

  console.log('Pushing source branch. GitHub Actions will deploy dist to master.');
  run('git', ['push', '-u', 'origin', 'HEAD:source']);
}

main();
