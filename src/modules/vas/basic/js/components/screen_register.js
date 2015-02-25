

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

			// Calculate birth year data
			this.viewData['birth_year'] = [];
			var y = new Date().getFullYear();
			for (var i=y-100; i<=y; i++) {
				this.viewData['birth_year'].push(i);
			}

			// Set view data
			this.setViewData({

			});

			// Hide Alert
			this.view.select(".alert", function(dom) {
				dom.hide();
			});

			// Populate birth date
			this.view.select("#f-birth-day", function(dom) {
				for (var i=1; i<=31; i++) {
					$('<option value="'+i+'">'+i+'</option>').appendTo(dom);
				}
			});

			// Populate birth month
			this.view.select("#f-birth-month", function(dom) {
				$('<option value="1">January</option>').appendTo(dom);
				$('<option value="2">February</option>').appendTo(dom);
				$('<option value="3">March</option>').appendTo(dom);
				$('<option value="4">April</option>').appendTo(dom);
				$('<option value="5">May</option>').appendTo(dom);
				$('<option value="6">June</option>').appendTo(dom);
				$('<option value="7">July</option>').appendTo(dom);
				$('<option value="8">August</option>').appendTo(dom);
				$('<option value="9">September</option>').appendTo(dom);
				$('<option value="10">October</option>').appendTo(dom);
				$('<option value="11">November</option>').appendTo(dom);
				$('<option value="12">December</option>').appendTo(dom);
			});

			// Populate birth year
			this.view.select("#f-birth-year", function(dom) {
			});

			// Populate avatars table
			this.view.select(".input.avatar-list", function(dom) {

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

			// Bind buttons
			this.view.select(".btn-cancel", (function(dom) {
				dom.click((function() {
					this.trigger('cancel');
				}).bind(this));
			}).bind(this));
			this.view.select(".btn-register", (function(dom) {
				dom.click((function() {
					var profile = this.compileProfile();
					if (!profile) return;
					console.log(profile);
					this.trigger('register', profile);
				}).bind(this));
			}).bind(this));

			// Render template
			this.view.update();

		}
		RegisterScreen.prototype = Object.create( C.RegisterScreen.prototype );

		/**
		 * Collect all the fields into a profile object
		 */
		RegisterScreen.prototype.onRegistrationError = function(text) {
			this.ePanel.scrollTop(0);
			this.eAlert.html(text);
			this.eAlert.fadeIn();
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
			this.ePanel.find(".invalid").removeClass("invalid");
			this.eAlert.hide();

			// Get obvious fields
			profile.username = this.view.valueOf("#f-username"); //this.fUsername.val();
			profile.displayName = this.view.valueOf("#f-displayname"); //this.fDisplayName.val();
			profile.email = this.view.valueOf("#f-email"); //this.fEmail.val();
			profile.gender = this.view.valueOf("#f-gender"); //this.fGender.val();
			profile.password = this.view.valueOf("#f-password1"); //this.fPassword1.val();
			profile.research = this.view.valueOf("#f-research");

			// Validate blank fields
			var noblank = this.view.select("#f-username,#f-displayname,#f-email,#f-gender,#f-password1,#f-research");
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
				this.markInvalid(this.view.select("#f-email"));
				this.onRegistrationError("The e-mail address is not valid!");
				return null;
			}

			// Validate password
			profile.password = this.fPassword1.val();
			if (this.view.valueOf("#f-password2") != profile.password) {
				this.markInvalid(this.view.select("#f-password2"));
				this.onRegistrationError("The passwords do not match!");
				return null;
			}

			// Pick avatar
			profile.avatar = this.view.select(".input.avatar-list .selected").data("avatar");

			// Compile birth date in UNIX timestamp
			profile.birthdate = Date.parse(
					this.view.valueOf("#f-birth-year") + "-" + 
					this.view.valueOf("#f-birth-month") + "-" +
					this.view.valueOf("#f-birth-day")
				) / 1000;

			return profile;
		};

		// Register screen component on the registry
		R.registerComponent( 'screen.register', RegisterScreen, 1 );

	}

);