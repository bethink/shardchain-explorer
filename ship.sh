#!/usr/bin/env bash

NAME=aletheia
VERSION=$(grep version package.json | awk -F'"' '{print $4}')
TAR_GZ_FILE="${NAME}.${VERSION}.tar.gz"
echo "> version: ${VERSION}"
echo "> tar: ${TAR_GZ_FILE}"

if [[ -e "${TAR_GZ_FILE}" ]]; then
    echo "[ERROR] file "${TAR_GZ_FILE}" already exists, skip"
    exit 1
fi

tar zcvf "${TAR_GZ_FILE}" ./dist
scp "${TAR_GZ_FILE}" ggicci@192.168.2.100:/home/ggicci/deploy/aletheia/
