// Twilio and Firebase info.
var twilioAccountSID = '';
var twilioAuthToken = '';
var twilioNumber = '';
var firebaseSecret = '';
var firebaseURL = '';

// Create references for libraries.
var express = require('express');
var http = require('http');
var Firebase = require('firebase');
var twilio = require('twilio');

// Express server setup.
var router = express();
var server = http.createServer(router);
var twilioClient = twilio(twilioAccountSID, twilioAuthToken);

// Create a reference to textMessages on Firebase
// and authenticate the server with Firebase secret.
var textMessagesRef = new Firebase(firebaseURL + 'textMessages');
textMessagesRef.authWithCustomToken(firebaseSecret, function(error, authData) {
  if (error) {
    console.log("Firebase server authentication failed.");
  } else {
    console.log("Authenticated with Firebase secret successfully.");
  }
});

// Listen for new objects pushed to textMessagesRef.
textMessagesRef.on("child_added", function(snapshot) {
  var textMessage = snapshot.val();
  twilioClient.messages.create({
    body: 'Hi ' + textMessage.name + '! Your table for ' + textMessage.size + ' is now ready!',
    to: textMessage.phoneNumber,
    from: twilioNumber
  }, function(err, message) {
    if (err) {
      console.log(err);
    } else {
      console.log(message);
    }
  });
});

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});