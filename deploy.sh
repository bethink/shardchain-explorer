#!/usr/bin/env bash

set -o errexit

repogz=$(ls -t aletheia.*.tar.gz 2>/dev/null | head -n 1)
if [[ "${repogz}" == "" ]]; then
	echo "no image to deploy"
	exit 1
fi

echo "deploy: ${repogz}"
rm -rf dist
tar zxvf "${repogz}"

cd ../nginx/ && docker-compose restart

echo "deployed successfully!"
