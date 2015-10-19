# LarpManager
LarpManager is a Meteor.js application that coordinates LARPs so GMs and players and focus on RPing (and not logistics).

* This updated version should still be considered a late alpha release.  It works, but the messaging system is in the process of being overhauled.

## What Does LarpManager do for the GM(s) and Players?
1. GM(s) have a real-time view of where all the characters are located
2. GM(s) can see all current character sheets at any time
3. GM(s) can message everyone in a location; locations can be anything the GM(s) wants, can change at any time, and all changes are synced to all players
4. players always have a log of all the major plot information their character should know based on where they've been
5. players can leave the game to go do other things (at a convention, for example) without missing out on the things their character would know; no more "what did I miss?"
6. players know which real world locations represent locations in the game, so they know where to find each other
7. LarpManager works around spotty wireless internet access by storing all information locally, and syncing/updating when the device is connected; offline storage is utilized so the application continues to work when the users move through "dead spots" in which there is no internet access available to them
8. what does all this end up doing?
  * players know what their character should know
  * players know where to go to interact with the other players
  * GM(s) can see where everyone is and control the pace of the game in real-time
  * GM(s) have control over the release of information throughout the gameplay area, not just where they are currently located

## Can Players Play Without Using the Application?
Yes. Their gameplay experience will be that of a player in a traditional LARP. They won't necessarily know where to go or what's going on (as occurs in a traditional LARP), but they can use a paper character sheet and go for it.

## Installation Instructions
### Run Your Server on Meteor.com or Another Host
Creating your own LarpManager server is fairly straightforward. As of this time (02/01/2014), Meteor.js applications can be deployed for free at Meteor.com, so GMs can have their own publicly accessible application up\-and\-running fairly quickly.

1. [Install Meteor](http://docs.meteor.com/#quickstart) and create an empty app.
2. Delete the default files in the app.
3. Add the required Meteor packages with `Meteor add twbs:bootstrap accounts-base accounts-ui accounts-ui-unstyled accounts-password`
4. Copy all the files and folders from this github repro into your local Meteor app.
5. Deploy it to your own server or the Meteor.com server.
6. Create an account with username "larp\_admin" with a strong password.
  * all GM privelages are only available to users logged in with that username
  * more than one GM can be logged in as "larp\_admin" simultaneously
### Run Your Own Server
It is also very easy to just run your own instance of LarpManager on any Mac or Linux computer. Steps 1 through 4 in the above instructions will accomplish this. If your players and any other GM(s) can reach your computer by its IP (and that IP stays constant throughout the event) and no firewalls prevent traffic on port 3000, there is nothing wrong with just running the server yourself. If the LARP takes place at a convention, it is not recommended to run the server on a hotel or convention center network. Simply run the server at home, make sure it is accessible from outside your home network, make sure the players know the URL to type into their web browsers on their devices, and you're set. LarpManager does not need much bandwidth as it only transmits small amounts of data.
### Future Updates
All future updates will always be compatible with previous versions so anyone running their own instance of LarpManager can simply replace their application files with the new ones and everything will continue to work. Unless otherwise noted, all existing LARPs, user accounts, and characters will be preserved.

## LARP Setup
You need two things right away: a character sheet template for the game system you're using, and a LARP
that uses it.

### Character Sheet Template Creation Guidelines
1. begin each section of the character sheet with a "legend\_start" field type and an appropriate title
  * each section can contain any combinations of "single\_line" and "multi\_line" form fields
  * you can often simplify a character sheet by combining a lot of individual fields with one "multi\_line" field
2. end each section of the character sheet with a "legend\_end" field type
3. if the sheet is too long, it will be a pain to use on cell phones
4. the character sheet template cannot be edited after it has been created
  * the character data is dependent on the structure of the character sheet template (changing it would screw up existing characters)
  * this shouldn't be something you'd want to do in a LARP anyway for a lot of gameplay reasons

### LARP Creation Guidelines
1. the LARP description should contain:
  * all the information a prospective player needs to determine if they want to play
  * any cost associated with the game
  * the rules of character creation
  * links to anything online that might help with any of the above
2. by default, there is no minimum amount of time that a character must spend in a location before being allowed to move to another location; the GM should set that time (in minutes) to control the speed with which players are allowed to move around the game
  * for example, if the locations are each parts of the U.S.S. Enterprise it shouldn't take too long to move between them
  * if the locations are all parts of a large city and the surrounding points of interest, it might be reasonable to make the minimum time required in a location to be higher than in the previous example
  * having a minimum time setting is a good way to get players interacting with each other and not just clicking on all the locations to know where all the players are located
  * like everything else in LarpManager, changes are immediately implemented everywhere; the GM can change the minimum time players must spend in locations at any time during the game

## Running the LARP

### Players
1. point their browser on any modern device to the URL of your LarpManager powered application
2. register (the email addresses are not verified)
3. on registration they are automatically logged in
4. apply to join one of your LARPs
5. when they apply to join, they will see the description you created for the LARP so they will know:
  * how much (if anything) it costs to play
  * the character creation rules; they can start making their character right away
6. when they have been approved to join the LARP, they can permanently link their character to the LARP
7. start playing!

### GMs
1. flesh out the locations of the game world and for each one
  * include the real world location that represents the game location so players know where to go if they want to interact with other players in that location
  * include a description of what you want any player intering that location to know
  * both of these things can be changed at any time and all changes will be synced to all players
2. player management
  * the GM will always see two running lists of players; those who have been accepted into the game and those who are already accepted
  * players can be accepted or removed from the game as needed
3. messages
  * messages can be sent to all the player characters currently in any given location
  * this allows the GM to make sure information goes to the right players based on where their characters are
  * the players see a running log of all messages their character has ever received
  * the GM(s) can see all messages sent by all GM(s)
4. multiple GMs can be logged in using the username "larp\_admin"
  * all GMs have access to all of the same information
  * all GMs will see changes made by each other update the application in real time

## Before the Game
1. Because character generation can be done before the player has been accepted to play in the game, a GM can publish the rules of character creation in a convention program booklet and/or website before the game takes place. Players can generate their characters before the game starts.
2. Pre-generated characters or characters that need to have specific attributes because they play an important role in the story can be made before the game, but they cannot be moved from one player account to another. If it is unknown which player(s) will be playing which pre-generated characters, the GM should make player a player account for each pre-generated character and assign those accounts to players when they register for the game.

## After the Game
There is no fixed time frame for a game when using LarpManager so the application be used for many combinations of ongoing and short-term games using the same database of characters and game information.  If there is a fee involved for a short-term game or a periodic fee is charged to play for a certain period of time in a long-term game, then the GM will need to keep track of which players' usernames need to be removed from the game on certain dates.