define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/component", "vas/core/db", 
	 "vas/core/user", "ccl-tracker", "text!vas/basic/tpl/overlay/exam.html" ], 

	/**
	 * This is the default component for displaying examination questionnaires
	 *
 	 * @exports vas-basic/overlay/exam
	 */
	function(config, R, UI, Component, DB, User, Analytics, tpl) {

		/**
		 * The default tunable body class
		 */
		var OverlayExam = function(hostDOM) {

			// Initialize widget
			Component.call(this, hostDOM);
			hostDOM.addClass("exam-overlay");

			// Load view template and plutins
			this.loadTemplate(tpl);
			this.renderView();

			// Local properties
			this.questions = [];
			this.validateAnswers = false;

			// Analytics information
			this.qid = 0;

			// Bind events
			this.select(".btn-skip").click((function() {

				// Fire analytics decision
				if (this.select(".btn-skip").text() == "Skip") {
					Analytics.fireEvent("questionnaire.skip", {
						"id": this.qid,
						"time": Analytics.stopTimer("questionnaire")
					});
				}

				// Close
				this.trigger('close');

			}).bind(this));
			this.select(".btn-send").click((function() {

				// Get answers
				var ans = this.getAnswers();
				if (ans == null) {
					UI.growl("You have to reply to all of the questions!");
					return;
				}

				// If we are asked to perform validation, 
				// show the user the responses first

				if (this.validateAnswers) {

					// Evaluate answers
					this.evaluate( ans );

					// Replace Send
					this.select(".btn-submit").hide();
					this.select(".btn-skip")
						.show()
						.text("Close");

				} else {

					// Otherwise just close
					this.trigger('close');

				}

			}).bind(this));

		};

		// Subclass from ObservableWidget
		OverlayExam.prototype = Object.create( Component.prototype );

		/**
		 * Add a question
		 */
		OverlayExam.prototype.resetQuestions = function() {
			this.select(".questions-host").empty();
		}

		/**
		 * Add a question
		 */
		OverlayExam.prototype.addQuestion = function( record ) {
			var idx = this.questions.length+1,
				q = $('<div class="question"></div>').appendTo(this.select(".questions-host")),
				h = $('<h2>'+idx+'. '+record['question']+'</h2>').appendTo(q),
				choices_dom = [], labels_dom = [];

			for (var i=0; i<record['answers'].length; i++) {
					l = $('<label></label>');
					c = $('<input type="radio" name="question-'+idx+'" value="'+record['answers'][i]+'" />').appendTo(l),
					s = $('<span>'+record['answers'][i]+'</span>').appendTo(l);
				q.append(l);
				choices_dom.push(c);
				labels_dom.push(l);
			}

			// Store question record
			this.questions.push({
				'id'	   : record['id'],
				'correct'  : record['correct'],
				'answers'  : record['answers'],
				'elements' : choices_dom,
				'labels'   : labels_dom,
				'header'   : h,
			});
		}

		/**
		 * Collect answers
		 */
		OverlayExam.prototype.getAnswers = function() {
			var answers = [];

			// Collect answers
			for (var i=0; i<this.questions.length; i++) {
				var q = this.questions[i], is_empty=true;

				// Prepare record
				var ans_rec = {
					'choice': 0,
					'id': q.id
				};

				// Check status & check for empty
				for (var j=0; j<q.elements.length; j++) {
					var e = q.elements[j];
					if (e.is(":checked")) {
						ans_rec.choice = j;
						is_empty = false;
						break;
					}
				}

				// If empty, return null
				if (is_empty) {
					return null;
				}

				// Collect record
				answers.push(ans_rec);
			}

			// Return answers
			return answers;
		}

		/**
		 * Evaluate questionaire
		 */
		OverlayExam.prototype.evaluate = function( answers ) {
			var good=0, bad=0, total=this.questions.length,
				checkStatus = [];

			// First pass: Check answer status
			for (var i=0; i<this.questions.length; i++) {
				var q = this.questions[i];
				checkStatus.push( (q.correct == answers[i].choice) );
			}

			// Second pass: Apply statuses
			for (var i=0; i<this.questions.length; i++) {
				var q = this.questions[i], is_correct=checkStatus[i];

				// Mark the correct choice
				for (var j=0; j<q.labels.length; j++) {
					q.labels[j].addClass( (j == q.correct) ? 'correct' : 'incorrect' );
					if (j == q.correct) {
						q.labels[j].prepend($('<span class="glyphicon glyphicon-chevron-right"></span>'));
					}
				}

				// Mark the header
				if (is_correct) {
					q.header.append('&nbsp;<span class="glyphicon glyphicon-ok"></span>');
					q.header.addClass("good");
					good++;
				} else {
					q.header.append('&nbsp;<span class="glyphicon glyphicon-remove"></span>');
					q.header.addClass("bad");
					bad++;
				}
			}

			// Submit evaluation rate
			Analytics.fireEvent("questionnaire.evaluate", {
				"id": this.qid,
				"time": Analytics.stopTimer("questionnaire"),
				"good": good,
				"bad": bad,
				"total": total,
				"ratio": good/ total
			});

			// Send results to use
			this.trigger("answers", answers);

			// Return ratio
			return good / total;

		}

		/**
		 * Reposition flashDOM on resize
		 */
		OverlayExam.prototype.onQuestionaireDefined = function( config ) {
			this.resetQuestions();
			this.qid = config['id'];

			// Get questions
			var questions = config['questions'] || [],
				canSkip = (config['skip'] !== undefined) ? config['skip'] : true;

			// Apply questions
			for (var i=0; i<questions.length; i++) {
				this.addQuestion( questions[i] );
			}

			// If the user cannot skip, hide the skip button
			if (!canSkip) this.select(".btn-skip").hide();

			// Update title & subtitle
			if (config['title'] !== undefined) {
				this.select(".questions-header > h1").html( config['title'] );
			}
			if (config['subtitle'] !== undefined) {
				this.select(".questions-header > p").html( config['subtitle'] );
			}

			// Validate answers
			this.validateAnswers = (config['validate'] !== undefined) ? config['validate'] : false;

		}

		/**
		 * Fire analytics details when shown
		 */
		OverlayExam.prototype.onShown = function() {
			Analytics.restartTimer("questionnaire");
			Analytics.fireEvent("questionnaire.show", {
				"id": this.qid
			});
		};

		// Store overlay component on registry
		R.registerComponent( 'overlay.exam', OverlayExam, 1 );

	}

);