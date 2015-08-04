$(function() {

	var Animator = function(dom, width, height, spritesX, spritesY) {
		this.dom = dom;
		this.width = width;
		this.height = height;
		this.spritesX = spritesX;
		this.spritesY = spritesY;
		this.frameX = 0;
		this.frameY = 0;
		this.fps = 16;
		this.frameDelay = 1000 / this.fps;
		this.dom.css({
			'width': width,
			'height': height
		});

		setInterval( this.next.bind(this), this.frameDelay );
	};

	Animator.prototype.next = function() {

		// Apply state
		this.dom.css({
			'background-position': '-' + (this.frameX * this.width) + 'px -' + (this.frameY * this.height) + 'px'
		});

		// Update
		if (++this.frameX >= this.spritesX) {
			this.frameX = 0;
			if (++this.frameY >= this.spritesY) {
				this.frameY = 0;
			}
		}

	}

	var a = new Animator($(".sprite"), 121, 178, 5, 1 );

});