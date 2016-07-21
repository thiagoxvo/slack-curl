# slack-curl
Simple way to curl directly from slack using a [webtask](http://webtask.io)

## How to use it
- Clone this repo
- Create a slash command on https://api.slack.com/slash-commands
- Get the token generated on slack  

<img width="1135" alt="screen shot 2016-07-21 at 7 15 30 pm" src="https://cloud.githubusercontent.com/assets/37016/17040729/e99d117c-4f77-11e6-959f-a775fb4b2217.png">
- Create a webtask
```
$ npm install wt-cli -g
$ wt init <your-email>
$ wt create slack-curl.js \
  --name slack-curl \
  --secret SLACK_COMMAND_TOKEN=<get from slack>
```
- Set the generated webtask url on slack  

<img width="1163" alt="screen shot 2016-07-21 at 7 15 54 pm" src="https://cloud.githubusercontent.com/assets/37016/17040759/0301a678-4f78-11e6-9e26-1e794621c267.png">

Test it!  

<img width="642" alt="screen shot 2016-07-21 at 7 21 46 pm" src="https://cloud.githubusercontent.com/assets/37016/17040837/6cd8327e-4f78-11e6-99a8-90cbc656a7a0.png">

### Todo
- Accept request headers
- Accept POST
- Send POST body