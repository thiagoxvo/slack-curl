var request = require('request-promise@1.0.2');

module.exports = function(ctx, cb) {
  var url = ctx.data.text.split(" ").pop();
  var options = {
    uri: url,
    resolveWithFullResponse: true
  }
  request(options)
    .then(function(response){
      if(!response.headers['content-type'].includes("application/json")) {
        cb(null, { text: '`response headers should have application/json`' })
        return
      }
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
      "fields": [
        {
          "title": "Response "+response.statusCode,
          "short": false
        },
        {
          "title": "Headers",
          "value": '```'+ JSON.stringify(response.headers) +'```',
          "short": false
        }, {
          "title": "Body",
          "value": '```'+ response.body +'```',
          "short": false
      }]
    }]
  }
}