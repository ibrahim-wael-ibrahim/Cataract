#!/bin/sh
set -e

# Check if the "migrations" directory exists
if [ ! -d "migrations" ]; then
  echo "Migrations directory not found. Initializing migrations..."
  flask db init
  flask db migrate -m "Initial migration"
fi

# Apply migrations to update the schema
flask db upgrade

# Start the Flask application
exec flask run --host=0.0.0.0
