#!/bin/bash

# Run the EF Core scaffold command using the environment variables
if [ -f ../../config.env ]; then
    export $(cat ../../config.env | xargs)
fi

dotnet ef dbcontext scaffold \
  "Host=localhost;Port=5432;Database=$POSTGRES_DB;Username=$POSTGRES_USER;Password=$POSTGRES_PASSWORD;" \
  Npgsql.EntityFrameworkCore.PostgreSQL \
  --output-dir ../dataAccess/Models \
  --context-dir . \
  --context DMIContext \
  --no-onconfiguring \
  --force
  
  ##Run it with GitBash turn on docker remember be in dataAccess folder


