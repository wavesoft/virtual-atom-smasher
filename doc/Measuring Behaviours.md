# Measuring Behaviours in VAS

There are various locations where Virtual Atom Smasher interface tracks the user’s behavior, separated in two major groups: Passive and Active metrics. 

The *Passive* metrics refer to whatever information can be obtained by the user's behaviours without directly asking them. This can be summarised to:

  1. **Google Analytics** – Tracking low-level user behaviors, such as bad clicks, interface or game actions. This is particularly useful for checking the usability of the interface. The full list of tracked user actions can be found on the document [[Analytics Events.md]].
  2. **Forum Activity** - The Virtual Atom Smasher game has a forum, which is used for feedback with scientists and inter-communication between teams. It is very simple to extract activity information on the forum, such as: *number of posts, category of posts (ex. technical questions, casual discussions etc.)*
  3. **Feedback to the developers [Creativity]** - I was thinking that it's really useful to measure user's creativity by letting them contribute to the development of the interface. There is a `Feedback` button in every page of the game, through which users can send feedback to the developers. This is actually a sub-category of the previous, since the feedback thread is created in the game forum.

The *Active* metrics are whatever information can be extracted from the users by directly asking them (ex. surveys). The information collected like this are the following:

  1. **Registration Survey [Background & Motivation]** – This survey is part of the registration screen. You can see questions on the [[Registration survey.md]] document. This is used for creating the "analytics profile" of the user.
  2. **Pre-evolution survey [Learning Outcomes]** – A moderate-sized survey shown right after the registration sequence is used in order to understand the current state of the user's understanding. The questions can be found on the document [[pre-post-questions.md]].
  3. **Post-evaluation survey [Learning Outcomes]** - The previous survey is shown once again to the user after some fixed amount of play time (ex. a week) and it's used to evaluate if the user has understood some of the game concepts.
  4. **Feedback survey [Motivation & Engagement]** - This survey includes additional information regarding the usability of the gameplay and the interface. The questions can be found on the [[Feedback survey.md]] document.
  5. **In-game learning 'exams' [On-topic Learning]** - Since the scientific information in the game are relayed to the user in form of cross-linked wiki-pages, it's easy to trace what information the user has read. *In addition* the user has the option to manually trigger an 'exam' for additional credit. In this exam, (s)he will be presented with questions evaluating the understanding of the terms (s)he has seen so far. Upon successfully answering all the questions regarding a term (s)he "masters" it. Therefore it's quite straightforward to measure *what* terms are understood and *when* did that happen.

# When are the surveys presented to the user

Registration:
  - Registration Survey
  - Pre-evaluation Survey

After a week of play time:
  - Post-evaluation Survey
  - Feedback Survey

At any time while playing:
  - In-game learning 'exam'
