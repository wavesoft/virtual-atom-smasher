/**
 * [core/api/account] - Team API
 */
define(["vas/core/api/interface", "vas/config"], 

	function(APIInterface, Config) {

		/**
		 * APISocket Team
		 *
		 * This socket manages the team information such as messaging, invitation requests,
		 * and team achievements.
		 *
		 * @see {@link module:vas-core/api/interface~APIInterface|APIInterface} (Parent class)
		 * @exports vas-core/api/team
		 */
		var APITeam = function(apiSocket, chatroom) {

			// Initialize superclass
			APIInterface.call(this, apiSocket);

			// Setup properties
			this.chatroom = chatroom;
			this.active = true;

			// Join chatroom
			this.sendAction('select', { 'chatroom': chatroom } );

		}

		// Subclass from APIInterface
		APITeam.prototype = Object.create( APIInterface.prototype );

		/**
		 * Handle chatroom event
		 */
		APITeam.prototype.handleAction = function(action, data) {
			if (!this.active) return;
			console.log("Team action:",action,data);

			if (action == "profile") {

			}
		}

		// Return the Chatroom class
		return APITeam;

	}

);