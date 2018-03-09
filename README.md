# WholesomeBot
WholesomeBot is a discord bot designed to spread happiness and wholesomeness.

Also please note that i am fairly new to the whole github thing, and this is my first time using javascript. There's bound to be bugs and stuff not working as it should be or in the most optimal way, but im getting there!

## Commands
The list of commands for WholesomeBot is slowly expanding, here are the current ones:
- **!help** - Displays all available commands
- **!ascii** [some option] - Sends ascii art, art sent it dependent on the option the user puts in, eg. bear
- **!asciiList** - Displays all the options a user can use for the !ascii command.
- **!wholesome** - Sends a random wholsome message from the wholesomeReminders file.
- **!quote** - Sends a random quote from the quote text file.
- **!byebye** - Turns the bot off.
- **!cheerMeUp** - Sends a random message from cheerUpMessages file to cheer someone up.
- **!updateLists** - Updates the arrays that store the messages/pictures, used for if you added a message/picture and you want it available to use asap.
- **!wholesomeImg** - Sends a random wholesome image from the pictures folder.
- **!info** - Displays information about the bot and links to this page.
- **!choose** [some | options] - Will choose a random option given. Options must be seperated by | eg. !choose this one | or this one
- **!compliment** - Sends a compliment to the user.

## Other commands
WholesomeBot will also respond to some messages that are sent to a channel. These messages are (and include some variants):
- i love you wholesomebot
- i love you too wholesomebot
- thank you wholesomebot 
- how are you wholesomebot 
- (some swear words)
- hi wholesomebot 
- ty wholesomebot
- SPOOK!
- how do you work wholesomebot
- what are you doing wholesomebot
- do you have a crush wholesomebot
- do you believe in love wholesomebot
- who do you like wholesomebot
- who do you love wholesomebot
- are you an ai wholesomebot
- you look good today wholesomebot
- you're cute wholesomebot
- you're beautiful wholesomebot
- you're adorable wholesomebot
- you're to kind wholesomebot

As you can tell, having wholesomebot at the end is kinda needed, can also tag wholesomebot instead

## Pictures
You will need to supply your own pictures for wholesomebot. Thankfully this is as easy as grabbing some wholesome pictures you like, and dropping them in the pictures folder.
Added more pictures while the bot was running and dont want to restart the bot to use them? Just type !updateLists and the lists will then include them.

## Wholesome messages
Unlike the pictures, wholesome messages are provided. There are quite a few and more are added every so often. Feel free to give suggestions to be added.

## Future plans
- Joining voice channels and playing music


## Setting up the bot
First of all make sure you have made a bot account, and that ou have added it to your server.

To do this, go to https://discordapp.com/developers/applications/me to create a new app. click on "New App" and fill ou the details. Make sure that you click "Create a Bot User" and then "Yes do it" to make the bot and get the bots unique token.
Once you have done that, continue on with installing the bot on your device.

### Linux
To install the bot on linux, simply type `git clone https://github.com/basion96/WholesomeBot.git`
To update the bot, type `git pull` in the same directory as the bot.
In the bot.sh file, change 'path/to/Wholesomebot' to the directory you installed wholesomebot in, eg. /home/pi/Wholesomebot for a raspberry pi

### Windows

## Configuring the bot
Configuring Wholesome bot is very simple. go to the config.json file in the data folder to set the info.
Here's a run down on what each part does:
- **token** - Your bots token.
- **publicChannel** - The channel ID of your public channel, this is used to send the dailt wholesome messages.
- **welcomeChannel** - The channel ID fo your welcome page, depending on how your discord server is set up, this may be the same as your public channel.
- **prefix** - this is the command prefix the bot will use to determine if the message is a command, this can be anything you like.

To get the channel ID of the text channel, first make sure your in developer mode (User Settings -> Appearance -> Developer Mode), then right click the channel you want and click 'Copy ID'.
