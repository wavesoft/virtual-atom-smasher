/**
 * [core/api/chatroom] - Chatroom API
 */
define(["vas/core/api/interface", "vas/config"], 

	function(APIInterface, Config) {

		/**
		 * APISocket Chatroom
		 *
		 * @see {@link module:vas-core/api/interface~APIInterface|APIInterface} (Parent class)
		 * @exports vas-core/api/chatroom
		 */
		var APIChatroom = function(apiSocket, chatroom) {

			// Initialize superclass
			APIInterface.call(this, apiSocket);

			// Setup properties
			this.chatroom = chatroom;
			this.active = true;

			// Join chatroom
			this.sendAction('select', { 'chatroom': chatroom } );

		}

		// Subclass from APIInterface
		APIChatroom.prototype = Object.create( APIInterface.prototype );

		/**
		 * Handle chatroom event
		 */
		APIChatroom.prototype.handleAction = function(action, data) {
			console.log("Chat action:",action,data);
			if (action == "join") {
				this.trigger('join', data);

			} else if (action == "leave") {
				this.trigger('leave', data);

			} else if (action == "chat") {
				this.trigger('chat', data);

			} else if (action == "presence") {
				this.trigger('presence', data);
				for (var i=0; i<data['users'].length; i++) {
					this.trigger('join', { 'user': data['users'][i] });
				}
				
			}
		}

		/**
		 * Send a chat message to the chatroom
		 */
		APIChatroom.prototype.send = function(chat) {
			this.sendAction('chat', { 'message': chat });
		}

		// Return the Chatroom class
		return APIChatroom;

	}

);