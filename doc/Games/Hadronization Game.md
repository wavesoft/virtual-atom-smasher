# Hadronization Game

## Game Purpose

The player perceives the concept of "String Fragmentation". During this process a "String", formed between two coloured quarks, fragments due to an increase of it's energy, producing other particles. 

The game will have a similar approach to "fruit ninja": You slice strings, particles are produced, you gain points.

## Game's visual description

The game takes place a femtosecond after the collision of two particles. A very quick animation of two beams colliding will be shown and half second later a bunch of coloured quarks will appear. These quarks are linked with each other with strings, in a similar manner to the [[Color Game]] This means that red-green-blue quarks are linked with an Y-like string, and red-cyan, green-magenta, blue-yellow quark pairs are linked with a single, straight line.

![](https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Games/Images/Hadronization%20Game/layout-1.jpg)

The time is slowed down (a lot) and the particles are slowly moving away from the collision point. The strings they have formed are stretching along. 

![](https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Games/Images/Hadronization%20Game/layout-2.jpg)

The strings will never break by themselves, rather the user is expected to click on them at will. When breaking a short string (= a few energy), very few or no other smaller quark-antiquark pairs will be produced. When breaking a longer string (= more energy), more and/or heavier particles will be produced. Check the game details for more information here.

![](https://github.com/wavesoft/virtual-atom-smasher/blob/master/doc/Games/Images/Hadronization%20Game/layout-3.jpg)

Each one of the particles produced are still flying away from the collision point, but this time with smaller speed. The moment a particle touches the edge of the screen the level is finished.

The user collects points when:
 * The link is sliced in the "most appropriate" time.
 * A heavy particle is produced

The user looses points when:
 * The link is sliced when the quarks are way too close to each other.

## Game details

The following sections contain details about the game.

### Point system

Link lengths can be classified in four categories, and for each category the user gets or looses points:

 * Very short (< 80 pixels) : User **looses 10 points**
 * Short (< 100 pixels) : User **gets 2 points**
 * Longer (< 300 pixels) : User **gets 2 to 10 points** linearly mapped between 100 and 300 pixels.
 * Long (> 300 pixels) : User **gets 10 points** and in addition **20 points** for every heavy particle produced.

### Fragmentation of Meson (quark-antiquark) links

Let's say that we have the two quarks: `Q` and `Q'` at the two ends of the string. The `Q'` quark has the anti-colour (ex. yellow) and the quark `Q` has the colour (ex. blue).

 * If the link is very short, just a single quark-antiquark pair will be produced, with the following rules:
     - The link between the quarks is broken
     - A new quark `q` will appear close to the antiquark `Q'` with the same colour of `Q`, and it will link with it.
     - A new quark `q'` will appear close to the quark `Q` with the same colour of `Q'`, and will link with it.
     - This will produce a the result: `Q - Q' Q - Q'`
 * If the link is a bit longer, one or more quark-antiquark pairs will be produced, with the following rules: 
     - The link between the quarks is broken
     - The previous rule applies also here, but in addition, arbitrary pairs of quarks-antiquarks `q-q'` of various colours will appear along the string.
     - This will produce the result: `Q - Q' q-q' q-q' Q - Q'`
 * If the link is a lot longer, one of the following "Heavier" particles might appear **in addition** (random chance), in the same way the quark-antiquark pairs were produced in the previous step:
     - A `Proton` (a bigger circle with the letter 'p' in it)
     - A `Neutron` (a bigger circle with the letter 'n' in it)
     - A `Z Boson` (a bigger circle with the letter 'Z^0' in it)
     - A `W Boson` (a bigger circle with the letter 'W' in it)

### Fragmentation of Baryon (quark-quark-quark) links

The user can slice any of the 3 segments of the Y-shaped links between the quarks. The segment is linking the center-of-weight of the three quarks and one colored quark `Q`.

The moment the string is fragmented, the following rules apply:
 * If the link is short, just an antiquark is produced, similarly to the previous case:
    - The link between the center-of-weight and the quark `Q` is broken.
    - A new quark `q` appears in the place of the previously dragged quark and gets linked with the center-of-weight.
    - A new antiquark `q'` appears along the line and links with the original quark `Q`.
    - This will produce the result: `Q-Q-q q'-Q`
 * If the link is longer, the same rules as the previous case appear.

# Game Assets

 * All the particles are plain circle objects with diameter 36 pixel
 * The background has the appropriate quark colour. 
 * The foreground is either white or black, according to the 'perceptive luminance' function (or by just keeping a table of appropriate foreground/background combinations)

```javascript
// Luminance function
var a = 1 - ( 0.299 * color.r + 0.587 * color.g + 0.114 * color.b)/255
if (a < 0.5) {
    fcolor = "#000";
} else {
    fcolor = "#fff";
}
```
 * The border is always 1 pixel, black
 * The links are 2 pixel, white straight lines

## Images & Other Assets

**NOTE:** Currently in DRAFT. You can safely assume that the final images will have the same dimensions.

 * Upon proper re-design of the graphics, each particle will be replaced with a PNG image
 * The lines will still remain 1-pixel white.
 * The collision animation can be found on `doc/Games/Images/Hadronization Game/assets/collision.gif`

