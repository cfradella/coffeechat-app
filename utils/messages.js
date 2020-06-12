const moment = require('moment');

function formatMessage(username, text){
  return {
    username,
    text,
    time: moment().subtract(7, 'hours').format('h:mm a') // Substracting because it registers the timezone of Heroku instance
  }
}

module.exports = formatMessage;
