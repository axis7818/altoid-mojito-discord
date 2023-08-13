#!/usr/bin/env bash

version=$(jq -r '.version' package.json)
docker build --platform linux/amd64 . \
	-t direwolfcr.azurecr.io/altoid-mojito-discord:${version} \
	-t direwolfcr.azurecr.io/altoid-mojito-discord:latest
