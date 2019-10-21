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
function TimeDiff() {
    var Start = new Date();
    var End = new Date(Start.getFullYear(), Start.getMonth(), Start.getDate(), eventData.Hr, eventData.Min, 0);
    End = End < Start ? new Date(Start.getFullYear(), Start.getMonth(), Start.getDate() + 1, eventData.Hr, eventData.Min, 0) : End;
    var d = End - Start;
    var hours = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((d % (1000 * 60)) / 1000);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (hours == 0 && minutes == 0 && seconds == 0) {
        clearInterval(timeinterval);
        timeinterval = 0;
        $("#displayMsg").html(eventData.EndMsg);
        $("#hours").html("");
        $("#minutes").html("");
        $("#seconds").html("");
    }
    else {
        $("#hours").html(hours + ":");
        $("#minutes").html(minutes + ":");
        $("#seconds").html(seconds);
    }
    return;
}

function connectWebsocket() {
    var socket = new WebSocket(API_Socket);
    
    socket.onopen = function () {
        var auth = {
            author: "Eli Reid",
            website: "elireid.com",
            api_key: API_Key,
            events: [
                "EVENT_START", 
                "EVENT_STOP",
                "EVENT_UPDATE",
                "EVENT_ADD_MIN",
                "EVENT_ADD_HOUR",
                "EVENT_END",
                "EVENT_CHEER"
                
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
    
    socket.onerror = function(error)
    {
         clearInterval(ping);
	//  Something went terribly wrong... Respond?!
        console.log("Error: " + error);
    };             

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
        if (timeinterval)
            $("#displayMsg").html(eventData.DisplayMsg);
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
            case "EVENT_START":
                eventData = JSON.parse(socketMessage.data);
                if (!timeinterval) 
                    timeinterval = setInterval(TimeDiff, 1000);
                updateText();
                break;
            case "EVENT_STOP":
                clearInterval(timeinterval);
                timeinterval = 0;
                $("#displayMsg").html("Timer Stopped");
                $("#hours").html("");
                $("#minutes").html("");
                $("#seconds").html("");
                break;
            case "EVENT_UPDATE":                   
                eventData = JSON.parse(socketMessage.data);
                updateText();
                break;
            case "EVENT_ADD_MIN":
                eventData = JSON.parse(socketMessage.data);
                if (!timeinterval) 
                    timeinterval = setInterval(TimeDiff, 1000);
                updateText();
                break;
            case "EVENT_ADD_HOUR":
                eventData = JSON.parse(socketMessage.data);
                if (!timeinterval) 
                    timeinterval = setInterval(TimeDiff, 1000);
                updateText();
                break;
        
            default:
        }
        
    };
}
