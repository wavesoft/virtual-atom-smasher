define(
    [
        "jquery",
        "vas/core/base/components",
        "vas/core/registry",
        "vas/core/user",
        "vas/core/ui",
        "text!vas/basic/tpl/screen/home.html"
    ],

    /**
     * Basic version of the home screen
     *
     * @exports vas-basic/components/running_screen
     */
    function ($, C, R, User, UI, tpl) {

        /**
         * This is the basic version of the game's home screen.
         *
         * @class
         * @classdesc The basic home screen
         * @augments module:vas-core/base/components~HomeScreen
         * @template vas/basic/tpl/screen/home.html
         * @registry screen.home
         */
        var HomeScreen = function(hostDOM) {
            C.HomeScreen.call(this, hostDOM);

            // Prepare host
            hostDOM.addClass("home");

            // Render template
            this.loadTemplate(tpl);
            this.renderView();

            //
            // Sub-components
            //

            // Backdrop
            this.backdrop = R.instanceComponent("backdrop.home", this.select(".backdrop"));
            this.forwardVisualEvents( this.backdrop, { 'left':0, 'top': 0, 'width': '100%', 'height': '100%' } );               

            // Tuning machine
            this.machine = R.instanceComponent("screen.block.machine", this.select(".machine"));
            this.forwardVisualEvents( this.machine );

            // Tuning screen
            this.tuningScreen = R.instanceComponent("screen.block.tuning_screen", this.select(".screen-tuning").hide() );
            this.forwardVisualEvents( this.tuningScreen, { 'left':0, 'top': 50, 'right': 0, 'bottom': 15 } );               
            this.tuningScreen.on('close', (function() {
                this.hideTuningScren();
            }).bind(this));


            //
            // Left menu buttons
            //

            // Help button
            this.select(".navbtn-help").click((function () {
                // Do something when pressed
                this.trigger('explain', 1);
            }).bind(this));

            // Profile button
            this.select(".navbtn-profile").click((function () {
                // Do something when pressed
                window.alert("profile");
            }).bind(this));

            ///
            // Center menu buttons
            //

            // Knowledge button
            this.select(".navbtn-knowledge").click((function () {
                // Do something when pressed
                UI.showOverlay('overlay.knowledge', UI.Transitions.SCALEDOWN_TOP);
            }).bind(this));

            // Papers button
            this.select(".navbtn-papers").click((function () {
                // Do something when pressed
                UI.showOverlay('overlay.papers', UI.Transitions.SCALEDOWN_TOP);
            }).bind(this));

            // Teams button
            this.select(".navbtn-teams").click((function () {
                // Do something when pressed
                UI.showOverlay('overlay.teams', UI.Transitions.SCALEDOWN_TOP);
            }).bind(this));

            // Forum button
            this.select(".navbtn-forum").click((function () {
                // Do something when pressed
                window.alert("forum");
            }).bind(this));

            //
            // Levels navigation buttons
            //

            // Left button
            this.select(".navbtn-lvl-left").click((function () {
                this.slideTransition(false, (function() {
                    this.levelOffset -= 7;
                    this.updateLevels();
                }).bind(this))
            }).bind(this));

            // Right button
            this.select(".navbtn-lvl-right").click((function () {
                this.slideTransition(true, (function() {
                    this.levelOffset += 7;
                    this.updateLevels();
                }).bind(this))
            }).bind(this));

            //
            // Handle dynamic levels
            //

            this.select(".levels-container .levels .levelbtn").each((function(i, elm) {

                // Handle click
                $(elm).click((function(e) {
                    // Prevent event propagation so it's considered a valid click
                    e.stopPropagation();
                    e.preventDefault();
                    // Handle click
                    this.handleLevelClick( this.levels[this.levelOffset + i] );
                }).bind(this));

                // Handle mouse over
                $(elm).mouseover((function(e) {
                    // Handle click
                    this.handleLevelHover( this.levels[this.levelOffset + i], $(elm) );
                }).bind(this));

            }).bind(this));

            //
            // Handle mouse movement
            //

            this.mouseX = 0;
            this.mouseY = 0;
            hostDOM.mousemove((function(e) {
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.realignMachine(false);
                this.realignLevels();
            }).bind(this));

            // Level offset
            this.levelOffset = 0;
            this.levels = [];

        }

        HomeScreen.prototype = Object.create(C.HomeScreen.prototype);

        /**
         * Define the parameters of the machine
         */
        HomeScreen.prototype.onTuningConfigUpdated = function(tuningConfig) { }

        /**
         * Initialize levels before showing
         */
        HomeScreen.prototype.onWillShow = function( cb ) {

            // Enumerate levels
            User.enumLevels((function(levels) {

                // Set level configuration
                this.levels = levels;
                this.updateLevels();

                // Continue
                cb();

            }).bind(this));

        }

        /**
         * Handle hovering over a level button
         */
        HomeScreen.prototype.handleLevelHover = function( levelConfig, dom ) {

        }

        /**
         * Handle clicking on a level button
         */
        HomeScreen.prototype.handleLevelClick = function( levelConfig ) {
            this.showTuningScreen( levelConfig );
        }

        /**
         * Update the level configuration according to the local properties
         */
        HomeScreen.prototype.updateLevels = function() {

            // Hide/Show left button
            if (this.levelOffset <= 0) {
                this.select(".navbtn-lvl-left").hide();
            } else {
                this.select(".navbtn-lvl-left").show();
            }

            // Hide/Show right button
            if ((this.levelOffset+7) >= this.levels.length) {
                this.select(".navbtn-lvl-right").hide();
            } else {
                this.select(".navbtn-lvl-right").show();
            }

            // Apply level configuration
            this.setLevels( this.levels.slice( this.levelOffset, this.levelOffset+7 ) );

        }

        /**
         * Update the 7 level configuration
         */
        HomeScreen.prototype.setLevels = function( config ) {
            for (var i=1; i<=7; i++) {
                var btn = this.select(".levelbtn.level-"+i),
                    titleElm = btn.find(".level-title"),
                    starsElm = btn.find(".level-stars"),
                    cfg = config[i-1];

                if (!cfg) {
                    btn.addClass("inactive");
                    starsElm.attr("class", "level-stars stars-hide");
                    titleElm.text("");
                } else {
                    var stars = cfg['stars'] || 0,
                        title = cfg['index'] || "";

                    btn.removeClass("inactive");
                    starsElm.attr("class", "level-stars stars-" + stars);
                    titleElm.text(title);
                }

            }
        }

        /**
         * Hide levels, call the configuration callback and show them again
         */
        HomeScreen.prototype.slideTransition = function( direction, configCallback ) {

            // Prepare position
            var pos1 = '-150%', pos2 = '150%';
            if (direction) {
                pos1 = '150%'; pos2 = '-150%';
            }

            // Perform transition
            this.select(".levels").css("left","50%").animate({
                'left': pos1
            }, 250, (function() {
                if (configCallback) configCallback();
                this.select(".levels").css("left",pos2).animate({
                    'left': "50%"
                }, 250);
            }).bind(this));

        }

        /**
         * Realign machine layout
         */
        HomeScreen.prototype.realignMachine = function(realignCounters) {
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
        HomeScreen.prototype.realignLevels = function( realignCounters ) {
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
         * Show tuing screen
         */
        HomeScreen.prototype.showTuningScreen = function( level ) {

            // Hide all hideable elements
            this.hostDOM.addClass("hide-hideable");
            // Fade-in tuning screen
            this.select(".screen-tuning").fadeIn();

        }

        /**
         * Hide tuing screen
         */
        HomeScreen.prototype.hideTuningScren = function( level ) {

            // Fade-out tuning screen
            this.select(".screen-tuning").fadeOut();
            // Unhide all hideable elements
            this.hostDOM.removeClass("hide-hideable");

        }

        /**
         * Register screen
         */
        R.registerComponent("screen.home", HomeScreen);

    }
);