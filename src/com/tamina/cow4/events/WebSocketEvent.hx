package com.tamina.cow4.events;
class WebSocketEvent {

}

typedef WebSocketErrorEvent = {
    var type:String;
    var detail:String;
}

typedef WebSocketMessageEvent = {
    var type:String;
    var data:String;
}
