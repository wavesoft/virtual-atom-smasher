
.PHONY: doc

doc: doc/JSDoc/html

doc/JSDoc/html:
	jsdoc -r -c doc/JSDoc/conf.json src/modules

