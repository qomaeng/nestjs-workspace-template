#!/usr/bin/env bash

openssl ecparam -name prime256v1 -genkey -noout -out jwt-private.ec256.key
openssl ec -in jwt-private.ec256.key -pubout -out jwt-public.ec256.pem
