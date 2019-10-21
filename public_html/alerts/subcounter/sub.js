// JavaScript source code $("#debug").html("socket data: " + socketMessage.data); 
var a = 0;
var eventData;
var timeinterval;
var inter;
var subcount = 2
$(document).ready(function () {
    connectWebsocket();
    
});

function connectWebsocket() {
    var socket = new WebSocket(API_Socket);
    
    socket.onopen = function () {
        var auth = {
            author: "Edog0049a",
            website: "edog0049a.com",
            api_key: API_Key,
            events: [
                "EVENT_SUB",
                "EVENT_GW_SUB"
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

    function updateText(m) {
 
            $("#displayMsg").html(m)
    };

    socket.onmessage = function (message) {
        console.log(message.data);
        var socketMessage = JSON.parse(message.data);
        switch (socketMessage.event) {
            case "EVENT_CONNECTED":
                 var m= subcount + "/10";
               updateText(m)
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
            case "EVENT_SUB":
            case "EVENT_GW_SUB":
                subcount += 1
                if(subcount >= 10)
                    subcount-=10;
                m= subcount + "/10";
                updateText(m)
                break;
             
            default:
        }
        
    };
}
