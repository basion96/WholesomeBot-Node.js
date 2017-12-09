var Discord = require('discord.io');
var config = require('./data/config.json');
var momentTZ = require('moment-timezone');
var asciiArt = require('./data/asciiArt');

var wholesomeMessages = new Array();
var cheerUpMessages = new Array();
var howAreYouReplies = new Array();
var wholesomePics = new Array();
var howDoYouWorkReplies = new Array();
var quotes = new Array();
var lastWholesomeMsg='';

// Initialize Discord Bot.
var bot = new Discord.Client({
   token: config.token,
   autorun: true,
   autoReconnect:true
});

//when the bot is ready, logs to console and fills the arrays.
bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: '+ bot.username + ' - (' + bot.id + ')');
	bot.setPresence({ 
		game: { 
			name: 'with unicorns', 
			type: 0 
		} 
	});﻿
	//fills the arrays.
	fillArrays();
	//runs the daily wholesome message function, could be problematic if the bot stops and starts multiple times during the given hour
	dailyWholesomeMsg();
});

// Automatically reconnect if the bot disconnects from inactivity.
bot.on('disconnect', function(erMsg, code) {
    console.log('Bot disconnected: ', code, 'Reason:', erMsg, 'Time: ' + momentTZ.tz('Australia/Sydney'));
    bot.connect();
});

//when a users joins the channel, bot sends a message to the welcome channel
bot.on('guildMemberAdd', function(member){
	console.log(bot.users[member.id].username + 'has joined the channel');
	bot.sendMessage({
		to: config.welcomeChannel,
		message: 'hey there ' + '<@'+member.id+'>' + ', Welcome to Good Vibes Only :blush:' //could use bot.users[member.id].username to just say user name instead of tagging them
	});
});

//when a message is sent to the discord
bot.on('message', function (user, userID, channelID, message, evt) {
	console.log(user + ": " + message);
	
	//checks to see if the message starts with the specified prefix defined in the config file.
    if (userID!=bot.id && message.substring(0, 1) == config.prefix) {
		var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
			
			//if command is !asciiArt and an option is provided, bot will send that specific art, otherwise sends error message.
			case 'ascii':
			var artname = message.substring(message.indexOf('ascii')+6);
			if(asciiArt.hasOwnProperty(artname)){//if the key actually exists
				bot.sendMessage({
					to: channelID,
					message: asciiArt[artname]
				});
			}
			else{//if key doesnt exit
				bot.sendMessage({
					to: channelID,
					message: 'I don\'t seem to be able to find that ascii art unfortunately :sweat:'
				});
			}
            break;
			
			//if command is !asciiList, bot will send a list of all ascii keys a user can use as an options in the !asciiArt command.
			case 'asciiList':
				var keys = Object.keys(asciiArt);
				bot.sendMessage({
					to: channelID,
					message: 'Here\'s the list of ascii art you can choose from :relaxed:  \n' + keys
				});
			break;
			
			//if command is !wholesome, bot will grab a random wholesome message from the wholesomeReminders array and send it to the same channel as the command.
            case 'wholesome':
            bot.sendMessage({
				to: channelID,
				message: wholesomeMessages[getRandom(wholesomeMessages.length)]
			});
            break;
			
			//if command is !quote, boit will send a random quote from the quote array.
			case 'quote':
				bot.sendMessage({
					to: channelID,
					message: quotes[getRandom(quotes.length)]
				});
			break;
			
			//if command is !byebye, the bot will turn off. Can only be turned on by the person that hosts the bot as the application will need to be restarted.
			case "byebye":
				bot.disconnect();
				process.exit(0);
			break;
			
			//if command is !cheerMeUp, bot will send a message to the same channel as the command to cheer the person up.
			case "cheerMeUp":
			bot.sendMessage({
					to: channelID,
					message: cheerUpMessages[getRandom(cheerUpMessages.length)]
				});
			break;
			
			//if command is !updateLists, the arrays will be refreshed and any new messages in them will be added.
			case "updateLists":
				console.log("Updating arrays...");
				fillArrays();
				console.log("Arrays updated!");
				bot.sendMessage({
					to: channelID,
					message: 'The arrays have been updated :blush:'
				});
			break;
			
			//if command is !wholesomeImg, bot will send a randomly selected wholesome image to the same channel as the command.
			case 'wholesomeImg':
			bot.uploadFile({
				to: channelID,
				file: "data/pictures/"+wholesomePics[getRandom(wholesomePics.length)]
			});
			break;
			
			//if command is !info, bot will send some basic information about itself.
			case 'info':
				bot.sendMessage({
					to: channelID,
					embed: {
						color: 3447003,
						title: "WholesomeBot",
						thumbnail: {
							url: "https://imgur.com/a/50eZl"
						},
						description: 'WholesomeBot is a Happy little bot whos goal is to make your day just that little bit better. For information on WholesomeBot, such as commands, visit [github](https://github.com/basion96/WholesomeBot)',
					}
				});
			break;
			
			//if command is !choose and options are provided, bot will randomly choose one of the provided options and send a message to the channel saying its reponse. 
			case 'choose':
				var choiceOptions = new Array();
				message=message.substring(message.indexOf('choose')+7); //removes the command part of the message.
				
				//while the message is not empty.
				while(message.substring(0,1!="")){
					if(message.indexOf('|')!=-1){ //if theres still '|' identifiers after current option.
						choiceOptions.push(message.substring(0, message.indexOf('|')));//adds option to the array.
					}
					else{ //if current option is the last one.
						choiceOptions.push(message);//adds option to array.
					}
					
					if(message.indexOf("|")!=-1){//if there are still options after the current one, the option that was just added is removed from the message.
						message=message.substring(message.indexOf('|')+1);
					}
					else{ //sets the message to empty.
						message="";
					}
				}
				
				//if message is not empty and has greater than 1 choiceOptions.
				if(choiceOptions.length>1){
					bot.sendMessage({
						to: channelID,
						message: 'I choose: ' + choiceOptions[getRandom(choiceOptions.length)]
					});
				}
				//if array contains only 1 element.
				else if(choiceOptions.length==1){
					bot.sendMessage({
						to: channelID,
						message: 'I dont really get a choice do i haha, well i guess im gonna choose ' + choiceOptions[0] + ' :upside_down: '
					});
				}
				//if the array contains no elements.
				else if(choiceOptions.length==0){
					bot.sendMessage({
						to: channelID,
						message: 'Ahhhhhh, i think you forgot to add my options :sweat_smile: '
					});
				}
			break;
         }
     }
	 
	 //if message is not a distinct command.
	 else{
		 
		 // if message is a variation of 'i love you wholesomebot'.
		 if(message.toLowerCase()=='i love you wholesomebot' || message.toLowerCase()=='i love you <@380542695556251650>' || message.toLowerCase()=='<@380542695556251650> i love you' || message.toLowerCase()=='wholesomebot i love you'){
			 bot.sendMessage({
					to: channelID,
					message: 'i love you too ' + '<@'+userID+'>'
				});
		 }
		 
		 // if message is a variation of 'thank you wholesomebot'.
		 else if(message.toLowerCase().indexOf("thank you wholesomebot")!=-1 || message.toLowerCase().indexOf("thankyou wholesomebot")!=-1 || message.toLowerCase().indexOf("thanks wholesomebot")!=-1 || message.toLowerCase().indexOf("thank you <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("thanks <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("thankyou <@380542695556251650>")!=-1){
			 bot.sendMessage({
					to: channelID,
					message: 'No problem :blush:'
				});
		 }
		 
		 // if message is a variation of 'how are you wholesomebot'.
		 else if(message.toLowerCase().indexOf("how are you wholesomebot")!=-1 || message.toLowerCase().indexOf("how're you wholesomebot")!=-1 || message.toLowerCase().indexOf("how you doing wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you today wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you doing today wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how're you <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how you doing <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how are you today <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how are you doing today <@380542695556251650>")!=-1){
			 bot.sendMessage({
					to: channelID,
					message: howAreYouReplies[getRandom(howAreYouReplies.length)]
				});
		 }
		 
		 // if message contains certain swear words.
		 else if(message.toLowerCase().indexOf("fuck")!=-1 || message.toLowerCase().indexOf("cunt")!=-1){
			 bot.sendMessage({
				 to:channelID,
				 message: "Please watch your language :upside_down:"
			 });
		 }
		 
		 // if message is a variation of 'hey wholesomebot'.
		 else if(message.toLowerCase()=="hey <@380542695556251650>" || message.toLowerCase()=="hi <@380542695556251650>" || message.toLowerCase()=="hello <@380542695556251650>" || message.toLowerCase()=="hey wholesomebot" || message.toLowerCase()=="hi wholesomebot" || message.toLowerCase()=="hello wholesomebot"){
			 bot.sendMessage({
				 to: channelID,
				 message: "Hey " + user
			 });
		 }
		 
		 // if message is a variation of 'ty wholesomebot'.
		 else if(message.toLowerCase()=="ty <@380542695556251650>" || message.toLowerCase()=="ty wholesomebot"){
			 bot.sendMessage({
				 to: channelID,
				 message: 'np bby :kissing_heart:'
			 });
		 }
		 
		 // if message is 'SPOOK' or 'SPOOK!'.
		 else if(message=="SPOOK!" || message=="SPOOK"){
			 bot.sendMessage({
				 to: channelID,
				 message: "AHH! Spooked again... :sweat_smile: "
			 });
		 }
		 
		 // if message is a variation of 'how do you work wholesomebot'.
		 else if(message.toLowerCase().indexOf("how do you work <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how do you work wholesomebot")!=-1){
			bot.sendMessage({
				to:channelID,
				message: howDoYouWorkReplies[getRandom(howDoYouWorkReplies.length)]
			});
		 }
	 }
});

//returns a random number from 0 to the arrays length.
function getRandom(arrayLength){
	return Math.floor(Math.random()*(arrayLength-1));
}

//sends a wholesome message
function dailyWholesomeMsg(){
	var date = momentTZ.tz('Australia/Sydney').format('HH'); //gets current time.
	
	//if the current time matches, a wholesome message is sent.
	if(date==config.wholesomeMsgTime){
		var wholesomeMessage='';
		
		//repeats while the wholesome message is the same as the last one sent (will not be able to check last wholesome message if bot is turned off and back on).
		do{
			wholesomeMessage = wholesomeMessages[getRandom(wholesomeMessages.length)];
		}while(wholesomeMessage==lastWholesomeMsg);
		
		bot.sendMessage({
			to: config.publicChannel,
			message: wholesomeMessage
		});
		lastWholesomeMsg = wholesomeMessage;
	}
}

// runs dailyWholesomeMsg() every hour
setInterval(dailyWholesomeMsg, 3600000);

//fills all the arrays with coresponding data.
function fillArrays(){
	fs = require('fs');
	
	//fills the wholesomeMessages array with data from the wholesomeReminders text file.
	fs.readFile('./data/messages/wholesomeReminders.txt', 'utf8', function(err,data){
		if(err){
			return console.log(err);
		}
		wholesomeMessages = data.toString().split("\n");
	});
	
	//fills the cheerUpMessages array with data from the cheerUpMessages text file.
	fs.readFile('./data/messages/cheerUpMessages.txt', 'utf8', function(err,data){
		if(err){
			return console.log(err);
		}
		cheerUpMessages = data.toString().split("\n");
	});
	
	//fills the howAreYouReplies array with data from the howAreYouReplies text file.
	fs.readFile('./data/messages/howAreYouReplies.txt', 'utf8', function(err,data){
		if(err){
			return console.log(err);
		}
		howAreYouReplies = data.toString().split("\n");
	});
	
	//fills the wholesomePics array with data from the pictures folder.
	fs.readdir("./data/pictures", function(err, data) {
		if(err){
			return console.log(err);
		}
		for (var i=0; i<data.length; i++) {
			if(data[i].substring(0,1)!='@'){
				wholesomePics.push(data[i]);
			}
		}
	});
	
	//fills the howDoYouWorkReplies array with data from the howDoYouWorkReplies text file.
	fs.readFile("./data/messages/howDoYouWorkReplies.txt", 'utf8', function(err, data) {
		if(err){
			return console.log(err);
		}
		howDoYouWorkReplies = data.toString().split("\n");
	});
	
	//fills the quotes array with data from the quotes text file.
	fs.readFile("./data/messages/quotes.txt", 'utf8', function(err, data){
		if(err){
			return console.log(err);
		}
		quotes = data.toString().split("\n");
	});
}
