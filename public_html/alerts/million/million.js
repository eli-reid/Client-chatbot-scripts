/* global API_Socket */

// JavaScript source code $("#debug").html("socket data: " + socketMessage.data); 
var a = 0;
var eventData;
var timeinterval;
var inter;
$(document).ready(function () {
    connectWebsocket();
    
});
function rainbow() {
    rst = "";
    for (var i = 1; i < eventData.Colors + 1; i++) {
        rst += eventData["Color" + i];
        if (i != eventData.Colors)
            rst += ",";
    }
    return rst;
};
function viewAlert(){
    
    
}
function updateText() {
    switch (eventData.Style) {
        case "Rainbow":
            rangeString = "linear-gradient(" + eventData.RainbowSlider +"deg," + rainbow() + ")";
            $("#timer").css("background", rangeString);
            $("#timer").css("-webkit-background-clip", "text");
            $("#timer").css("-webkit-text-fill-color", "transparent");
            break;
        case "Solid Color":
            $("#timer").css("color",eventData.Color1);
            break;
    }
    $("#timer").css("font-size", eventData.TextSize);   

        $("#displayMsg").html(eventData.DisplayMsg);
}


function connectWebsocket() {
    var socket = new WebSocket(API_Socket);
    socket.onopen = function () {
        var auth = {
            author: "Edog0049a",
            website: "edog0049a.com",
            api_key: API_Key,
            events: [
                "EVENT_VIEW_COUNT"
            ]
        };
        console.log("connecting");
        socket.send(JSON.stringify(auth));
        return;
    };
    socket.onclose = function() {
		// Clear socket to avoid multiple ws objects and EventHandlings
		socket = null;		
		// Try to reconnect every 5s 
                console.log("reconnecting");
		setTimeout(function(){connectWebsocket();}, 5000);						
	};   
    socket.onerror = function(error) {
        clearInterval(ping);
        console.log("Error: " + error);
    };             
    socket.onmessage = function (message) {
        console.log(message.data);
        var socketMessage = JSON.parse(message.data);
        switch (socketMessage.event) {
            case "EVENT_CONNECTED":
                ping = setInterval(function(){
                    try{
                        socket.send("k");  
                    }
                    catch(e){
                        clearInterval(ping);
                        // bhg,.klconsole.log("send Error: " . e)           
                    }
                }, 5000);
                break;
            case "EVENT_VIEW_COUNT":
                //eventData = JSON.parse(socketMessage.data);
                 $("#displayMsg").html("1,000,000 Veiws");
               
                break;
            default:
        }
        
    };
}