
# 1. Learing the User Interface

These are the indications that let you know if the user has learned the interface or not:

## 1.1. Bad Clicks

When the distribution of the following ratio gets smaller, the user has understood the position of the UI elements.

```
            Number of back click events
Ratio = -----=====-------------------------
         Total number of events in session
```

Where:

 * Bac click events = `ui.bad_clicks`

## 1.2. Confidence

When the user is more confident, (s)he should spend fewer time in the interface. Therefore, when the following ratio gets smaller, the user is more confident:

```
         Number of interface change events
Ratio = -------------------------------------
         Total number of events in session
```

Where:

 * Interface change events = `book.show`, `book.hide`, `book.tab_change`, `course.start`, `course.percent`, `observables.shown`, `observables.hidden`, `tuning.machine.expand`, `tuning.machine.expand_time`, `tuning.values.change`, `tuning.values.estimate`, `tuning.values.will_validate`, `ui.screen.change`

## 1.3. Expected Actions

The user is expected to follow a particular pattern of actions. Therefore you can measure the deviation from that path.

There are two ways of analysing the data: To use a Finite-State-Machine or to check the number of correct path of actions. The latter is simpler to implement in the current context, but the first can give more accurate results.

Therefore, one indicator would be to expect the following sequence to be seen more frequently as the time progresses:

 1. The user opens a machine part: `tuning.machine.expand`
 2. The user changes a tunable: `tuning.values.change`
 3. Optionally user asks for estimation: `tuning.values.estimate`
 4. Optionally the steps 2-3 are repeated
 5. The user clicks on validate: `tuning.values.will_validate`

# 2. On-topic Learning

## 2.1 

