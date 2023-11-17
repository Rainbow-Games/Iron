# Iron is a package for building games.
Systems are prioritized for factory games however I tried my best to make them expandable and/or useable for other things.

# Currently Reworking!

## Current systems online are:
### StateManager *Partial
Container for states with bindable value changes using the Value class
### WorldObjectManager *CURRENT * Partial
Manages world objects and there states.
Working on their TechTree implementation as of now.
### EventManager
Manages bindable events that can be fired and binded to.  Used in state values and InputActions.
### InputManager
Allows for binding of InputActions that connect to gui button presses or keys pressed.
### ServerManager
Allows for creation of unique snowflakes as ids thoughout all servers that will be used to prevent dupes of items and objects.
Has a shutdown function for use on updates or admin commands that teleports players to reserved places durring updates.
### Console and Debug Packets
the console works as print(log) warn error but debug packets add class that acts as its own console and prints out all output when print is called
### EnumTree
Stores any enums used for easy developer use. Gets exported as Iron.Enum
