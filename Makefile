NPM_BIN=./node_modules/.bin
LINT_SPEC= *.js ./src ./test
TEST_SPEC=-S --ui bdd --timeout 5000 --recursive test/ --colors --reporter spec

.PHONY: lint
lint:
	@$(NPM_BIN)/eslint --fix $(LINT_SPEC)

.PHONY: test
test:
	@$(NPM_BIN)/mocha $(TEST_SPEC)

.PHONY: test-ci
test-ci:
	@rm -rf ./coverage && $(NPM_BIN)/istanbul cover $(NPM_BIN)/_mocha --report lcovonly -- $(TEST_SPEC)

.PHONY: coverage
coverage:
	@rm -rf ./coverage && $(NPM_BIN)/istanbul cover $(NPM_BIN)/_mocha -- $(TEST_SPEC)