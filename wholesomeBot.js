var Discord = require('discord.io');
var config = require('./config.json');
var moment = require('moment');
var momentTZ = require('moment-timezone');

var wholesomeMessages = new Array();
var cheerUpMessages = new Array();
var howAreYouReplies = new Array();
var wholesomePics = new Array();
var howDoYouWorkReplies = new Array();
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
});

// Automatically reconnect if the bot disconnects from inactivity.
bot.on('disconnect', function(erMsg, code) {
    console.log('Bot disconnected: ', code, 'Reason:', erMsg);
    bot.connect();
});

//when a message is sent to the discord
bot.on('message', function (user, userID, channelID, message, evt) {
	console.log(user + ": " + message);
	//checks to see if the message starts with the specified prefix defined in the config file.
    if (message.substring(0, 1) == config.prefix) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
			//if command is !wholesome, bot will grab a random wholesome message from the wholesomeReminders array and send it to the same channel as the command.
            case 'wholesome':
            bot.sendMessage({
				to: channelID,
				message: wholesomeMessages[getRandom(wholesomeMessages.length)]
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
				file: "pictures/"+wholesomePics[getRandom(wholesomePics.length)]
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
			//if command is !choose and ChoiceOptionss are provided, bot will randomly choose one of the provided ChoiceOptionss and send a message to the channel saying its reponse. 
			case 'choose':
				var ChoiceOptions = new Array();
				message=message.substring(message.indexOf('choose')+6);
				
				//if message is not empty and has greater than 1 ChoiceOptions
				if(message!="" && ChoiceOptions.length>1){
					while(message.substring(0,1!="")){
						if(message.indexOf('|')!=-1){
							ChoiceOptions.push(message.substring(0, message.indexOf('|')));
						}
						else{
							ChoiceOptions.push(message);
						}
						
						if(message.indexOf("|")!=-1){
							message=message.substring(message.indexOf('|')+1);
						}
						else{
							message="";
						}
					}
					bot.sendMessage({
						to: channelID,
						message: 'I choose: ' + ChoiceOptions[getRandom(ChoiceOptions.length)]
					});
				}
				else if(ChoiceOptions.length==1){
					bot.sendMessage({
						to: channelID,
						message: 'I dont really get a choice do i haha, well i guess im gonna choose ' + ChoiceOptions[0] + ' :upside_down: '
					});
				}
				else if(message==""){
					bot.sendMessage({
						to: channelID,
						message: 'Ahhhhhh, i think you forgot to add my ChoiceOptionss :sweat_smile: '
					});
				}
			break;
         }
     }
	 else{
		 if(message.toLowerCase()=='i love you wholesomebot' || message.toLowerCase()=='i love you <@380542695556251650>' || message.toLowerCase()=='<@380542695556251650> i love you' || message.toLowerCase()=='wholesomebot i love you'){
			 bot.sendMessage({
					to: channelID,
					message: 'i love you too ' + '<@'+userID+'>'
				});
		 }
		 else if(message.toLowerCase().indexOf("thank you wholesomebot")!=-1 || message.toLowerCase().indexOf("thankyou wholesomebot")!=-1 || message.toLowerCase().indexOf("thanks wholesomebot")!=-1 || message.toLowerCase().indexOf("thank you <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("thanks <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("thankyou <@380542695556251650>")!=-1){
			 bot.sendMessage({
					to: channelID,
					message: 'No problem :blush:'
				});
		 }
		 else if(message.toLowerCase().indexOf("how are you wholesomebot")!=-1 || message.toLowerCase().indexOf("how're you wholesomebot")!=-1 || message.toLowerCase().indexOf("how you doing wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you today wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you doing today wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how're you <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how you doing <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how are you today <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how are you doing today <@380542695556251650>")!=-1){
			 bot.sendMessage({
					to: channelID,
					message: howAreYouReplies[getRandom(howAreYouReplies.length)]
				});
		 }
		 else if(message.toLowerCase().indexOf("fuck")!=-1 || message.toLowerCase().indexOf("cunt")!=-1){
			 bot.sendMessage({
				 to:channelID,
				 message: "Please watch your language :upside_down:"
			 });
		 }
		 else if(message.toLowerCase()=="hey <@380542695556251650>" || message.toLowerCase()=="hi <@380542695556251650>" || message.toLowerCase()=="hello <@380542695556251650>" || message.toLowerCase()=="hey wholesomebot" || message.toLowerCase()=="hi wholesomebot" || message.toLowerCase()=="hello wholesomebot"){
			 bot.sendMessage({
				 to: channelID,
				 message: "Hey " + user
			 });
		 }
		 else if(message.toLowerCase()=="ty <@380542695556251650>" || message.toLowerCase()=="ty wholesomebot"){
			 bot.sendMessage({
				 to: channelID,
				 message: 'np bby :kissing_heart:'
			 });
		 }
		 else if(message=="SPOOK!" || message=="SPOOK"){
			 bot.sendMessage({
				 to: channelID,
				 message: "AHH! Spooked again... :sweat_smile: "
			 });
		 }
		 else if(message.toLowerCase().indexOf("how do you work <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how do you work wholesomebot")!=-1){
			bot.sendMessage({
				to:channelID,
				message: howDoYouWorkReplies[getRandom(howDoYouWorkReplies.length)]
			});
		 }
	 }
});

function chooseChoiceOptions(message, channel){
	var ChoiceOptions = new Array();
	message=message.substring(message.indexOf('choose')+6);
	while(message.substring(0,1!="")){
		if(message.indexOf('|')!=-1){
			ChoiceOptions.push(message.substring(0, message.indexOf('|')));
		}
		else{
			ChoiceOptions.push(message);
		}
		
		if(message.indexOf("|")!=-1){
			message=message.substring(message.indexOf('|')+1);
		}
		else{
			message="";
		}
	}
	for(var i=0; i<ChoiceOptions.length; i++){
		console.log(ChoiceOptions[i]);
	}
	bot.sendMessage({
		to: channelID,
		message: ChoiceOptions[getRandom(ChoiceOptions.length)]
	});
}

function customMsg(channelID, msg){
	bot.sendMessage({
		to: channelID,
		message: msg
	});
}

function getRandom(arrayLength){
	return Math.floor(Math.random()*arrayLength);
}

setInterval(function(){
	var date = momentTZ.tz('Australia/Sydney').format('HH:mm');
	if(date=='12:00'){
		var wholesomeMessage='';
		do{
			wholesomeMessage = wholesomeMessages[getRandom(wholesomeMessages.length)];
		}while(wholesomeMessage==lastWholesomeMsg);
		
		bot.sendMessage({
			to: config.publicChannel,
			message: wholesomeMessage
		});
		lastWholesomeMsg = wholesomeMessage;
	}
}, 3600000);

function fillArrays(){
	fs = require('fs');
	fs.readFile('./MessageFiles/wholesomeReminders.txt', 'utf8', function(err,data){
		if(err){
			return console.log(err);
		}
		wholesomeMessages = data.toString().split("\n");
	});
	
	fs.readFile('./MessageFiles/cheerUpMessages.txt', 'utf8', function(err,data){
		if(err){
			return console.log(err);
		}
		cheerUpMessages = data.toString().split("\n");
	});
	
	fs.readFile('./MessageFiles/howAreYouReplies.txt', 'utf8', function(err,data){
		if(err){
			return console.log(err);
		}
		howAreYouReplies = data.toString().split("\n");
	});
	
	fs.readdir("./pictures", function(err, data) {
		if(err){
			return console.log(err);
		}
		for (var i=0; i<data.length; i++) {
			if(data[i].substring(0,1)!='@'){
				wholesomePics.push(data[i]);
			}
		}
	});
	
	fs.readFile("./MessageFiles/howDoYouWorkReplies.txt", function(err, data) {
		if(err){
			return console.log(err);
		}
		howDoYouWorkReplies = data.toString().split("\n");
	});
}
