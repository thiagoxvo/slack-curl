module.exports = function(ctx, cb) {

  var exec = require('child_process').exec;
  exec('curl ' + ctx.data.text, function(err, success){
    if (err) return cb(err)
    cb(null, success)
  })
  console.log(ctx)
}