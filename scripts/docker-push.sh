#!/usr/bin/env bash

version=$(jq -r '.version' package.json)
docker push direwolfcr.azurecr.io/altoid-mojito-discord:${version}
docker push direwolfcr.azurecr.io/altoid-mojito-discord:latest
