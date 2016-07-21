var request = require('request-promise@1.0.2');

module.exports = function(ctx, cb) {
  var url = ctx.data.text.split(" ").pop();

  request(url)
    .then(function(response){
      console.log(response)
      cb(null, processResponse(url, response));
    })
    .catch(function(error){
      cb(error);
    })

  console.log(ctx);
}

var processResponse = function(url, response) {
  return {
    response_type: "in_channel",
    text: "`curl "+ url +"`",
    attachments: [{
      "color": "#36a64f",
      "mrkdwn_in": [
          "text",
          "fields"
      ],
      "fields": [{
          "title": "Headers",
          // "value": "Awesome Project",
          "short": false
      }, {
          "title": "Body",
          "value": '```'+ response +'```',
          "short": false
      }]
    }]
  }
}