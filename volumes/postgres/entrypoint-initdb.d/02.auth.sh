#!/bin/bash

set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  DO \$\$
  DECLARE
    v_log_statement text := current_setting('log_statement', true);

    v_schema   text := '$POSTGRES_AUTH_SCHEMA';
    v_user     text := '$POSTGRES_AUTH_OWNER';
    v_password text := '$POSTGRES_AUTH_PASSWORD';
  BEGIN
    --------------------------
    --         User
    --------------------------

    -- Set log_statement(none) to hide password
    PERFORM set_config('log_statement', 'none', true);

    -- Create user
    EXECUTE format('CREATE USER %I PASSWORD %L CREATEROLE', v_user, v_password);

    -- Reset log_statement
    PERFORM set_config('log_statement', v_log_statement, true);

    -- Revoke default privileges (PUBLIC -> user.objects)
    EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE %I REVOKE ALL ON ROUTINES FROM PUBLIC', v_user);

    -- Set search_path (schema, public)
    EXECUTE format(
      'ALTER ROLE %I IN DATABASE %I SET search_path = %I, public',
      v_user, current_database(), v_schema
    );

    -- Grant privileges (user -> current_database())
    EXECUTE format('GRANT CONNECT, TEMP ON DATABASE %I TO %I WITH GRANT OPTION', current_database(), v_user);

    --------------------------
    --        Schema
    --------------------------

    -- Create schema
    EXECUTE format('CREATE SCHEMA %I AUTHORIZATION %I', v_schema, v_user);
  END \$\$;
EOSQL
