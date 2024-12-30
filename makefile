config:
	bun docker-build && bun docker-run

clean_snapshots:
	find . -type d -name "__snapshots__" -exec rm -r {} +
