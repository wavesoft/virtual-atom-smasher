define(
    [
        "jquery",
        "vas/core/base/components",
        "vas/core/registry",
        "text!vas/basic/tpl/home_new.html"
    ],

    /**
     * Basic version of the home screen
     *
     * @exports vas-basic/components/running_screen
     */
    function ($, C, R, tpl) {

        /**
         * @class
         * @classdesc The basic foo screen
         */
        var TuningScreen = function(hostDOM) {
            C.TuningScreen.call(this, hostDOM);

            // Load view template and plugins
            this.loadTemplate(tpl);

            /**
             * View Control
             */

            // Prepare host
            hostDOM.addClass("home-new");

            /**
             * Left menu buttons
             */

            // Help button
            this.select(".navbtn-help", (function (dom) {
                dom.click((function () {
                    // Do something when pressed
                    window.alert("help");
                }).bind(this));
            }).bind(this));

            // Profile button
            this.select(".navbtn-profile", (function (dom) {
                dom.click((function () {
                    // Do something when pressed
                    window.alert("profile");
                }).bind(this));
            }).bind(this));

            /**
             * Center menu buttons
             */

            // Knowledge button
            this.select(".navbtn-knowledge", (function (dom) {
                dom.click((function () {
                    // Do something when pressed
                    window.alert("knowledge");
                }).bind(this));
            }).bind(this));

            // Papers button
            this.select(".navbtn-papers", (function (dom) {
                dom.click((function () {
                    // Do something when pressed
                    window.alert("papers");
                }).bind(this));
            }).bind(this));

            // Teams button
            this.select(".navbtn-teams", (function (dom) {
                dom.click((function () {
                    // Do something when pressed
                    window.alert("teams");
                }).bind(this));
            }).bind(this));

            // Forum button
            this.select(".navbtn-forum", (function (dom) {
                dom.click((function () {
                    // Do something when pressed
                    window.alert("forum");
                }).bind(this));
            }).bind(this));

            /**
             * Levels navigation buttons
             */

            // Left button
            this.select(".navbtn-lvl-left", (function (dom) {
                dom.click((function () {
                    // Do something when pressed
                    window.alert("left");
                }).bind(this));
            }).bind(this));

            // Right button
            this.select(".navbtn-lvl-right", (function (dom) {
                dom.click((function () {
                    // Do something when pressed
                    window.alert("right");
                }).bind(this));
            }).bind(this));

            /**
             * Render template
             */
            this.renderView();

            /**
             * Handle mouse movement
             */
            this.mouseX = 0;
            this.mouseY = 0;
            hostDOM.mousemove((function(e) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.realignMachine(false);
                this.realignLevels();
            }).bind(this));

        }

        TuningScreen.prototype = Object.create(C.TuningScreen.prototype);

        /**
         * Define the parameters of the machine
         */
        TuningScreen.prototype.onTuningConfigUpdated = function(tuningConfig) {}

        /**
         * Realign machine layout
         */
        TuningScreen.prototype.realignMachine = function(realignCounters) {
            var machineW = this.select(".machine").width() + 80,
                machineH = this.select(".machine").height();

            // Realign based on cursor on smaller screens
            if (machineW > this.width - 50) {
                var delta = -(machineW - (this.width - 50)),
                    mouseDelta = (this.mouseX - this.width/2) * delta / this.width;
                this.select(".machine-frame").css({
                    'left': mouseDelta
                });
            } else {
                this.select(".machine-frame").css({
                    'left': 0
                });
            }

        }

        /**
         * Realign levels layout
         */
        TuningScreen.prototype.realignLevels = function(realignCounters) {
            var levelsW = this.select(".levels").width() + 80,
                levelsH = this.select(".levels").height();

            // Realign based on cursor on smaller screens
            if (levelsW > this.width - 50) {
                var delta = -(levelsW - (this.width - 50)),
                    mouseDelta = (this.mouseX - this.width/2) * delta / this.width;
                this.select(".levels-frame").css({
                    'left': mouseDelta
                });
            } else {
                this.select(".levels-frame").css({
                    'left': 0
                });
            }

        }

        /**
         * Register screen
         */
        R.registerComponent("screen.tuning", TuningScreen);

    }
);
