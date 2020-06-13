const moment = require('moment');

function formatMessage(username, text, isAdmin){
  return {
    username,
    text,
    isAdmin,
    time: moment().subtract(7, 'hours').format('h:mm a') // Substracting because it registers the timezone of Heroku instance
  }
}

module.exports = formatMessage;
