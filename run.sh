#!/usr/bin/env bash

set -a            
source .env.local
set +a

node send_to_dlq.js