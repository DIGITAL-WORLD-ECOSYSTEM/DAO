#!/bin/bash
echo "Starting ASOT Genesis Seed..."

# Enable foreign keys for this connection
npx wrangler d1 execute gov-db --local --command="PRAGMA foreign_keys=ON;"

npx wrangler d1 execute gov-db \
--local \
--file=./src/db/seed.sql

echo "Genesis Seed Completed"
