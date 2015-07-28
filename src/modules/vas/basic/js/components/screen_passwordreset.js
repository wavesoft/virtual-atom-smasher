
define(

	// Requirements
	["vas/core/registry", "vas/core/base/components", "text!vas/basic/tpl/passwordreset.html"],

	/**
	 * Basic version of the home backdrop
	 *
	 * @exports basic/components/backdrop_home
	 */
	function( R,C, tpl) {

		/**
		 * @class
		 * @classdesc Password reset screen
		 */
		var PaswordReset = function( hostDOM ) {
			C.PasswordResetScreen.call(this, hostDOM);

			// Add register class on the host DOM
			hostDOM.addClass("passwordreset");

			// Load view template and plutins
			this.loadTemplate(tpl);

			// Bind events
			this.select(".btn-submit", (function (elm) {
				elm.click((function(e) {

					// Prevent default
					e.preventDefault();
					e.stopPropagation();

					// Reset state
					this.select(".invalid").removeClass("invalid");
					this.select(".alert").hide();

					// Get form fields
					var blankCount = 0,
						pin = this.forms[0].pin,
						pw1 = this.forms[0].password1,
						pw2 = this.forms[0].password2;

					// Validate blank fields
					var noblank = ['password2','password1','pin'],
						blankCount = 0;
					for (var i=0; i<noblank.length; i++) {
						if (this.forms[0][noblank[i]] == "") {
							this.markInvalid(this.forms[0].elements[noblank[i]]);
							blankCount += 1;
						}
					}
					if (blankCount > 0) {
						if (blankCount == 1) {
							this.onPasswordResetError("This field cannot be blank!");
						} else {
							this.onPasswordResetError("These fields cannot be blank!");
						}
						return false;
					}

					// Validate password
					if (pw1 != pw2) {
						this.markInvalid(this.forms[0].elements.password2);
						this.onPasswordResetError("The passwords do not match!");
						return false;
					}

					// Trigger submit
					this.trigger("submit", pin, pw1 );

				}).bind(this));
			}).bind(this));

			this.select(".btn-cancel", (function (elm) {
				elm.click((function(e) {
					// Prevent default
					e.preventDefault();
					e.stopPropagation();
					// Trigger close
					this.trigger("close");
				}).bind(this));
			}).bind(this));

			// Render view
			this.renderView();

		}
		PaswordReset.prototype = Object.create( C.PasswordResetScreen.prototype );

		/**
		 * Callback when a password reset error occurs
		 */
		PaswordReset.prototype.onPasswordResetError = function(text) {
			this.hostDOM.children().scrollTop(0);
			this.select(".alert").html(text);
			this.select(".alert").fadeIn();
		}

		/**
		 * Mark particular field as invalid
		 */
		PaswordReset.prototype.markInvalid = function(field) {
			field.addClass("invalid");
			field.focus();

			var f = function() {
				if (field.val() != "") {
					field.off('blur', f);
					field.removeClass("invalid");
				}
			};
			field.on('blur', f);
		}

		// Register reset password screen
		R.registerComponent( "screen.resetpassword", PaswordReset, 1 );

	}

);