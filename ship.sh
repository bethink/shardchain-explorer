#!/usr/bin/env bash

NAME=aletheia
VERSION=$(grep version package.json | awk -F'"' '{print $4}')
TAR_GZ_FILE="${NAME}.${VERSION}.tar.gz"
echo "> version: ${VERSION}"
echo "> tar: ${TAR_GZ_FILE}"

if [[ -e "${TAR_GZ_FILE}" ]]; then
    echo "[WARN] file "${TAR_GZ_FILE}" already exists, skip"
else
    tar zcvf "${TAR_GZ_FILE}" ./dist
fi

scp "${TAR_GZ_FILE}" deploy.sh ggicci@192.168.2.100:/home/ggicci/deploy/aletheia/
# scp "${TAR_GZ_FILE}" seafile@api.tokenmetric.io:/home/seafile/deploy/aletheia/
scp "${TAR_GZ_FILE}" deploy.sh ubuntu@13.229.207.238:/home/ubuntu/deploy/aletheia/
