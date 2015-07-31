
define(["core/util/event_base"], 

	function(EventBase) {

		/**
		 * @class Sequencer
		 */
		var Sequencer = function() {
			EventBase.apply(this);
			this.stack = [];
			this.blocked = false;
		};

		// Subclass from EventBase
		Sequencer.prototype = Object.create( EventBase.prototype );

		/**
		 * Schedule something to be fired upon sequence completion
		 */
		Sequencer.prototype.schedule = function( fn ) {

			// Schedule this item
			this.stack.push(fn);

			// If that's the only element and we are not blocked, continue
			if ((this.stack.length == 1) && (!this.blocked))
				setTimeout( this.continue.bind(this), 100 );

		}

		/**
		 * Continue with the next item in sequence
		 */
		Sequencer.prototype.continue = function() {
			
			// Don't do anything on empty stack
			if (!this.stack.length) return;

			// Schedule next item in squence
			try { 
				var fn = this.stack[0];

				// Fire function and pass continue callback
				fn((function() {

					// Shift item from stack
					this.stack.shift();

					// Call next function outside the main call stack
					setTimeout( this.continue.bind(this), 100 );

				}).bind(this)) ;
			} 
			catch(e) {
				// Log exception
				console.error("Exception while firing sequencer item:", e);
			}

		}

		/**
		 * Block sequencer to prohibit interactions
		 */
		Sequencer.prototype.block = function() {
			this.blocked = true;
		}

		/**
		 * Unblock sequencer to continue interactions
		 */
		Sequencer.prototype.unblock = function() {
			this.blocked = false;
			this.continue();
		}

		// Return sequencer instance
		return new Sequencer();

	}

);