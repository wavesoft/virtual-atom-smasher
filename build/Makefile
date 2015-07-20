
.PHONY: all clean game editor game-css editor-css

# Base directories
SRC = ../src
DIST = dist
MODULES = $(SRC)/modules

# Lookup sources
JS_CORE = $(wildcard $(MODULES)/core/*.js) $(wildcard $(MODULES)/core/*/*.js)
JS_EXTERN = $(wildcard $(MODULES)/extern/*.js) $(wildcard $(MODULES)/extern/*/*.js)
JS_TOOTR = $(wildcard $(MODULES)/tootr/*.js) $(wildcard $(MODULES)/tootr/*/*.js)
JS_TOOTR_EDITOR = $(wildcard $(MODULES)/tootr_editor/*.js) $(wildcard $(MODULES)/tootr_editor/*/*.js)
JS_VAS = $(wildcard $(MODULES)/vas/*.js) $(wildcard $(MODULES)/vas/*/*.js)

# Lookup resources
RES_LESS = $(wildcard $(MODULES)/vas/*/*.less)
RES_IMAGES = $(wildcard $(MODULES)/*/*.jpg) $(wildcard $(MODULES)/*/*.png) \
			 $(wildcard $(MODULES)/*/*.gif) $(wildcard $(MODULES)/*/*.css)

# Get git tag
GIT_TAG = $(shell git symbolic-ref HEAD 2> /dev/null | cut -b 12-)
GIT_REV = $(shell git log --pretty=format:%h -1)
GIT_VERSION = $(GIT_TAG)-$(GIT_REV)

# ===========================
game: $(DIST)/game/app-game.js $(DIST)/game/app-game.css
# ===========================

# Resources: app-game.css
$(DIST)/game/app-game.css: $(SRC)/app-game.less $(RES_LESS)

	# Use lessc to compile the game css
	(cd $(SRC); lessc app-game.less --clean-css="--s1 --advanced --compatibility=ie8" > app-game.css)

	# Move file to dist
	mv $(SRC)/app-game.css $(DIST)/game/app-game.css

# Game source
$(DIST)/game/app-game.js: r.js config/build-game.js $(SRC)/app-game.js $(JS_CORE) $(JS_EXTERN) $(JS_TOOTR) $(JS_VAS) $(RES_IMAGES)

	# Update version tag in the production config
	sed -i.bak "s/'version': '.*'/'version': '$(GIT_VERSION)'/g" $(MODULES)/vas/config-prod.js

	# Build game
	node r.js -o config/build-game.js

# Distribution archive
$(DIST)/game-dist.tar.gz: $(DIST)/game/app-game.js $(DIST)/game/app-game.css

	# Cleanup junk files
	find $(DIST)/game -type f -name '.DS_Store' -exec rm {} \;
	find $(DIST)/game/modules/vas -type f -name '*.js' -exec rm {} \;

	# Remove build log file
	rm $(DIST)/game/build.txt ||:

	# Cleanup empty directories
	find $(DIST)/game/modules/vas -type d -empty -exec rmdir {} \; 2>/dev/null ||:
	find $(DIST)/game/modules/vas -type d -empty -exec rmdir {} \; 2>/dev/null ||:
	find $(DIST)/game/modules/vas -type d -empty -exec rmdir {} \; 2>/dev/null ||:
	find $(DIST)/game/modules/vas -type d -empty -exec rmdir {} \; 2>/dev/null ||:
	find $(DIST)/game/modules/vas -type d -empty -exec rmdir {} \; 2>/dev/null ||:
	find $(DIST)/game/modules/vas -type d -empty -exec rmdir {} \; 2>/dev/null ||:

	# Create archive
	(cd dist; tar -zcf game-dist.tar.gz game/)

# Deploy game when having access to the local servers
deploy-game: $(DIST)/game-dist.tar.gz

	# Deploy to webservers
	scp $(DIST)/game-dist.tar.gz root@t4tc-vas-web-1.cern.ch:/home/vas/vas-dist
	scp $(DIST)/game-dist.tar.gz root@t4tc-vas-web-2.cern.ch:/home/vas/vas-dist

	# Deploy website
	ssh root@t4tc-vas-web-1.cern.ch '(cd /home/vas/vas-dist; tar -zxf game-dist.tar.gz)'
	ssh root@t4tc-vas-web-2.cern.ch '(cd /home/vas/vas-dist; tar -zxf game-dist.tar.gz)'

# ===========================
editor: r.js $(SRC)/app-editor.css
# ===========================

# Resources: app-editor.css
$(DIST)/game/app-editor.css: $(SRC)/app-editor.less $(RES_LESS)

	# Use lessc to compile the game css
	(cd $(SRC); lessc app-editor.less --clean-css="--s1 --advanced --compatibility=ie8" > app-editor.css)

	# Move file to dist
	mv $(SRC)/app-editor.css $(DIST)/game/app-editor.css


editor: r.js $(SRC)/app-editor.css
	node r.js -o config/build-editor.js

# ===========================
all: game editor
# ===========================

dist: $(DIST)/game-dist.tar.gz

clean:
	rm -rf $(DIST)/game
	rm -rf $(DIST)/editor

deploy: deploy-game

# ===========================
# Required dependencies
# ===========================

# Download Node.js optimizer if missing
r.js:
	curl -o r.js http://requirejs.org/docs/release/2.1.16/r.js
