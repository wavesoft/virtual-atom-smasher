
.PHONY: doc

doc:
	jsdoc -r -c doc/JSDoc/conf.json -R doc/JSDoc/index.md -t doc/JSDoc/jaguarjs-jsdoc \
		src/modules/vas/basic src/modules/vas/core src/modules/core

