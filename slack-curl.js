var request = require('request-promise@1.0.2');

module.exports = function(ctx, cb) {
  if (ctx.data.SLACK_COMMAND_TOKEN !== ctx.data.token)  {
      return cb(null, "`Tokens don't match, make sure to use the token provided in the Slash Command integration (SLACK_COMMAND_TOKEN)`");
  }

  var url = ctx.data.text.split(" ").pop();
  var options = {
    uri: url,
    resolveWithFullResponse: true,
    simple: false
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
      console.log(error);
      cb(null, { text: 'error parsing curl: '+ error});
    })

  console.log(ctx);
}

var processResponse = function(url, response) {
  var responseColor = (response.statusCode === 200) ? 'good' : 'danger'
  return {
    response_type: "in_channel",
    text: "`curl "+ url +"`",
    attachments: [{
      "color": responseColor,
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
          "value": '```'+ JSON.stringify(response.headers, null, 2) +'```',
          "short": false
        }, {
          "title": "Body",
          "value": '```'+ JSON.stringify(JSON.parse(response.body), null, 2) +'```',
          "short": false
      }]
    }]
  }
}