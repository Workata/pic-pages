.PHONY: run
run:
	@echo "Running react application..."
	npm start

.PHONY: format
format:
	@echo "Formatting..."
	npm run format

.PHONY: lint
lint:
	@echo "Linting..."
	npm run lint

.PHONY: check
check:
	@echo "Formatting and linting..."
	npm run check
