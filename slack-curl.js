var request = require('request-promise@1.0.2');
var parse = require('shell-quote@1.4.3').parse;
var _ = require('lodash@4.8.2')

module.exports = function(ctx, cb) {
  if (ctx.data.SLACK_COMMAND_TOKEN !== ctx.data.token)  {
      return cb(null, "`Tokens don't match, make sure to use the token provided in the Slash Command integration (SLACK_COMMAND_TOKEN)`");
  }

  var parsedArgs = parse(ctx.data.text)
  var uri = parsedArgs.pop().pattern;
  if(!/^(http|https):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(([0-9]{1,5})?\/.*)?$/.test(uri)){
    return cb(null, { text :'`invalid URI ' + uri + '`'} )
  }

  var params = parseParams(parsedArgs)
  var method = _.first(params['-X']) || 'GET';
  var options = {
    method: method,
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
      cb(null, createSlackMessage(uri, method, response));
    })
    .catch(function(error){
      console.log(error);
      cb(null, { text: "`"+ error +"``" });
    })

  console.log(ctx);
}

var parseParams = function(parsedArgs){
  var acceptedParams = ['-X', '-H']
  var params = {}
  parsedArgs.forEach(function(param, index) {
    if(!_.includes(acceptedParams, param)) return;

    var value = parsedArgs[index+1]
    params[param] ?
      params[param].push(value) :
      params[param] = [value]
  })
  return params
}

var createSlackMessage = function(url, method, response) {
  var responseColor = (response.statusCode === 200) ? 'good' : 'danger'
  return {
    response_type: "in_channel",
    attachments: [{
      text: "`" + method + " " + url + "`",
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
          "title": "> Headers",
          "value": '```'+ JSON.stringify(response.headers, null, 2) +'```',
          "short": false
        }, {
          "title": "> Body",
          "value": '```'+ JSON.stringify(JSON.parse(response.body), null, 2) +'```',
          "short": false
      }]
    }]
  }
}