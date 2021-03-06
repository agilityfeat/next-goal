$(document).ready(function () {
// Initialize the PubNub API connection.
var pubnub = PUBNUB.init({
publish_key: 'pub-c-24de4b19-9284-43ee-b600-5e7b38d31f5b',
subscribe_key: 'sub-c-9cc28534-8892-11e3-baad-02ee2ddab7fe'
});
 
// Grab references for all of our elements.
var messageContent = $('#messageContent'),
sendMessageButton = $('#sendMessageButton'),
yourName = $('#userName'),
announceGoalButton = $('#announceGoalButton'),
messageList = $('#messageList');
 
// Handles all the messages coming in from pubnub.subscribe.
function handleMessage(message) {
	var d = new Date();
	var messageEl = $("<li class='message'>"
+ "<span class='username'>" + message.username + " (" + ("00" + d.getHours()).slice(-2) + ":" + ("00" + d.getMinutes()).slice(-2) + ":" + ("00" + d.getSeconds()).slice(-2) + "): </span>"
+ message.text
+ "</li>");
	messageList.append(messageEl);
	messageList.listview('refresh');
 
	//$("#messageList").get(0).scrollIntoView();

};
 
// Compose and send a message when the user clicks our send message button.
sendMessageButton.click(function (event) {
	var message = messageContent.val();
 
	if (message != '') {
		pubnub.publish({
			channel: 'chat',
			message: {
				username: yourName.val(),
				text: message
			}
		});
 
		messageContent.val("");

	}
});
 
// Also send a message when the user hits the enter button in the text area.
messageContent.bind('keydown', function (event) {
if((event.keyCode || event.charCode) !== 13) return true;
sendMessageButton.click();
return false;
});
 
// Subscribe to messages coming in from the channel.
pubnub.subscribe({
channel: 'chat',
message: handleMessage
});

//Predict the next goal for a specific player
$(document).on("click", ".playerPrediction", function(){
	var message = "Predicting a goal by " + this.title;
	pubnub.publish({
		channel: 'chat',
		message: {
			username: yourName.val(),
			text: message
		}
	});
});

// Announce a goal was just scored!
announceGoalButton.click(function (event) {
	pubnub.publish({
		channel: 'chat',
		message: {
			username: yourName.val(),
			text: "GOOOOAAAAALLLLLL!!!!!!!"
		}
	});
});

});
