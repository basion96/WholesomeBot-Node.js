var Discord = require('discord.io');
var logger = require('winston');
var config = require('./config.json');
var wholesomeMessages = new Array();
var cheerUpMessages = new Array();
var howAreYouReplies = new Array();
var wholesomePics = new Array();
const PREFIX = '!';

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: config.token,
   autorun: true,
   autoReconnect:true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: '+ bot.username + ' - (' + bot.id + ')');
	fillArrays();
});

bot.on('message', function (user, userID, channelID, message, evt) {
	console.log(user + ": " + message);
    if (message.substring(0, 1) == PREFIX) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'wholesome':
                sendWholesomeMsg(channelID);
            break;
			case "byebye":
				bot.disconnect();
				process.exit(0);
			break;
			case "cheerMeUp":
				bot.sendMessage({
					to: channelID,
					message: getCheerUpMsg()
				});
			break;
			case "updateLists":
				fillArrays();
			break;
			case 'wholesomeImg':
				sendWholesomePic(channelID);
			break;
         }
     }
	 else{
		 if(message.toLowerCase()=='i love you wholesomebot'){
			 bot.sendMessage({
					to: channelID,
					message: 'i love you too ' + '<@'+userID+'>'
				});
		 }
		 else if(message.toLowerCase().indexOf("thank you wholesomebot")!=-1 || message.toLowerCase().indexOf("thanks wholesomebot")!=-1){
			 bot.sendMessage({
					to: channelID,
					message: 'No problem :blush:'
				});
		 }
		 else if(message.toLowerCase().indexOf("how are you wholesomebot")!=-1 || message.toLowerCase().indexOf("how're you wholesomebot")!=-1 || message.toLowerCase().indexOf("how you doing wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you today wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you doing today wholesomebot")!=-1){
			 bot.sendMessage({
					to: channelID,
					message: getHowAreYouMsg()
				});
		 }
		 else if(message.toLowerCase().indexOf("fuck")!=-1 || message.toLowerCase().indexOf("cunt")!=-1){
			 bot.sendMessage({
				 to:channelID,
				 message: "Please watch your language :upside_down:"
			 });
		 }
		 else if(message.toLowerCase()=="hey <@380542695556251650>" || message.toLowerCase()=="hi <@380542695556251650>" || message.toLowerCase()=="hello <@380542695556251650>"){
			 bot.sendMessage({
				 to: channelID,
				 message: "Hey " + user
			 });
		 }
		 else if(message=="SPOOK!"){
			 bot.sendMessage({
				 to: channelID,
				 message: "AHH! Spooked again... :sweat_smile: "
			 });
		 }
		 else if(message.toLowerCase()=="how do you work <@380542695556251650>?" || message.toLowerCase()=="how do you work <@380542695556251650>"){
			 bot.sendMessage({
				 to: channelID,
				 message: "Well, when you send a message i check if it has anything to do with me. If it does, my insides go \"BEEP BOOP BEEP\" and then i poop out wholesomeness and love :blush:"
			 });
		 }
	 }
});

function sendWholesomeMsg(channel){
	bot.sendMessage({
		to: channel,
		message: wholesomeMessages[getRandom(wholesomeMessages)]
	});
}

function getCheerUpMsg(){
	return cheerUpMessages[getRandom(cheerUpMessages)];
}

function getHowAreYouMsg(){
	return howAreYouReplies[getRandom(howAreYouReplies)];
}

function customMsg(channel, msg){
	bot.sendMessage({
		to: channel,
		message: msg
	});
}

function getRandom(array){
	return Math.floor(Math.random()*array.length);
}

function sendWholesomePic(channelID){
	bot.uploadFile({
		to: channelID,
		file: "pictures/"+wholesomePics[getRandom(wholesomePics)]
	});
}

setInterval(function(){
	var date = new Date();
	console.log(date.getHours());
	if(date.getHours()==2){
		console.log('Sending daily wholesome message...');
		sendWholesomeMsg('370388716113625108');
	}
}, 3600000);

function fillArrays(){
	fs = require('fs');
	fs.readFile('MessageFiles/wholesomeReminders.txt', 'utf8', function(err,data){
		if(err){
			return console.log(err);
		}
		wholesomeMessages = data.toString().split("\n");
	});
	fs.readFile('MessageFiles/cheerUpMessages.txt', 'utf8', function(err,data){
		if(err){
			return console.log(err);
		}
		cheerUpMessages = data.toString().split("\n");
	});
	fs.readFile('MessageFiles/howAreYouReplies.txt', 'utf8', function(err,data){
		if(err){
			return console.log(err);
		}
		howAreYouReplies = data.toString().split("\n");
	});
	fs.readdir("pictures", function(err, data) {
		for (var i=0; i<data.length; i++) {
			if(data.substring(0,1)!='@'){
				wholesomePics.push(data[i]);
			}
		}
	});
}