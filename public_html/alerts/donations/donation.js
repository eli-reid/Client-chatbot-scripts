var eventData;
$(document).ready(function () {
    connectWebsocket();  
});
function connectWebsocket() {
    var socket = new WebSocket(API_Socket);
    socket.onopen = function () {
        var auth = {
            author: "Eli Reid",
            website: "elireid.com",
            api_key: API_Key,
            events: [
                "EVENT_UPDATE",
                "EVENT_DONATION"
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
                return
	};   
    socket.onerror = function(error){
	//  Something went terribly wrong... Respond?!
        console.log("Error: " + error);
        return
    };    
    socket.onmessage = function (message) {
        console.log(message.data);
        var socketMessage = JSON.parse(message.data);
        switch (socketMessage.event) {
            case "EVENT_CONNECTED":
                data=JSON.stringify({event:"data",getData:true})
                 $.post("http://foxzsheriff.edog0049a.com:2828",data);//request data
                break;
            case "EVENT_UPDATE":                   
                eventData = JSON.parse(socketMessage.data);
                console.log(eventData.Days)
                updateBackground();
                break;
            case "EVENT_DONATION":
                var DData=JSON.parse(socketMessage.data);
                current=Number.parseFloat(eventData.Current.replace("$","")) 
                current += Number.parseFloat(DData.amount);
                currents= "$" + Number.parseFloat(current).toFixed(2).toString();
                data=JSON.stringify({event:"current",current:currents});
                $.post("http://foxzsheriff.edog0049a.com:2828",data);
                console.log(DData.amount);
                console.log(currents);
                break;
            default:
        }
        return
        
    };
}
// layout funtions
function rainbow(element) {
    rst = "";
    for (var i = 1; i < eventData[element + "Colors"] + 1; i++) {
        rst += eventData[element + "Color" + i];
        if (i != eventData[element + "Colors"])
            rst += ",";
    }
    console.log("linear-gradient(" + eventData[element + "RainbowSlider"] +"deg," + rst + ")")
    return  "linear-gradient(" + eventData[element + "RainbowSlider"] +"deg," + rst + ")";
}
function updateText(element,data) {
    switch (eventData[data +"Style"]) {
        case "Rainbow":
            $("#" + element).css("background", rainbow(data));
            $("#" + element).css("-webkit-background-clip", "text");
            $("#" + element).css("-webkit-text-fill-color", "transparent");
            break;
        case "Solid Color":
            $("#" + element).css("color",eventData[data+"Color1"]);
            break;
    }
    $("#" + element).css("font-size", eventData[data + "SizeSlider"]); 
    return;
}
function updateBackground(){
    $("#days").html(getDays());
    $("#title").html(eventData.Title);
    $("#max").html(eventData.Total);
    $("#progress p").html(eventData.Current + " (" + getpercent()+ "%)"); 
    $("#background").css("background-color",eventData.BackgroundColor);
    $("#donation_container").css("width",eventData.BackgroundWidthSlider+"px");
    $("#background").css("height",eventData.BackgroundHeightSlider +"px");
    $("#progress").css("height",eventData.BackgroundHeightSlider +"px");
    $("#progress p").css("line-height",eventData.BackgroundHeightSlider +"px");
    $("#background").css("border-color",eventData.BorderColor);
    $("#background").css("border-style",eventData.BorderStyle);
    $("#background").css("border-width",eventData.BorderWidthSlider +"px");
    $("#progress p").css("color",eventData.BackgroundTextColor);    
    $("#title").css("text-size",eventData.TitleSizeSlider);
    $("#footer").css("text-size",eventData.FooterSizeSlider);
    updateText("title","Title");
    updateText("max","Footer");
    updateText("days","Footer");
    updateText("min","Footer");
    return;
}
function getDays(){
    if(eventData.Days < 1)
    {
        return "Goal Has Ended, Thank You!";
    }
    
    if(eventData.Days===1)
    {
        return "Ends Today!";
    }
    return eventData.Days + " Days Left!";
    }
function updateProgress(percent){
    if (percent > 100){
        $("#progress").css("width","100%");
    }
    else{
       $("#progress").css("width",percent +"%");  
    }
     switch (eventData.ProgressStyle) {
        case "Rainbow":
            $("#progress").css("background", rainbow("Progress"));
            break;
        case "Solid Color":
            $("#progress").css("background-color",eventData.ProgressColor1);
            break;
    }
    console.log("udp");
    return;
}
function getpercent(){
    current=Number.parseFloat(eventData.Current.toString().replace("$",""));
    total=Number.parseFloat(eventData.Total.toString().replace("$",""));
    percent=Number.parseFloat(current/total*100).toFixed(1);
    console.log(percent);
    updateProgress(percent);
    return percent;
    }
//tmijs BIT EVENT
let options = {
options: {
    debug: true
},
connection: {
    secure: true,
    reconnect: true
},
identity: {
    username: "Edog0049aBot",
    password: "oauth:gz0vqce5qsbl2vjzvt099w13933ivl"
},
channels: [ "#alilfoxz","#edog0049a" ]
};
let client = new tmi.client(options);
client.connect();
client.on("cheer", (channel, userstate, message) => {
    current=Number.parseFloat(eventData.Current.toString().replace("$",""));
    current += userstate.bits/100;
    currents= "$" + Number.parseFloat(current).toFixed(2).toString();
    data=JSON.stringify({event:"current",current:currents});
    $.post("http://foxzsheriff.edog0049a.com:2828",data);  
});
