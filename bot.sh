if ! screen -list | grep -q "WholesomeBot"; then
  cd /home/pi/discordBots/WholesomeBot
  screen -S WholesomeBot -d -m node bot.js 
fi