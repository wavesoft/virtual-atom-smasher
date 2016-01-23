define(

	// Dependencies
	["jquery", "core/ui/tabs", "vas/core/registry", "vas/core/ui", "vas/core/base/components/tuning", "vas/config", "vas/core/user",
	 "text!vas/basic/tpl/screen/block/home/tuning_notepad.html" ], 

	/**
	 * This is the tuning notepad shown aside with the tuning panel
	 *
 	 * @exports vas-basic/screen/block/home/tuning_notepad
	 */
	function($, Tabs, R, UI, TC, Config, User, tpl) {

		function dateFromTs(ts) {
    		var date = new Date(ts*1000);
    		return (
    			('0'+date.getDate()).substr(-2) + '/' +
    			('0'+date.getMonth()).substr(-2) + '/' +
    				 date.getFullYear() + ' ' +
    			('0'+date.getHours()).substr(-2) + ':' +
    			('0'+date.getMinutes()).substr(-2) + ':' +
    			('0'+date.getSeconds()).substr(-2)
    		);
		}

		/**
		 * @class
		 * @registry screen.block.tuning_notepad
		 * @template screen/block/home/tuning_notepad.html
		 * @augments module:vas-core/base/components/tuning~TuningNotepad
		 */
		var DefaultTuningNotepad = function(hostDOM) {
			// Initialize widget
			TC.TuningNotepad.call(this, hostDOM);

			// Render template
            this.loadTemplate(tpl);
            this.renderView();

			// Create a tabs controller
			this.tabsController = new Tabs(
					this.select(".notepad-body"),
					this.select(".notepad-tabs > ul")
				);

			// Create sub-component for the tab
			this.valuesTab = R.instanceComponent("screen.block.tuning_notepad.values", this.select(".body-data"));
			this.forwardVisualEvents( this.valuesTab );
			this.adoptEvents( this.valuesTab );

		}

		// Subclass from TuningNotepad
		DefaultTuningNotepad.prototype = Object.create( TC.TuningNotepad.prototype );

		////////////////////////////////////////////////////////////
		// Helper functions
		////////////////////////////////////////////////////////////

		DefaultTuningNotepad.prototype.reloadForumPosts = function() {

			// Update link
			this.select("a.notes-button")
				.attr("href", Config.forum_vas_api + '?auth=' + User.profile.token + '&term=Notes&scope=team');

			// Get team notes
			User.getTeamNotes((function(notes) {

				// Update team notes
				var notesHost = this.select(".notes-host");
				notesHost.empty();

				// Create posts
				for (var i=0; i<notes.length; i++) {
					var n = notes[i];
					$('<div class="note"></div>').appendTo(notesHost)
						.append( $('<div class="date"></div>').text( dateFromTs( n.dateline ) )	)
						.append( $('<div class="name"></div>').text( n.username ) )
						.append( $('<div class="message"></div>').text( n.message )	);
				}

			}).bind(this));
		}

		/**
		 * Realign the DOM element on resize
		 */
		DefaultTuningNotepad.prototype.onResize = function( width, height ) {

			// Center us in the middle of the size allocated
			this.hostDOM.css({
				'left': (width - this.getPreferredSize()[0]) / 2,
				'top': (height - this.getPreferredSize()[1]) / 2,
			});

		}

		/**
		 * The preferred size component is used to fix the size of the
		 * notepad, so we have to return at least the width component.
		 *
		 * @return {array} The preferred dimentions
		 */
		DefaultTuningNotepad.prototype.getPreferredSize = function() {
			return [ 320, 390 ];
		}

		////////////////////////////////////////////////////////////
		// Interface Implementation
		////////////////////////////////////////////////////////////

		/**
		 * Update level information
		 */
		DefaultTuningNotepad.prototype.onLevelDefined = function(details) {
			this.select(".notepad-title > .level").text("Level "+details['index']);
			this.select(".notepad-title > .title").text(details['title']);
			this.select(".body-help").html(details['desc']);
		}

		/**
		 * Update notes from team thread when shown
		 */
		DefaultTuningNotepad.prototype.onShown = function() {
			this.reloadForumPosts();
		}

		// Store tuning widget component on registry
		R.registerComponent( 'screen.block.tuning_notepad', DefaultTuningNotepad, 1 );

	}

);