define(

	// Dependencies

	["jquery", "vas/core/registry", "vas/core/ui", "vas/core/base/component", "vas/core/db", "vas/core/user" ], 

	/**
	 * This is the default component for displaying flash overlay messages
	 *
 	 * @exports vas-basic/overlay/flash
	 */
	function(config, R, UI, Component, DB, User) {

		/**
		 * The default tunable body class
		 */
		var OverlayQuestionaire = function(hostDOM) {

			// Initialize widget
			Component.call(this, hostDOM);
			hostDOM.addClass("questionaire-overlay");

			// Local properties
			this.questions = [];

			// Core DOM structuring
			this.eHeader = $('<div class="questions-header"></div>').appendTo(hostDOM);
			this.eQuestions = $('<div class="questions-host"></div>').appendTo(hostDOM);
			this.eFooter = $('<div class="questions-footer"></div>').appendTo(hostDOM);

			// Prepare header & Footer
			this.eHeader
				.append($('<h1><span class="glyphicon glyphicon-ok-circle"></span> Take out a pen and paper!</h1><p>Here is a quick questionaire. If you successfuly pass this you can get <strong>8</strong> credits!</p>'));
			this.eFooter
				.append(this.btnSubmit = $('<button class="btn-shaded btn-blue btn-lg">Send</button>'))
				.append(this.btnSkip = $('<button class="btn-shaded btn-teal btn-lg">Skip</button>'));

			// Bind events
			this.btnSkip.click((function() {
				this.trigger('close');
			}).bind(this));
			this.btnSubmit.click((function() {
				var ans = this.evaluate();
				if (ans == null) {
					UI.growl("You have to reply to all of the questions!");
					return;
				}

				// Replace Send
				this.btnSubmit.hide();
				this.btnSkip.show();
				this.btnSkip.text("Close")
			}).bind(this));

		};

		// Subclass from ObservableWidget
		OverlayQuestionaire.prototype = Object.create( Component.prototype );

		/**
		 * Add a question
		 */
		OverlayQuestionaire.prototype.resetQuestions = function() {
			this.eQuestions.empty();
		}

		/**
		 * Add a question
		 */
		OverlayQuestionaire.prototype.addQuestion = function( record ) {
			var idx = this.questions.length+1,
				q = $('<div class="question"></div>').appendTo(this.eQuestions),
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
		 * Evaluate questionaire
		 */
		OverlayQuestionaire.prototype.evaluate = function() {
			var good=0, bad=0, total=this.questions.length,
				checkStatus = [], answers = [];

			// First pass
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
						checkStatus.push( (q.correct == j) );
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

			// Second pass: Apply statuses
			// First pass
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

			// Send results to use
			User.sendBookAnswers(answers);

			// Return ratio
			return good / total;

		}

		/**
		 * Reposition flashDOM on resize
		 */
		OverlayQuestionaire.prototype.onQuestionaireDefined = function( questions, canSkip ) {
			this.resetQuestions();
			for (var i=0; i<questions.length; i++) {
				this.addQuestion( questions[i] );
			}

			// If the user cannot skip, hide the skip button
			if (!canSkip) this.btnSkip.hide();

		}

		// Store overlay component on registry
		R.registerComponent( 'overlay.questionaire', OverlayQuestionaire, 1 );

	}

);