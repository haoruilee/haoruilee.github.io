#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'source', '_posts');

function usage() {
  console.log(`Usage:
  npm run new:post -- "Post title"
  npm run new:post -- "Post title" --slug custom-slug --tags post,ai --thumbnail https://example.com/image.png`);
}

function parseArgs(argv) {
  const args = { tags: ['post'] };
  const titleParts = [];

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--slug') {
      args.slug = argv[++i];
    } else if (arg === '--tags') {
      args.tags = (argv[++i] ?? '')
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    } else if (arg === '--thumbnail') {
      args.thumbnail = argv[++i];
    } else if (arg === '--help' || arg === '-h') {
      args.help = true;
    } else if (arg.startsWith('--')) {
      throw new Error(`Unknown option: ${arg}`);
    } else {
      titleParts.push(arg);
    }
  }

  args.title = titleParts.join(' ').trim();
  if (!args.tags.length) args.tags = ['post'];
  return args;
}

function currentBranch() {
  return execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();
}

function slugFromTitle(title) {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\u4e00-\u9fff-]/gi, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'post'
  );
}

function availablePostPath(slug) {
  let candidate = slug;
  let suffix = 2;
  while (fs.existsSync(path.join(POSTS_DIR, `${candidate}.md`))) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }
  return path.join(POSTS_DIR, `${candidate}.md`);
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function localDateTime(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function yamlString(value) {
  return JSON.stringify(value);
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    usage();
    process.exit(1);
  }

  if (args.help) {
    usage();
    return;
  }

  if (!args.title) {
    usage();
    process.exit(1);
  }

  const branch = currentBranch();
  if (branch !== 'source') {
    console.error(
      `Refusing to create a post on branch "${branch}". Switch first: git switch source`
    );
    process.exit(1);
  }

  fs.mkdirSync(POSTS_DIR, { recursive: true });
  const slug = slugFromTitle(args.slug || args.title);
  const filePath = availablePostPath(slug);
  const tags = args.tags.map((tag) => `- ${yamlString(tag)}`).join('\n');
  const thumbnail = args.thumbnail ? `thumbnail: ${yamlString(args.thumbnail)}\n` : '';

  const content = `---
title: ${yamlString(args.title)}
date: ${localDateTime()}
tags:
${tags}
${thumbnail}---

# ${args.title}

`;

  fs.writeFileSync(filePath, content, { flag: 'wx' });
  console.log(`Created ${path.relative(ROOT, filePath)}`);
}

main();
