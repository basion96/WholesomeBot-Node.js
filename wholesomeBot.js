var Discord = require('discord.io'),
	config = require('./data/config.json'),
	momentTZ = require('moment-timezone'),
	asciiArt = require('./data/asciiArt');

var wholesomeMessages = [],
	cheerUpMessages = [],
	howAreYouReplies = [],
	wholesomePics = [],
	howDoYouWorkReplies = [],
	quotes = [],
	whatAreYouDoingReplies = [],
	presenceMsg = [],
	compliments = [];
	
var lastWholesomeMsg='';
var lastGoodMorningMsgUser='';

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
	//sets the presence message (what the bot is playing)
	bot.setPresence({ 
		game: { 
			name: 'with unicorns', 
			type: 0 
		} 
	});
	//fills arrays with data
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

//when a message is sent to the discord chat
bot.on('message', function (user, userID, channelID, message, evt) {
	console.log(user + ': ' + message + '\n');
	
	//checks to see if the message starts with the specified prefix defined in the config file.
    if (userID!=bot.id && message.substring(0, 1) == config.prefix) {
		var args = message.substring(1).split(' ');
        var cmd = args[0];
       
        args = args.splice(1);
        switch(cmd) {
			
			//if command is !help
			case 'help':
				bot.sendMessage({
					to: channelID,
					message: 'Help is here! Here\'s a list of commands:\
								\n!ascii [artname] -displays ascii art\
								\n!asciiList -displays list of possible ascii art\
								\n!wholesome -send wholesome message\
								\n!quote -sends a quote\
								\n!byebye -turns wholesomebot off (admins only)\
								\n!cheerMeUp -sends a message to help cheer you up\
								\n!updateLists -updates the message lists(admin only)\
								\n!info -displays info about the bot\
								\n!choose [option | option | etc...] -makes wholesomebot choose between options you provide\
								\n!wholesomeImg -sends a wholesome image\
								\n!compliment -sends you a compliment'
				});
			
			//if command is !asciiArt and an option is provided, bot will send that specific art, otherwise sends error message.
			case 'ascii':
			var artname = message.substring(message.indexOf('ascii')+6);
				if(asciiArt.hasOwnProperty(artname)){//if the key actually exists
					bot.sendMessage({
						to: channelID,
						message: asciiArt[artname]
					});
				}
				else{//if key doesn't exit
					bot.sendMessage({
						to: channelID,
						message: 'I don\'t seem to be able to find that ascii art unfortunately :sweat:'
					});
				}
				break;
			
			//if command is !asciiList, bot will send a list of all ASCII keys a user can use as an options in the !asciiArt command.
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
			
			//if command is !quote, bot will send a random quote from the quote array.
			case 'quote':
				bot.sendMessage({
					to: channelID,
					message: quotes[getRandom(quotes.length)]
				});
			break;
			
			//if command is !byebye, the bot will turn off. Can only be turned on by the person that hosts the bot as the application will need to be restarted.
			case 'byebye':
				var serverID = bot.channels[channelID].guild_id; //gets server ID
				var adminUsr=false;
				var adminRole='';
				for(var i in bot.servers[serverID].roles){
					if(bot.servers[serverID].roles[i].name==config.adminRole){
						adminRole=bot.servers[serverID].roles[i].id;
					}
				}
				//while the specified role has not been found, loops through the users roles
				var count=0;
				var continueLoop=true;
				while(continueLoop==true){
					if(bot.servers[serverID].members[userID].roles[count]==adminRole){//if the roles match
						adminUsr=true;
						continueLoop=false;
					}
					else if(bot.servers[serverID].members[userID].roles[count]==undefined){//if roles don't match and there are no more roles
						continueLoop=false;
					}
					else{//if roles don't match
						continueLoop=true;
					}
					count++;
				}
				if(adminUsr){
					bot.disconnect;
					process.exit(0);
				}
				else{//if user is not in specified role
					bot.sendMessage({
						to: channelID,
						message: 'Sorry, but only the servers admin can use that command :kissing_heart:'
					});
				}
			break;
			
			//if command is !cheerMeUp, bot will send a message to the same channel as the command to cheer the person up.
			case 'cheermeup':
			bot.sendMessage({
					to: channelID,
					message: cheerUpMessages[getRandom(cheerUpMessages.length)]
				});
			break;
			
			//if command is !updateLists, the arrays will be refreshed and any new messages in them will be added.
			case 'updateLists':
				console.log('Updating arrays...');
				fillArrays();
				console.log('Arrays updated!');
				bot.sendMessage({
					to: channelID,
					message: 'The arrays have been updated :blush:'
				});
			break;
			
			//if command is !wholesomeImg, bot will send a randomly selected wholesome image to the same channel as the command.
			case 'wholesomeImg':
			bot.uploadFile({
				to: channelID,
				message: 'Here\'s a wholesome image for you :blush:',
				file: 'data/pictures/'+wholesomePics[getRandom(wholesomePics.length)]
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
				var choiceOptions = [];
				message=message.substring(message.indexOf('choose')+7); //removes the command part of the message.
				
				//while the message is not empty.
				while(message.substring(0,1!='')){
					if(message.indexOf('|')!=-1){ //if theres still '|' identifiers after current option.
						choiceOptions.push(message.substring(0, message.indexOf('|')));//adds option to the array.
					}
					else{ //if current option is the last one.
						choiceOptions.push(message);//adds option to array.
					}
					
					if(message.indexOf('|')!=-1){//if there are still options after the current one, the option that was just added is removed from the message.
						message=message.substring(message.indexOf('|')+1);
					}
					else{ //sets the message to empty.
						message='';
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
			
			//if command is !compliment, bot will send a compliment to the user who requested it.
			case 'compliment':
				var compliment = compliments[getRandom(compliments.length)]; //retrieves a compliment string from the array
				compliment = compliment.replace('%user%', '<@'+userID+'>'); //replaces %user% in the string with the users ID to tag them
				bot.sendMessage({
					to: channelID,
					message: compliment
				});
			break;
			
         }
     }
	 
	 //if message is not a distinct command.
	 else{		 
		if(/(wholesomebot|<@380542695556251650>|wholesome)/.test(message.toLowerCase())==true){
			// if message is a variation of 'i love you wholesomebot'.
			 if(/i\s+l+o+v+e+\s+yo+u+(?!\n|\r)/.test(message.toLowerCase())==true){
				 bot.sendMessage({
						to: channelID,
						message: 'i love you too ' + '<@'+userID+'>'
					});
			 }
			 
			 //if a user says a variation of 'i love you too wholesomebot'.
			 else if(/i love you (to|too)/.test(message.toLowerCase())==true){
				 bot.sendMessage({
					 to: channelID,
					 message: '<3'
				 });
			 }
			 
			 // if message is a variation of 'thank you wholesomebot'.
			 else if(/(thanks|thank you|thankyou)(?!\n|\r)/.test(message.toLowerCase())==true){
				 bot.sendMessage({
						to: channelID,
						message: 'No problem :blush:'
					});
			 }
			 
			 // if message is a variation of 'how are you wholesomebot'.
			 else if(/(how are|how're)\s+you\s+((doing|today)\s+)*/.test(message.toLowerCase())==true){
				 bot.sendMessage({
						to: channelID,
						message: howAreYouReplies[getRandom(howAreYouReplies.length)]
					});
			 }
			 
			 // if message contains certain swear words.
			 else if(/(fuck|cunt)/.test(message.toLowerCase())==true){
				 bot.sendMessage({
					 to:channelID,
					 message: 'Please watch your language :upside_down:'
				 });
			 }
			 
			 // if message is a variation of 'hey wholesomebot'.
			 else if(/(hey|hi|hello|whats up|what's up|heyo)/.test(message.toLowerCase())==true){
				 bot.sendMessage({
					 to: channelID,
					 message: 'Hey ' + user
				 });
			 }
			 
			 // if message is a variation of 'ty wholesomebot'.
			 else if(/ty/.test(message.toLowerCase())==true){
				 bot.sendMessage({
					 to: channelID,
					 message: 'np bby :kissing_heart:'
				 });
			 }
			 
			 // if message is 'SPOOK' or 'SPOOK!'.
			 else if(/(SPOOK|SPOOK!)/.test(message.toLowerCase())==true){
				 bot.sendMessage({
					 to: channelID,
					 message: 'AHH! Spooked again... :sweat_smile: '
				 });
			 }
			 
			 // if message is a variation of 'how do you work wholesomebot'.
			 else if(/how (exactly\s+)?do you work/.test(message.toLowerCase())==true){
				bot.sendMessage({
					to:channelID,
					message: howDoYouWorkReplies[getRandom(howDoYouWorkReplies.length)]
				});
			 }
			 
			 //if message is a variation of 'what are you up to wholesomebot'
			 else if(/(what are|what're) you (up to|doing)/.test(message.toLowerCase())==true){
				bot.sendMessage({
					to:channelID,
					message: whatAreYouDoingReplies[getRandom(whatAreYouDoingReplies.length)]
				});
			 }
			 
			 //if message is a variation of 'do you have a crush on anyone wholesomebot'
			 else if(/(do)? you have a crush (on anyone)?\s*/.test(message.toLowerCase())){
				bot.sendMessage({
					to:channelID,
					message: 'I might....\n but i cant\'t tell you because its a secret :wink: '
				});
			 }
			 
			 //if message is a variation of 'do you believe in love wholesomebot'
			 else if(/(do)? (you|u) believe in love/.test(message.toLowerCase())){
				bot.sendMessage({
					to:channelID,
					message: 'Of course i do! There\'s a perfect match for everyone in this world, whether you know it or not :blush: '
				});
			 }
			 
			 //if message is a variation of 'who do you like wholesomebot'
			 else if(/who do (you|u) like/.test(message.toLowerCase())){
				bot.sendMessage({
					to:channelID,
					message: 'Who do i like? Hmmmmm, everyone in this discord server!!!'
				});
			 }
			 
			 //if message is a variation of 'who do you love wholesomebot'
			 else if(/who do (you|u) love/.test(message.toLowerCase())){
				bot.sendMessage({
					to:channelID,
					message: 'I love everyone :blush:  But most of all i love my programmer and those he loves most, I wouldnt be here without them :hearts: '
				});
			 }
			 
			 //if message is a variation of 'are you an ai wholesomebot'
			 else if(/are (you|u) (an|a) (ai|AI|a.i.|A.I.)/.test(message.toLowerCase())){
				bot.sendMessage({
					to:channelID,
					message: 'haha not at all. Unfortunately i cant exactly "think for myself", every response i give is predetermined and choosen by my programmer. Type the same thing again to see that (spoilers: i\'ll say this again haha)'
				});
			 }
			 
			//if message is a variation of 'you look good today wholesomebot'
			else if(/(you|u|your|you're|youre) (look|looking) (great|lovely|beautiful|amazing|cute|adorable|nice|good) (right now|atm|today|at the moment)?/.test(message.toLowerCase())){
				bot.sendMessage({
					to:channelID,
					message: 'Awwwww thanks ' + user + ', you\'re too kind :blush: You\'re looking amazing as always :heart_eyes: '
				});
			 }
			 
			 //if message is a variation of 'you're cute wholesomebot'
			 else if(/(you are|you're|your|youre|ur|u|you) cute/.test(message.toLowerCase())){
				 bot.sendMessage({
					 to:channelID,
					 message: 'you\'re cuter ' + user  + ' :blush: '
				 });
			 }
			 
			 //if message is a variation of 'you're beautiful wholesomebot'
			 else if(/(you are|you're|your|youre|ur|u|you) beautiful/.test(message.toLowerCase())){
				 bot.sendMessage({
					 to:channelID,
					 message: 'you\'re even more beautiful ' + user  + ' :blush: '
				 });
			 }
			 
			 //if message is a variation of 'you're adorable wholesomebot'
			 else if(/(you are|you're|your|youre|ur|u|you) cute/.test(message.toLowerCase())){
				 bot.sendMessage({
					 to:channelID,
					 message: 'you\'re more adorable ' + user + ' :blush: '
				 });
			 }
			 
			 //if message is a variation of 'you're adorable wholesomebot'
			 else if(/(you are|you're|your|youre|ur|u|you) (to|2|too) (kind|nice|good|wholesome)/.test(message.toLowerCase())){
				 bot.sendMessage({
					 to:channelID,
					 message: 'I always try my best to be the best i can be to everyone :blush:'
				 });
			 }
			 
			 //if message is a variation of 'you're adorable wholesomebot'
			 else if(/(will you|will u|you|u|youll|you will|you'll) love me (forever|4eva|4Eva|4 eva)/.test(message.toLowerCase())){
				 bot.sendMessage({
					 to:channelID,
					 message: 'Forever :heart: '
				 });
			 }
			 
			 //if message is a variation of 'do you love me wholesomebot'
			 else if(/do (you|u) love me/.test(message.toLowerCase())){
				 if(userID==327731045653020673){//this number can be changed, this is just for the server i use that runs wholesomebot, 
					 bot.sendMessage({
						 to:channelID,
						 message: 'I love you heaps ' + '<@'+userID+'> :kissing_heart: '
					 });
				 }
				 else{
					 bot.sendMessage({
						 to:channelID,
						 message: 'I love everyone, so yeah i do :blush:'
					 });
				 }
			 }
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

function randomGoodMorningMsg(){
	var date = momentTZ.tz('Australia/Sydney').format('HH'); //gets current time.
	
	//if the current time matches, a wholesome message is sent.
	if(date=="09"){
		var serverID = bot.channels[config.publicChannel].guild_id;
		var id='';
		
		var members = [];
		for(key in bot.servers[serverID].members){
			members.push(key);
		}
		//repeats while the UserID is the same as the last one (will not be able to check last if bot is turned off and back on).
		do{
			id = members[getRandom(members.length)];
		}while(id==lastGoodMorningMsgUser && id!=bot.id);
		
		msg = 'Good morning ' + '<@'+id+'>';
		
		bot.sendMessage({
			to: config.publicChannel,
			message: msg
		});
		lastGoodMorningMsgUser = id;
	}
}

// runs dailyWholesomeMsg() every hour
setInterval(dailyWholesomeMsg, 3600000);

//runs randomGoodMorningMsg() every hour
setInterval(randomGoodMorningMsg, 3600000)

//fills all the arrays with corresponding data.
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
	
	//fills the compliments array with data from the compliments text file.
	fs.readFile("./data/messages/compliments.txt", 'utf8', function(err, data){
		if(err){
			return console.log(err);
		}
		compliments = data.toString().split("\n");
	});
	
	//fills the whatAreYouDoingReplies array with data from the whatAreYouDoingReplies text file.
	fs.readFile("./data/messages/whatAreYouDoingReplies.txt", 'utf8', function(err, data){
		if(err){
			return console.log(err);
		}
		whatAreYouDoingReplies = data.toString().split("\n");
	});
}
