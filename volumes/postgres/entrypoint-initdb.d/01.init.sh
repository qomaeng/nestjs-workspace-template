#!/bin/bash

set -eu

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-'EOSQL'
  \set dbname `echo :DBNAME`

  -----------------------------------------------------------------
  -- Revoke PUBLIC privileges
  -----------------------------------------------------------------

  -- Revoke privileges (PUBLIC -> current_database())
  REVOKE ALL ON DATABASE :dbname FROM PUBLIC;

  -- Revoke privileges (PUBLIC -> public)
  REVOKE CREATE ON                  SCHEMA public FROM PUBLIC;
  REVOKE ALL    ON ALL TABLES    IN SCHEMA public FROM PUBLIC;
  REVOKE ALL    ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
  REVOKE ALL    ON ALL ROUTINES  IN SCHEMA public FROM PUBLIC;

  -- Revoke default privileges (PUBLIC -> current_user.objects)
  ALTER DEFAULT PRIVILEGES REVOKE ALL ON ROUTINES FROM PUBLIC;

  -----------------------------------------------------------------
  -- Hardening template1
  -----------------------------------------------------------------

  \c template1

  -- Revoke privileges (PUBLIC -> template1)
  REVOKE ALL ON DATABASE template1 FROM public;

  -- Revoke privileges (PUBLIC -> public)
  REVOKE CREATE ON                  SCHEMA public FROM PUBLIC;
  REVOKE ALL    ON ALL TABLES    IN SCHEMA public FROM PUBLIC;
  REVOKE ALL    ON ALL SEQUENCES IN SCHEMA public FROM PUBLIC;
  REVOKE ALL    ON ALL ROUTINES  IN SCHEMA public FROM PUBLIC;

  -- Revoke default privileges (PUBLIC -> current_user.objects)
  ALTER DEFAULT PRIVILEGES REVOKE ALL ON ROUTINES FROM PUBLIC;
EOSQL
