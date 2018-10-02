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
	docker run --rm --cap-add=SYS_ADMIN -w /lime $(DOCKER_IMAGE) npm run test

.PHONY: release_dry_run
release_dry_run: BRANCH=''
release_dry_run:
	@# Builds the production build.
	docker run --rm --user=root -e CI -e GH_TOKEN -e NPM_TOKEN -e GIT_AUTHOR_NAME -e GIT_AUTHOR_EMAIL -e GIT_COMMITTER_NAME -e GIT_COMMITTER_EMAIL -w /lime $(DOCKER_IMAGE) /bin/bash -c "npm run build && npx semantic-release --dry-run --branch $(BRANCH)"

.PHONY: release
release:
	@# Bumps and publishes.
	docker run --rm --user=root -e CI -e GH_TOKEN -e NPM_TOKEN -e GIT_AUTHOR_NAME -e GIT_AUTHOR_EMAIL -e GIT_COMMITTER_NAME -e GIT_COMMITTER_EMAIL -w /lime $(DOCKER_IMAGE) npm run release
