
console.log('the twitterbot has started.');

var Twit = require('twit');
var apiai = require('apiai');

var app = apiai("a1472ed63dc740f0ad52b368e1e6473c");

var T = new Twit({
  consumer_key:         'yP66U3HqLK5BjcBSYrT1fjZ3o',
  consumer_secret:      'CARE5MEDc0TvyeOcCvCKTQ9Ooz8F1uId1xKkLcUSQVS6kV0JdF',
  access_token:         '816768815556161537-tVWZKthR2eyrziUNf9jhJd3o9gDVJtN',
  access_token_secret:  'ziZJWaIRv5sv9H69tCcEweCt5DFWSKYXPrgSkVSHkycSr',
})


var translate = require('google-translate-api');

function translatetoTamil (txt, name) {
      translate(txt, {from: 'en', to: 'ta'}).then(res => {
        tweetIt(name + ': ' + res.text);
    }).catch(err => {
        console.error(err);
    });
}

//setting up a user stream
var stream = T.stream('user');
//when people tweet in general, as long as it does not mention me.
stream.on('tweet', tweetEvent);

  // var fs = require('fs');
  // var json = JSON.stringify(eventMsg,null,2);
  // fs.writeFile("tweet.json", json);

//setInterval(tweetDerozan, 1000*60*60*1);
//setInterval(tweetLowry, 1000*60*60*1);

function tweetEvent (eventMsg) {

  var replyto = eventMsg.in_reply_to_screen_name;
  var text = eventMsg.text;
  var from = eventMsg.user.screen_name;
  var name = eventMsg.user.name;



  if (from !== 'testing_stl' && replyto !== 'testing_stl' && from !== 'Raptors') {
    //translatetoTamil(text, name);
    // console.log('inside');
    tweetNOtranslate(text, name, from);
  }

  if (replyto === 'testing_stl' && from !== 'testing_stl') {
    // console.log('done');
    replyToTweets(name, from, text);
  }
}

function replyToTweets (name, from, text) {
  var request = app.textRequest(text, {
    sessionId: '<unique session id>'
  });

  request.on('response', function(response) {
      //console.log(response);
      var text = response.result.fulfillment.speech;
      console.log('THE TWEET: ' + text);
      tweetIt('@' + from + ' ' + text);
  });

  request.on('error', function(error) {
      console.log(error);
  });

  request.end();

}

/*
console.log('hello world.');
var name = eventMsg.source.name;
var screenName = eventMsg.source.screen_name;
tweetIt('@' + screenName + " yolo dolo.");
*/



function tweetNOtranslate (text, name, from) {

  var notranslatetweet = name + ': ' + text
  // var notranslatetweet = 'Hello World'
  console.log('retweeting.');
  tweetIt(notranslatetweet);

}
//
//
// function tweetDerozan () {
//   var derozan = '#DemarDeRozan   #NBAVOTE ' + '@DeMar_DeRozan' + '  Number: ' + Math.floor(Math.random()*100000000000000)
//   tweetIt(derozan);
// }
// function tweetLowry () {
//   var lowry = '#KyleLowry   #NBAVOTE ' + '@Klow7' + '  Number: ' + Math.floor(Math.random()*100000000000000)
//   tweetIt(lowry);
// }

function tweetIt(message) {
  var tweet = {
    status: message
  }
  T.post('statuses/update', tweet, tweeted);
}

function tweeted (err, data, response) {
  if (err) {
    console.log('error');
  }
  else {
    console.log('here.');
    console.log(response);
  }
}
