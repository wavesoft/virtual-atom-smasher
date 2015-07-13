
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

## 2.1. User Strategy

As the user understands better the tuning process, his actions become more specific. Instead of random changes of random parameters he should be changing only fewer parameters with a more accurate ranges.

Therefore, we introduce the following two indicators:
```
a = Count( `tuning.values.change` events until a `tuning.values.will_validate` event )
```
and:
```
b = Average( `scale` property of `tuning.values.change` events until a `tuning.values.will_validate` )
```

Therefore if the following value gets smaller, it means that the user knows what (s)he is doing:
```
strategy = a + b
```

## 2.2. Results

One of the most obvious indicators is to check if the actual simulation responses are getting better over time or worse. 

Therefore you can monitor the distribution of `fit` property of `tuning.values.validate` up until a `level.completed` event.

It should initially fluctuate, meaning that the user is testing the ranges of the parameters, but it eventually should become progressively more stable, with a specific trend towards zero.

## 2.3. Learned how to use 'Estimate'

One of the assisting features in the game is the 'Estimate' button. However the user should learn how to use it before he continues.

In principle, clicking on 'Estimate' gives you an estimate of the results. That result **MUST** be better before the user moves forward to validation. 

Therefore if the following number tends to be **bigger** before the `tuning.values.will_validate` event, then the user **DOES NOT KNOW** how to use Estimate.

```
estimate_score = `fit` field of `tuning.values.estimate` event
```

## 2.4. Progression in the game

Another simpler indicator is just to look at how many levels the user has completed so far. You can count the `level.completed` events for this purpose.


# 3. On-topic Extra Learning
 
## 3.1. Responses to Questionnaires

The in-game questionnaires provide additional information to the user regarding scientific and computing terms. Therefore it's very easy to check if the user has obtained extra knowledge by monitoring the value of the following property:

```
learning = `ratio` field of `questionnaire.evaluate` event
```


