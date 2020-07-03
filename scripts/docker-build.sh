#!/usr/bin/env bash

version=$(jq -r '.version' package.json)
docker build . -t direwolfcr.azurecr.io/altoid-mojito-discord:${version}
