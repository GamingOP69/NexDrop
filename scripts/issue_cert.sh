#!/usr/bin/env bash
set -euo pipefail

if [ -z "${DOMAIN:-}" ]; then
  echo "DOMAIN environment variable is required"
  exit 1
fi

if [ -z "${DOMAIN_WWW:-}" ]; then
  echo "DOMAIN_WWW environment variable is required"
  exit 1
fi

if [ -z "${LETSENCRYPT_EMAIL:-}" ]; then
  echo "LETSENCRYPT_EMAIL environment variable is required"
  exit 1
fi

docker compose -f docker-compose.prod.yml run --rm certbot certonly --webroot -w /var/www/certbot \
  --email "$LETSENCRYPT_EMAIL" --agree-tos --no-eff-email \
  -d "$DOMAIN" -d "$DOMAIN_WWW" --rsa-key-size 4096
