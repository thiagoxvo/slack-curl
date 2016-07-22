var request = require('request-promise@1.0.2');

module.exports = function(ctx, cb) {
  if (ctx.data.SLACK_COMMAND_TOKEN !== ctx.data.token)  {
      return cb(null, "`Tokens don't match, make sure to use the token provided in the Slash Command integration (SLACK_COMMAND_TOKEN)`");
  }
  var uri = ctx.data.text.split(" ").pop();
  if(!/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(uri)){
    return cb(null, { text :'`invalid URI`'} )
  }

  var options = {
    uri: uri,
    resolveWithFullResponse: true,
    simple: false
  }
  request(options)
    .then(function(response){
      if(!response.headers['content-type'].includes("application/json")) {
        cb(null, { text: '`response headers should have application/json`' })
        return
      }
      cb(null, processResponse(uri, response));
    })
    .catch(function(error){
      console.log(error);
      cb(null, { text: "`"+ error +"``" });
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
          "title": "Response Headers",
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