#!/usr/bin/env node
const { execSync } = require('child_process');
const { existsSync, readFileSync } = require('fs');
const { platform } = require('os');

function isAlpine() {
  if (platform() !== 'linux') return false;
  const releasePath = '/etc/os-release';
  if (!existsSync(releasePath)) return false;
  const content = readFileSync(releasePath, 'utf8');
  return content.toLowerCase().includes('alpine');
}

function run() {
  if (!isAlpine()) return;
  if (typeof process.getuid === 'function' && process.getuid() !== 0) {
    console.warn('Alpine detected but not running as root; skipping openssl1.1 install.');
    return;
  }

  try {
    execSync('apk add --no-cache openssl1.1', { stdio: 'inherit' });
    console.log('Installed openssl1.1 for Alpine Prisma compatibility.');
  } catch (error) {
    console.warn('Failed to install openssl1.1 on Alpine. Prisma may not run until this dependency is present.');
  }
}

run();
