# Triggers and Actions

Some important terms in the game are the _triggers_ and the _actions_. A _trigger_ comes from the user interface and is handled by the leaf nodes of the currently active achievements grid in order to be unlocked.

An _action_ is triggered by the achievement node, either upon user click or at the moment the item gets unlocked.

## Triggers

The following triggers are currently implemented

### `event` - An event from user interface

Expected parameters:

    {
        'name': "name"  // The event name
    }

## Actions

The following actions are currently implemented

### `points` - Give user science points

Expected parameters:

    {
        'value': 1234   // The amount of science points to give
    }
