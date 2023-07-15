#!/bin/sh

set -ex
npx prisma migrate deploy
# npx prisma migrate deploy
npm run start:prod
# node dist/src/main.js