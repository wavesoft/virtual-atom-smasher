# Analytics Events

The following list of events is fired through the analytics subsystem of Virtual Atom Smasher.

Each event is forwarded on the window DOM, prefixed with the `analytics.` string. As the first parameter in the event, a JSON object with the details about this event is passed.

Each analytics event has it's own particularities, as seen below:

## book.show
A book overlay screen was displayed to the user.
```json
{
    "id": "",       // The book ID
}
```

## book.hide
The book overlay screen was dismissed.

```json
{
    "id": "",       // The book ID
    "time": 0,      // Time in seconds spent on this tab
}
```

## book.tab_change
A tab was changed in the book screen.

```json
{
    "id": "",       // The book ID
    "tab": "",      // The Tab ID
}
```

## book.tab_metrics
Before the tab is dismissed, the following metrics were collected.

```json
{
    "id": "",       // The book ID
    "tab": "",      // The Tab ID
    "time": 0,      // Time in seconds spent on this tab
    "coverage": 0   // Coverage (0.0~1.0) of content
}
```

## course.percent
A course was interrupted or completed, conveying `percent` % of it's content.

```json
{
    "id": "",       // The course ID
    "percent": 0    // The percentage of the course shown to the user
}
```

## course.show
A course screen was shown to the user.

```json
{
    "id": "",       // The course ID
}
```

## course.start
The course in the course screen is started.

```json
{
    "id": "",       // The course ID
}
```

## interface_tutorial.start
An interface tutorial (Tootr TVHead) has started.

```json
{
    "id": "",       // The interface tutorial ID
}
```

## interface_tutorial.completed
An interface tutorial (Tootr TVHead) has completed.

```json
{
    "id": "",       // The course ID
    "time": 0       // The time (in seconds) spent in the tutorial
}
```

## observables.shown
The overlay where histograms (observables) are rendered is shown to the user.

```json
{
    "id": "",       // A checksum of the histogram names
    "histos":[],    // The names of the histograms in the overlay
}
```

## observables.hidden
The histograms overlay was dismissed.

```json
{
    "id": "",       // A checksum of the histogram names
    "time": 0,      // The time (in seconds) spent in the observables screen
}
```

## tuning.machine.expand
The specified machine part was expanded. (The user clicked on an expandable machine part where he/she can change the tunes).

```json
{
    "id": "",       // The machine part ID
}
```

## tuning.machine.expand_time
The machine part component was dismissed.

```json
{
    "id": "",       // The machine part ID
    "time": 0,      // The time (in seconds) that the machine part was open
}
```

## tuning.values.change
The user has changed the value of a particular tunable parameter.

```json
{
    "id": "",       // The name of the tunable
    "scale": 0      // The scale of the change (where 1.0=From min to max)
}
```

## tuning.values.will_estimate
The user requested for an estimation. When the response arrives, the event `tuning.values.estimate` will be fired.

```json
{
    "id": "",       // A unique identifier of the current run
    "time": 0,      // The time spent in the interface before clicking estimate
    "values": {}    // The values the user sent for estimation (key/value)
}
```

## tuning.values.estimate
A response arrived from the server to a will_estimate request.

```json
{
    "id": "",       // A unique identifier of the current run
    "fit": 0,       // The chi-squared fit between reference and simulation
}
```

## tuning.values.will_validate
The user requested a validation. This will switch the screen to `jobs` an present the progress of the validation.

```json
{
    "id": "",       // A unique identifier of the current run
    "time": 0,      // The time spent in the interface before clicking estimate
    "values": {}    // The values the user sent for estimation (key/value)
}
```

## tuning.values.explain
The user moved the mouse over the name of a tunable and the explaination pop-over appeared.

```json
{
    "id": "",       // The name of the tunable
}
```

## tuning.values.explain_time
The dismissed the explaination popover.

```json
{
    "id": "",       // The name of the tunable
    "time": 0,      // The time spent having the popover visible
}
```

## tuning.values.learn
User clicked on `Learn more...` in the tunable infoblock screen.

```json
{
    "id": "",       // The name of the tunable
}
```

## ui.screen.change
A screen in the game UI has changed. 

```json
{
    "id": "",       // The name of the new screen
}
```

## ui.screen.time
Before the screen is changed, this event is fired to send analytics details regarding the time spent on the screen.

```json
{
    "id": "",       // The name of the new screen
    "time": 0,      // The time spent on the specified screen
}
```
