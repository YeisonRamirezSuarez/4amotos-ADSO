#!/bin/sh
set -e

# Ensure data directory exists for the mounted volume
mkdir -p /pb/pb_data

# Initialize data directory from baked seed if empty
if [ ! -f /pb/pb_data/data.db ]; then
  cp -r /pb/pb_seed/* /pb/pb_data/
fi

# Clean up stray generated files that could break JS VM on fresh deploys
rm -f /pb/pb_data/types.d.ts /pb/pb_data/pb.js

# Start PocketBase
exec /pb/pocketbase serve \
  --http 0.0.0.0:8080 \
  --dir /pb/pb_data \
  --publicDir /pb/pb_public \
  --hooksDir /pb/pb_hooks \
  --migrationsDir /pb/pb_migrations
