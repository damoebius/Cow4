package com.tamina.cow4.socket.message;
import haxe.Json;
class SocketMessage {

    public var type:String='';

    public function new( type:String ) {
        this.type = type;
    }

    public function serialize():String{
        return Json.stringify(this);
    }
}
