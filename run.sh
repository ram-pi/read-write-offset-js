#!/usr/bin/env bash

set -a            
source .env.local
set +a

node --no-warnings send_to_dlq.js