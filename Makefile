DOCKER_IMAGE = lime-elements

.PHONY: build
build:
	@# Builds the ci image lime-elements.
	docker build --pull -t $(DOCKER_IMAGE) .

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
	docker run --rm --cap-add=SYS_ADMIN -w /lime $(DOCKER_IMAGE) npm run test:ci

.PHONY: release
release:
	@# Bumps and publishes.
	docker run --rm --user=root -e CI -e GH_TOKEN -e NPM_TOKEN -w /lime $(DOCKER_IMAGE) npm run publish
