
# In-Game Narrations

## Feedback Button

- Hello there. My name is Ioannis. I am the lead developer of this game. As you may have noticed, this game is not yet finished. There might be some parts which are not very easy to understand or to use. 
- When you feel that's the case, you can click on this button and send your feedback directly to me. You are not only helping us create a better game, but you are actively contributing on it's development!

## Machine

- Welcome to the Virtual Atom Smasher interface.
- Behind me you can see the heart of the particle collision simulation: The Quantum Machine.
- This is a very special one.
- When the particles enter the machine, they have already collided in the real world. But here, you can control all the individual stages of their transformation.
- This machine was built using the latest physics theories, but we want check if they match with reality.
- You will have access to the real experimental data obtained from big accelerators at CERN and other laboratories and you will have to "tune" this machine when it is not performing as expected.
- You are given your first amount of science points that you can spent on unlocking various parts of the machine. Are you ready for the challenge?

## Machine Part

- You have just opened a part of the Quantum Machine. From here you can see more details about this part ... or you can unlock one or more tunable parameters in it.

## Unlocked tunable

- You just unlocked you first tunable parameter! You can now start playing around by changing it's value and looking how it affects the simulation result.

## Open Book

- This is the "Book" interface. Here you can read descriptions about the various terms you will find in the game.
- Always keep in mind that if you want more information about something, you can start a discussion in the forum in the 'Discuss' tab.

## Request estimate

- You just requested an estimation for your tune.
- Behind the scenes, we are looking at already completed simulations with parameter values similar to yours. Using them as a reference, we can quickly "estimate" how your results are going to be.
- However keep in mind that these estimations cannot give you exact results, they are just a rough estimate.

## Request validate

- You just placed a simulation request in order to validate your tune.
- Your request will be handled by hundreds of computers of other players around the globe. They will start the simulation for you and send you back the results.
- You can see all these in in the jobs screen.

## Jobs screen

- In this screen you can see your currently active requests for simulation.
- By clicking on an item in the list ... you can see how many machines are working for the simulation ... how many events they are producing per second, and what's the percentage of the completion.
- You can check your results by moving your mouse over the observable icons and if you see that the results are far from what you expect, you can abort this simulation.

## Introduction Game/Video

[Camera on the PH/TH Corridor, narrator walking]
- Hello there, and welcome to the theory group of the physics department at CERN. 

[Short clips showing people in PH/TH Working]
- This is the heart where the big minds of theoretical physics join forces in order to unlock the mysteries of the universe.
- Brace yourself because you are about become a virtual member in our group! What you will be presented in a while is not just a game. It's the real tool that physicists use here to validate their hypothesis.

[Sudden grab of camera back to the narrator]
- But hey... what am I talking about. Come with me, I want to explain something to you. 

[Narrator stands in front of a whiteboard]
- As you might know, what physicists do is try to explain nature with mathematical models. To be more precise, in our case, they are trying to understand what really happens when two really energetic particles collide with each other.

[Graphic shows a particle collision]
- They start by making some assumptions based on the theory they already know and they form the mathematical equations to describe the behaviours they expect. 
[Theoretical notes being drawn on the whiteboard]
- They then create a computer simulation of virtual particle collisions (or "event generators" as they call them) using these equations. They are using these simulations, because the nature of such collisions is completely chaotic and there is no straightforward answer.

[Various random collisions with different outcomes]
- They will have to run the simulation again and again, thousands of times, using random numbers that they affect randomly the collision process - effectively imitating these chaotic effects. This method of calculation is called "Monte-Carlo". 

[Histograms being populated on both theory and experiment collisions]
- Finally, they are observing the results of the simulation and they compare it with the results from the experiments.

[Showing two collisions completely matching]
- If the simulation results matches perfectly the measurements form the experiments, it means that they successfully managed to simulate what really happens in nature! But usually... that's not the case.
[Showing two collisions not matching at all]

[Showing a model with changeable parameters]
- For this reason, some of the model parameters (for example some constants in the mathematical equations) are intentionally editable. They set an approximate value as a starting point and they try to figure out what's the exact value via try and error.

[Picture of LEP]
- Let's take for example the Large Electron-Positron collider that run just before LHC at CERN. 

[Two particles colliding and others coming out]
- LEP was colliding a beam of electrons with a beam of positions. One of the various things we were measuring on every collision, was the average number of particles being produced.
- So, a computer software will analyse these events and count the average number of particles in every collision.

[Showing scale, showing a vertical line on the sale]
- Let's say for example that *this* is the average number of events produced at LEP.

[Adding another line on the scale]
- We repeat the same process with the computer simulation and we see that the average number of particles is *this* number.

[Arrow pointing on the error bars]
- Take a particular note of these two bars. They are called "Error Bars" and they represent the uncertainty of the measured value. That's either because we didn't have enough data or because our theory is based on something we are not 100% sure - or of course we just want to be on the safe side.
- When the value is within the range of the error bar we can say that we are more than 90% sure that they are the same.

- Coming back to the comparison, we see that these two values do not match. We therefore go back to our theoretical model and we change some of the "editable" parameters.
- We run the simulation, and measure again...
- And we continue like this until we have found the correct result.

- Of course with a single parameter, that might be easy. But what happens when you have more than one?
- Can you give it a try?

[[Mini-Game with a single bar]]

[Showing the narrator]
- That wasn't too hard? Was it?
- Of course there is a little catch...

[Showing the blackboard again]
- We were just looking at the *average* number of particles produced on every collision. But in order to be more precise, we should really count them for every collision individually.
- A nice way of representing these measurements is with a "Histogram".
- On the horizontal axis we put the number of particles that are coming out of each collision. On the vertical axes we count how many times a collision had *that* particular number of particles.
- In order to provide a cleaner result, we are grouping the number of the horizontal axis in ranges of numbers that we call "bins".

- If we start counting the collision particles again, we will see the same average value as before, but in addition we will see how frequently each individual case appear.

- If do the same thing with the simulation, the results might surprise us! The average might still be the same, but the distribution is completely different!
- That's why scientists prefer to look at histograms rather than average values...

- Can you give it a try again, but this time with a histogram?

[[Mini-Game with histogram]]

[Showing the narrator]
- Excellent! You just understood what physicists refer to as the "tuning" of the event generator. This is something they do every time they have a new theory, and this is what you will be doing while playing the Virtual Atom Smasher!

- We are excited to have you at CERN fellow scientist! Welcome aboard!
