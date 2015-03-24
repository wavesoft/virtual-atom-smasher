# Final State Radiation Game

## Game Purpose

The player perceives a general function of Final State Radiation by playing a virtual bridge building game. 

## Game's visual description

On both sides of the screen (left and right) are going to be vertically scattered hadrons. Near the top of the screen there will be a fragmented bridge with wholes. On the one end of the bridge a character will be waiting to cross it and go to the other end of the bridge, where there is a door that the character will enter.  

## Game Objective

The objective of the game is to produce as many Final State Showers as to patch the bridge on time, before the character passes. After a fixed amount of time, the character will start to walk on its own. Unless the player has patched all the wholes of the bridge the character will fall and the player will lose. If the player manages to build the bridge successfully, before the time passes, the character will automatically start to cross the bridge. 

The Final State Shower is the result of the collision of two particles: The user clicks on two of the particles (one on each side of the screen) and they start flying towards each other, always colliding in the middle of the screen. After the collision, a tree-like structure (a Feynman diagram) will appear on both sides of the collision point, perpendicular to the line the two selected particles form. The lower part is ignored, but the upper part should target a hole in the bridge.

Upon touching a whole in the bridge, it gets slowly patched. After three touches from shower particles, the bridge is fully patched and the user starts walking.

## Game Details

 1. Depending on what two particles the player will choose (click on), the angle and the direction of the shower will vary. That is what will guide the Final State Shower particles to patch all the fragments of the bridge.
 2. The Final State Shower products will depend on the "energy" the player will give to the collision. The bigger the energy, the more products come out from the Final State Shower and be and a quicker the bridge will be patched. The energy depends on the distance between the two particles selected.
 3. The visualisation of the collision and the parton shower in this game is very simplified so that the player can concentrate only on the final state shower. 
 4. In the game there will be a countdown timer that will trigger the character to start walking when it comes to zero. As the game gets more difficult, the available time will be reduced.
 5. The player will have to chose correctly which particles will collide. This is the puzzle part of the game. The correct particles after the collision will emit to the correct angle the final state shower products. The player will have to combine the correct particles in order to do that. 
 6. The number of the particles available for collision will be 6 on the first level and grow more as the levels pass.

## Game assets

All the game assets will be available in the `doc/Games/Images/Final State Shower Game/assets` folder.
