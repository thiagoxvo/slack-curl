var request = require('request-promise@1.0.2');

module.exports = function(ctx, cb) {
  var url = ctx.data.text.split(" ").pop();

  request(url)
    .then(function(response){
      cb(null, response);
    })
    .catch(function(error){
      cb(error);
    })

  console.log(ctx);
}