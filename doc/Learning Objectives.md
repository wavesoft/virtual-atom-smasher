
## On-topic learning

These are the indications that let you know if the user has learned the interface or not:

### Bad Clicks

When the distribution of the following ratio gets smaller, the user has understood the position of the UI elements.

```
            Number of back click events
Ratio = -----=====-------------------------
         Total number of events in session
```

Where:

 * Bac click events = `ui.bad_clicks`

### Confidence

When the user is more confident, (s)he should spend fewer time in the interface. Therefore, when the following ratio gets smaller, the user is more confident:

```
         Number of interface change events
Ratio = -------------------------------------
         Total number of events in session
```

Where:

 * Interface change events = `book.show`, `book.hide`, `book.tab_change`, `course.start`, `course.percent`, `observables.shown`, `observables.hidden`, `tuning.machine.expand`, `tuning.machine.expand_time`, `tuning.values.change`, `tuning.values.estimate`, `tuning.values.will_validate`, `ui.screen.change`

### Expected Actions

The user is expected to follow a particular pattern of actions
