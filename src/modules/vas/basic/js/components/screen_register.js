

define(

	/**
	 * Dependencies
	 */
	[
		"jquery", "require", "vas/config", 
		"vas/core/registry", 
		"vas/core/base/components", 
		"vas/core/db", 
		"vas/core/ui", 
		"vas/core/user",

		"core/ui/view",
		"text!vas/basic/tpl/register.html" 
	],

	/**
	 * Basic version of the home screen
	 *
	 * @exports vas-basic/components/tuning_screen
	 */
	function($, require, config, R, C, DB, UI, User, View, tplLogin) {

		/**
		 * Find base directory for images
		 */
		var img_dir = require.toUrl("vas/basic/img");

		/**
		 * Registration scren
		 */
		var RegisterScreen = function(hostDOM) {
			C.RegisterScreen.call(this, hostDOM);

			// Add register class on the host DOM
			hostDOM.addClass("register");

			// Load view template
			this.loadTemplate( tplLogin );

			///////////////////////////////
			// View Data
			///////////////////////////////

			// General configuration
			this.viewData['img'] = img_dir;

			// Calculate birth year data
			this.viewData['birth_year'] = [];
			var y = new Date().getFullYear();
			for (var i=y-100; i<=y; i++) {
				this.viewData['birth_year'].push(i);
			}

			// Populate avatars table with select functionality
			this.select(".input.avatar-list", function(dom) {

				// Populate the avatars table
				var self = this,
					avatars = ['model-1.png', 'model-2.png', 'model-3.png', 'model-4.png', 
					           'model-5.png', 'model-6.png', 'model-7.png'];
				for (var i=0; i<avatars.length; i++) {
					var item = $('<div class="item" style="background-image: url('+img_dir+'/avatars/'+avatars[i]+')"></div>')
									.data("avatar", avatars[i])
									.appendTo(dom);
					item.click(function() {
						dom.find(".item").removeClass("selected");
						$(this).addClass("selected");
					});
					if (i == 0) item.addClass("selected");
				}

			});

			// Hide Alert by default
			this.select(".alert", function(dom) {
				dom.hide();
			});

			///////////////////////////////
			// View Control
			///////////////////////////////

			// Bind buttons
			this.select(".btn-cancel", (function(dom) {
				dom.click((function() {
					this.trigger('cancel');
				}).bind(this));
			}).bind(this));
			this.select(".btn-register", (function(dom) {
				dom.click((function() {
					var profile = this.compileProfile();
					if (!profile) return;
					console.log(profile);
					this.trigger('register', profile);
				}).bind(this));
			}).bind(this));

			///////////////////////////////
			// Render
			///////////////////////////////

			// Render template
			this.renderView();

		}
		RegisterScreen.prototype = Object.create( C.RegisterScreen.prototype );

		/**
		 * Collect all the fields into a profile object
		 */
		RegisterScreen.prototype.onRegistrationError = function(text) {
			this.hostDOM.scrollTop(0);
			this.select(".alert").html(text);
			this.select(".alert").fadeIn();
		}

		/**
		 * Mark particular field as invalid
		 */
		RegisterScreen.prototype.markInvalid = function(field) {
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

		/**
		 * Collect all the fields into a profile object
		 */
		RegisterScreen.prototype.compileProfile = function() {
			var profile = {};

			// Reset state
			this.select(".invalid").removeClass("invalid");
			this.select(".alert").hide();

			// Get obvious fields
			profile.username = this.valueOf("#f-username"); //this.fUsername.val();
			profile.displayName = this.valueOf("#f-displayname"); //this.fDisplayName.val();
			profile.email = this.valueOf("#f-email"); //this.fEmail.val();
			profile.gender = this.valueOf("#f-gender"); //this.fGender.val();
			profile.password = this.valueOf("#f-password1"); //this.fPassword1.val();
			profile.research = this.valueOf("#f-research");

			// Validate blank fields
			var noblank = this.select("#f-username,#f-displayname,#f-email,#f-gender,#f-password1,#f-research");
			for (var i=0; i<noblank.length; i++) {
				if (noblank[i].val() == "") {
					this.markInvalid(noblank[i]);
					this.onRegistrationError("This field cannot be blank!");
					return null;
				}
			}

			// Validate e-mail
			var rx_mail = /^\w[-._\w]*\w@\w[-._\w]*\w\.\w{2,3}$/;
			if (!profile.email.match(rx_mail)) {
				this.markInvalid(this.select("#f-email"));
				this.onRegistrationError("The e-mail address is not valid!");
				return null;
			}

			// Validate password
			profile.password = this.valueOf("#f-password1");
			if (this.valueOf("#f-password2") != profile.password) {
				this.markInvalid(this.select("#f-password2"));
				this.onRegistrationError("The passwords do not match!");
				return null;
			}

			// Pick avatar
			profile.avatar = this.select(".input.avatar-list .selected").data("avatar");

			// Compile birth date in UNIX timestamp
			profile.birthdate = Date.parse(
					this.valueOf("#f-birth-year") + "-" + 
					this.valueOf("#f-birth-month") + "-" +
					this.valueOf("#f-birth-day")
				) / 1000;

			return profile;
		};

		// Register screen component on the registry
		R.registerComponent( 'screen.register', RegisterScreen, 1 );

	}

);