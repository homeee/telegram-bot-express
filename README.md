# telegram-bot-express
Telagram bot that interact with vary of api's related to movies
 

Available at http://t.me/konodno_bot

# deployment on production
`npm run build`
- make sure pm2 installed, see `ecosystem.config.js` file

# to see all messages in real time
Log into ssh, get to project folder and perform `tail -f winston-logger/messages.log` 
or `tail -f winston-logger/error.log` to log errors