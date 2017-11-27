var Discord = require('discord.io');
var logger = require('winston');
var config = require('./config.json');

var wholesomeMessages = new Array();
var cheerUpMessages = new Array();
var howAreYouReplies = new Array();
var wholesomePics = new Array();
var howDoYouWorkReplies = new Array();

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

// Automatically reconnect if the bot disconnects due to inactivity
bot.on('disconnect', function(erMsg, code) {
    console.log('Bot disconnected: ', code, 'Reason:', erMsg);
    bot.connect();
});

bot.on('message', function (user, userID, channelID, message, evt) {
	console.log(user + ": " + message);
    if (message.substring(0, 1) == config.prefix) {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
            case 'wholesome':
            bot.sendMessage({
				to: channelID,
				message: wholesomeMessages[getRandom(wholesomeMessages.length)]
			});
            break;
			case "byebye":
				bot.disconnect();
				process.exit(0);
			break;
			case "cheerMeUp":
			bot.sendMessage({
					to: channelID,
					message: cheerUpMessages[getRandom(cheerUpMessages.length)]
				});
			break;
			case "updateLists":
				console.log("Updating arrays...");
				fillArrays();
				console.log("Arrays updated!");
			break;
			case 'wholesomeImg':
			bot.uploadFile({
				to: channelID,
				file: "pictures/"+wholesomePics[getRandom(wholesomePics.length)]
			});
			break;
			case 'info':
				bot.sendMessage({
					to: channelID,
					embed: {
						color: 3447003,
						title: "WholesomeBot",
						thumbnail: {
							url: "http://twinkletits.duckdns.org/discordPics/wholesomeBotPic.png"
						},
						description: 'WholesomeBot is a Happy little bot whos goal is to make your day just that little bit better. For information on WholesomeBot, such as commands, visit [github](https://github.com/basion96/WholesomeBot)',
					}
				});
			break;
         }
     }
	 else{
		 if(message.toLowerCase()=='i love you wholesomebot' || message.toLowerCase()=='i love you <@380542695556251650>'){
			 bot.sendMessage({
					to: channelID,
					message: 'i love you too ' + '<@'+userID+'>'
				});
		 }
		 else if(message.toLowerCase().indexOf("thank you wholesomebot")!=-1 || message.toLowerCase().indexOf("thanks wholesomebot")!=-1 || message.toLowerCase().indexOf("thank you <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("thanks <@380542695556251650>")!=-1){
			 bot.sendMessage({
					to: channelID,
					message: 'No problem :blush:'
				});
		 }
		 else if(message.toLowerCase().indexOf("how are you wholesomebot")!=-1 || message.toLowerCase().indexOf("how're you wholesomebot")!=-1 || message.toLowerCase().indexOf("how you doing wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you today wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you doing today wholesomebot")!=-1 || message.toLowerCase().indexOf("how are you <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how're you <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how you doing <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how are you today <@380542695556251650>")!=-1 || message.toLowerCase().indexOf("how are you doing today <@380542695556251650>")!=-1){
			 bot.sendMessage({
					to: channelID,
					message: howAreYouReplies[getRandom(howAreYouReplies)]
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
		 else if(message=="SPOOK!"){
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
	var date = new Date();
	if(date.getHours()==2){
		console.log('Sending daily wholesome message...');
		bot.sendMessage({
			to: config.publicChannel,
			message: wholesomeMessages[getRandom(wholesomeMessages.length)]
		});
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
		if(err){
			return console.log(err);
		}
		for (var i=0; i<data.length; i++) {
			if(data[i].substring(0,1)!='@'){
				wholesomePics.push(data[i]);
			}
		}
	});
	
	fs.readFile("MessageFiles/howDoYouWorkReplies.txt", function(err, data) {
		if(err){
			return console.log(err);
		}
		howDoYouWorkReplies = data.toString().split("\n");
	});
}
