define(
    
    // Dependencies
    [
        "jquery", 
        "vas/core/base/components", 
        "vas/core/registry", 
        "text!vas/basic/tpl/login.html"
    ],
    
    /**
	 * Basic version of the home screen
	 *
	 * @exports vas-basic/components/running_screen
	 */
    function ($, C, R, tpl) {

        /**
         * @class
         * @classdesc The basic home screen
         */
        var LoginScreen = function (hostDOM) {
            C.LoginScreen.call(this, hostDOM);

            // Load view template and plutins
            this.loadTemplate(tpl);

            ///////////////////////////////
            // View Control
            ///////////////////////////////

            // Prepare host
            hostDOM.addClass("login");

            // Create a slpash backdrop
            this.select(".backdrop", (function (e) {
                this.backdrop = R.instanceComponent("backdrop.login", e);
            }).bind(this));

            // Register button
            this.select(".btn-register", (function (dom) {
                dom.click((function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.trigger("register", this.select("#login-email").val(), this.select("#login-password").val());
                }).bind(this));
            }).bind(this));

            // Login button
            this.select(".btn-login", (function (dom) {
                dom.click((function (e) {
                    // Prevent default
                    e.preventDefault();
                    e.stopPropagation();
                    // Save e-mail
                    localStorage.setItem("vas-login", this.select("#login-email").val());
                    // Trigger login
                    this.trigger("login", this.select("#login-email").val(), this.select("#login-password").val());
                }).bind(this));
            }).bind(this));

            // Render template
            this.renderView();

            // Handle log-in with enter
            this.select("#login-email").keypress((function (e) {
                if (e.keyCode == 13)
                    this.select(".btn-login").click();
            }).bind(this));
            this.select("#login-password").keypress((function (e) {
                if (e.keyCode == 13)
                    this.select(".btn-login").click();
            }).bind(this));

        }

        LoginScreen.prototype = Object.create(C.LoginScreen.prototype);

        /**
         * Reset/populate form on show
         */
        LoginScreen.prototype.onWillShow = function (ready) {
            // Pre-populate log-in field
            this.select("#login-email").val(localStorage.getItem("vas-login"));
            ready();
        }

        /**
         * Focus username or password upon show
         */
        LoginScreen.prototype.onShown = function () {
            // If we have username focus on password
            if (!this.select("#login-email").val()) {
                this.select("#login-email").focus();
            } else {
                this.select("#login-password").focus();
            }
        }

        // Register login screen
        R.registerComponent("screen.login", LoginScreen, 1);

    }
);
