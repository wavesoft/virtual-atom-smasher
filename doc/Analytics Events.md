# Analytics Events

The following list of events is fired through the analytics subsystem of Virtual Atom Smasher.

Each event is forwarded on the window DOM, prefixed with the `analytics.` string. As the first parameter in the event, a JSON object with the details about this event is passed.

Each analytics event has it's own particularities, as seen below:

## blur
The user has moved away from the game interface.
```javascript
{
}
```

## focus
The user has focused again in the game interface.
```javascript
{
}
```

## book.show
A book overlay screen was displayed to the user.
```javascript
{
    "id": "",       // The book ID
}
```

## book.hide
The book overlay screen was dismissed.

```javascript
{
    "id": "",       // The book ID
    "time": 0,      // Time in seconds spent on this tab
}
```

## book.tab_change
A tab was changed in the book screen.

```javascript
{
    "id": "",       // The book ID
    "tab": "",      // The Tab ID
}
```

## book.tab_metrics
Before the tab is dismissed, the following metrics were collected.

```javascript
{
    "id": "",       // The book ID
    "tab": "",      // The Tab ID
    "time": 0,      // Time in seconds spent on this tab
    "coverage": 0   // Coverage (0.0~1.0) of content
}
```

## course.chat_send
This event is triggered when the user types something on the course interface. The actual text is not sent in order to track just activity and not private information. 

```javascript
{
    "id": "",       // The course ID
}
```

## course.percent
A course was interrupted or completed, conveying `percent` % of it's content.

```javascript
{
    "id": "",       // The course ID
    "percent": 0    // The percentage of the course shown to the user
}
```

## course.show
A course screen was shown to the user.

```javascript
{
    "id": "",       // The course ID
}
```

## course.start
The course in the course screen is started.

```javascript
{
    "id": "",       // The course ID
}
```

## interface_tutorial.start
An interface tutorial (Tootr TVHead) has started.

```javascript
{
    "id": "",       // The interface tutorial ID
}
```

## interface_tutorial.percent
An interface tutorial (Tootr TVHead) has completed.

```javascript
{
    "id": "",       // The course ID
    "time": 0,      // The time (in seconds) spent in the tutorial
    "focused": 0,   // The time (in seconds) spent focused on the video
    "percent":      // The percentage of the video seen
}
```

## observables.shown
The overlay where histograms (observables) are rendered is shown to the user.

```javascript
{
    "id": "",       // A checksum of the histogram names
    "histos":[],    // The names of the histograms in the overlay
}
```

## observables.hidden
The histograms overlay was dismissed.

```javascript
{
    "id": "",       // A checksum of the histogram names
    "time": 0,      // The time (in seconds) spent in the observables screen
}
```

## tuning.machine.expand
The specified machine part was expanded. (The user clicked on an expandable machine part where he/she can change the tunes).

```javascript
{
    "id": "",       // The machine part ID
}
```

## tuning.machine.expand_time
The machine part component was dismissed.

```javascript
{
    "id": "",       // The machine part ID
    "time": 0,      // The time (in seconds) that the machine part was open
}
```

## tuning.values.change
The user has changed the value of a particular tunable parameter.

```javascript
{
    "id": "",       // The name of the tunable
    "scale": 0      // The scale of the change (where 1.0=From min to max)
}
```

## tuning.values.estimate
The user requested for an estimation. And a response arrived from the server.

```javascript
{
    "id": "",       // A unique identifier of the current run
    "time": 0,      // The time spent in the interface before clicking estimate
    "values": {},   // The values the user sent for estimation (key/value)
    "fit": 0.0,     // The chi-square fit of the result
}
```

## tuning.values.will_validate
The user requested a validation. This will switch the screen to `jobs` an present the progress of the validation.

```javascript
{
    "id": "",       // A unique identifier of the current run
    "time": 0,      // The time spent in the interface before clicking estimate
    "values": {}    // The values the user sent for estimation (key/value)
}
```

## tuning.values.explain
The user moved the mouse over the name of a tunable and the explaination pop-over appeared.

```javascript
{
    "id": "",       // The name of the tunable
}
```

## tuning.values.explain_time
The dismissed the explaination popover.

```javascript
{
    "id": "",       // The name of the tunable
    "time": 0,      // The time spent having the popover visible
}
```

## tuning.values.learn
User clicked on `Learn more...` in the tunable infoblock screen.

```javascript
{
    "id": "",       // The name of the tunable
}
```

## ui.screen.change
A screen in the game UI has changed. 

```javascript
{
    "id": "",       // The name of the new screen
}
```

## ui.screen.time
Before the screen is changed, this event is fired to send analytics details regarding the time spent on the screen.

```javascript
{
    "id": "",       // The name of the new screen
    "time": 0,      // The time spent on the specified screen
}
```

## intro.correct_answer
The user has submitted a correct answer in the introduction mini-game.

```javascript
{
    "id": "",       // The name of the introduction mini-game
    "time": 0,      // The time spent playing before submitting
}
```

## intro.wrong_answer
The user has submitted a wrong answer in the introduction mini-game.

```javascript
{
    "id": "",       // The name of the introduction mini-game
    "time": 0,      // The time spent playing before submitting
    "reason": "",     // The reason the answer was not accepted (ex. 'bad' or 'average')
}
```

## intro.skip
The user has chosen to skip the mini-game.

```javascript
{
    "id": "",       // The name of the introduction mini-game
    "time": 0,      // The time spent playing before skipping
}
```

## questionnaire.show
A questionnaire has been shown to the user.

```javascript
{
    "id": "",       // The name of the questionnaire
}
```

## questionnaire.skip
The user has chosen to skip a questionnaire.

```javascript
{
    "id": "",       // The name of the questionnaire
    "time": 0,      // How much time the user has spent
}
```

## questionnaire.evaluate
A questionnaire window has been submitted.

```javascript
{
    "id": "",       // The name of the questionnaire
    "time": 0,      // How much time the user has spent
    "good": 0,      // The number of good answers
    "bad": 0,       // The number of bad answers
    "total": 0,     // The total questions in the questionnaire
    "ratio": 0.0    // The ratio of good to total answers
}
```

## ui.bad_clicks
A user performed a set of bad clicks in the interface. As 'bad' are considered the clicks not correspoding to a user interface component.

```javascript
{
    'id': 'interface',          // Always 'interface'
    'number': 0,                // The number of bad clicks
    'time': 0,                  // The time frame of bad clicks 
    "locations" : [[x,y], ..],  // The array of the bad click locations
    "x": 0,                     // The average X location of bad clicks
    "y": 0,                     // The average Y location of bad clicks
}
```

# Pending Analytic Events
This section contains events that are pending implementation.

## tuning.values.validate
The validation results arrived from the server. This event accompanies the previous `tuning.values.will_validate`.

```javascript
{
    "id": "",       // A unique identifier of the current run
    "fit": 0.0      // The chi-square fit of the result
}
```

# Revisions in the Analytics

## As from `July 13, 2015`

 * Till now after the registration screen, the `userid` global field was always `undefined` until the user refreshes the page. That was caused by a the data collected during that time cannot be linked to any account. A solution would be to treat them as anonymous.
 * Till now all the `course.chat_send` events were having `id=undefined`. You should assume that the appropriate id was `course-intro`.
 * Till now two `course.percent` events were fired when a course was finished. If you see both of them arriving at the same (or close) timestamps, with one having `percent=1.0` and the other `percent=0.0`, assume that `percent=1` (100%).
 * Till now the `interface_tutorial.start` were coming in pairs. Now this is fixed.
 * Till now the an `observables.hidden` event was fired right before a `observables.shown` event with `time=0`. This bug is now fixed.
 * Till now the `questionnaire.*` events was stored in analytics as `pop_up:*` events. From now own, we are using the `questionnaire:*` name.

