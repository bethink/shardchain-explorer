default: build

export APP_NAME=io.covenantsql.explorer
export IMAGE_NAME=covenantsql/explorer

SEBA := "./seba.sh"

.PHONY: seba-update status build install

seba-update:
	curl --retry 3 --silent "https://raw.githubusercontent.com/ggicci/sebastian/master/seba.sh" --output seba.sh
	chmod u+x seba.sh

status:
	@$(SEBA) status

build:
	yarn build
	@$(SEBA) build

install:
	@$(SEBA) install

upload:
	docker push covenantsql/explorer
