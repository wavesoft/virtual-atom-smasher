
# Colour Charge Game

## Game Purpose

This is a puzzle game, where the player will learn what colour charge combinations lead to a formation of a stable hadron. 

## Game Visual Description

The player can see circles of different colours scattered in the screen. They represent the colour charged quarks. Blue, Anti-Blue, Green, Anti-Green, Red, Anti-Red. 

## Game Objective

The player has to find the best possible way to connect the quarks so that baryons and mesons are formed. In the end of the game the player will have to connect all the quarks into hadrons ( baryons or mesons). This formation is based entirely on colour charge. The player will be able to connect the correct quarks by clicking on them with the mouse. When that happens, connecting lines will appear to indicate that the quarks have now formed a hadron. These connecting lines must not cross one another. So the player has to find the correct way to connect all the quarks without crossing their connecting lines. 
The game can be divided into small levels from easier mode to more difficult. As the game evolves each round will have quarks placed in the screen in ways that it will be more and more difficult for the player to connect correctly all the quarks. 

## Game Details

Baryons are formed of three quarks. Their colour charged can be  (in any sequence) either Red + Blue + Green, or Anti-Red + Anti-Blue + Anti-Green (which in this case they form an anti-baryon).

Mesons are formed of a quark and an antiquark. That means that there is a colour charged quark and its anti-colour. So the pairs here can be blue + anti-blue, green + anti-green, red + anti-red.

Both of them are summing-up to form the colour White.

## Quark coloring

Red colour charge is #FF0000
Blue colour charge is #0000FF
Green colour charge is #00FF00

Anti-red colour charge is #00FFFF
Anti-blue colour charge is #FFFF00
Anti-green colour charge is #FF00FF

## Implementation Guidelines

 - When the level starts, the user sees a scattered set of quarks, with various colours.

![](https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Games/Images/Color%20Game/layout-1.png)

 - The user clicks (or clicks and drags) through individual quarks in order to select them. Each "Selected" quak gets highlighted. If any of the following conditions is met, the process is abruptly terminated and the appropriate course of action is taken:
     + _(TWO quarks in the selection) AND (the one is the anti-colour of the other (ex. Red + Anti-Red)):_ The two quarks are linked with each other with a continuous line, forming a **meson**.
     + _(TWO quarks in the selection) AND (they are NOT (either both colour OR both anti-colours)):_ The user input is cancelled because this will not match neither a meson nor a baryon.
     + _(THREE quarks in the selection) AND (they contain [R,G,B] OR [~R,~G,~B])_: The three quarks are linked with each other using a Y-Shape connection. The mid-point of the Y is the centre of the coordinates of the three edges: [(x1+x2+x3)/3, (y1+y2+y3)/3]

![](https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Games/Images/Color%20Game/layout-2.png)

 - When a line of the link to be formed intersects with the line of an already existing link, the selection is aborted.   

![](https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Games/Images/Color%20Game/layout-3.png)

 - The level finishes when the user has linked all coloured quarks with each-other.

