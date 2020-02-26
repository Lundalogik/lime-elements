DOCKER_IMAGE = lime-elements

.PHONY: build
build:
	@# Builds the ci image lime-elements.
	docker build --build-arg GH_TOKEN=${GH_TOKEN} --pull -t $(DOCKER_IMAGE) .

.PHONY: lint
lint:
	@# Lints all applicable files.
	docker run --rm -w /lime $(DOCKER_IMAGE) npm run lint

.PHONY: commitlint
commitlint: HASH=''
commitlint:
	@# Lint the commit message of the commit with the given HASH
	docker run --rm -w /lime $(DOCKER_IMAGE) npx commitlint -f $(HASH)^ -t $(HASH)

.PHONY: test
test:
	@# Runs all frontend tests.
	docker run --rm --cap-add=SYS_ADMIN -w /lime $(DOCKER_IMAGE) npm run test

.PHONY: build_docs
build_docs:
	@# Builds the docs-app.
	docker run --rm -w /lime $(DOCKER_IMAGE) npm run docz:build

.PHONY: release_dry_run
release_dry_run: BRANCH=''
release_dry_run:
	@# Builds the production build.
	docker run --rm --user=root -e CI -e GH_USERNAME -e GH_TOKEN -e NPM_TOKEN -w /lime $(DOCKER_IMAGE) /bin/bash -c "npm run build && npx semantic-release --dry-run --branch $(BRANCH)"

.PHONY: release
release:
	@# Bumps and publishes.
	docker run --rm --user=root -e CI -e GH_USERNAME -e GH_TOKEN -e NPM_TOKEN -w /lime $(DOCKER_IMAGE) npm run release
