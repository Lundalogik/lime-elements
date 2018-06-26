DOCKER_IMAGE = lime-elements

.PHONY: build
build:
	@# Builds the ci image lime-elements.
	docker build --pull -t $(DOCKER_IMAGE) .

.PHONY: test
test:
	@# Runs all frontend tests.
	docker run --rm -w /lime $(DOCKER_IMAGE) npm run test
