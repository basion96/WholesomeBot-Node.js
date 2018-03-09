if ! screen -list | grep -q "WholesomeBot"; then
  cd /path/to/WholesomeBot
  screen -S WholesomeBot -d -m node wholesomeBot.js 
fi
