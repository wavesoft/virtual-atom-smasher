
.PHONY: doc

doc: doc/JSDoc/html

doc/JSDoc/html:
	jsdoc -r -c doc/JSDoc/conf.json -R doc/JSDoc/index.md src/modules/core src/modules/vas/core src/modules/tootr

