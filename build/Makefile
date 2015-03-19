
.PHONY: all clean game editor game-css editor-css

# ===========================
game: r.js game-css
# ===========================
	# Build game
	node r.js -o config/build-game.js
	# Cleanup
	rm ../src/app-game.css
	#find dist/game -type -f -name '.DS_Store' -exec rm {} \;
	#find dist/game/modules/vas -type f -name '*.js' -exec rm {} \;
	#find dist/game/modules/vas -type d -empty -exec rmdir {} \;

# ===========================
editor: r.js editor-css
# ===========================
	node r.js -o config/build-editor.js

##########################################################

all: game editor

dist: dist/game-dist.tar.gz

clean:
	rm -rf dist/game
	rm -rf dist/editor

##########################################################

# Node.js optimizer
r.js:
	curl -o r.js http://requirejs.org/docs/release/2.1.16/r.js

# Resources: app-game.css
game-css: ../src/app-game.less
	(cd ../src; lessc app-game.less --clean-css="--s1 --advanced --compatibility=ie8" > app-game.css)

# Resources: app-editor.css
editor-css: ../src/app-editor.less
	(cd ../src; lessc app-editor.less --clean-css="--s1 --advanced --compatibility=ie8" > app-editor.css)

# Distribution archive
dist/game-dist.tar.gz: game
	(cd dist; tar -zcf game-dist.tar.gz game/)

