NPM_BIN=./node_modules/.bin
LINT_SPEC='./src/**/*.ts'
TEST_SPEC=-r ts-node/register -S --ui bdd --timeout 5000 --recursive test/**/*.spec.ts --colors --reporter spec


.PHONY: build
build:
	npm run build

.PHONY: lint
lint:
	@$(NPM_BIN)/eslint $(LINT_SPEC)

.PHONY: test
test:
	make build
	@$(NPM_BIN)/mocha $(TEST_SPEC)

.PHONY: test-ci
test-ci:
	make build
	@rm -rf ./coverage && $(NPM_BIN)/istanbul cover $(NPM_BIN)/_mocha --report lcovonly -- $(TEST_SPEC)

.PHONY: coverage
coverage:
	@rm -rf ./coverage && $(NPM_BIN)/istanbul cover $(NPM_BIN)/_mocha -- $(TEST_SPEC)
