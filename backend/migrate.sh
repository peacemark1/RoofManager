#!/bin/sh
# This script runs on Railway after deployment to set up the database

echo "Running database migrations..."
npx prisma migrate deploy

echo "Migrations complete!"
