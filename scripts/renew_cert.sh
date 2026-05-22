#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DOMAIN:-}" ]; then
  echo "DOMAIN environment variable is required"
  exit 1
fi

if [ -z "${LETSENCRYPT_EMAIL:-}" ]; then
  echo "LETSENCRYPT_EMAIL environment variable is required"
  exit 1
fi

docker compose -f docker-compose.prod.yml run --rm certbot renew --webroot -w /var/www/certbot
