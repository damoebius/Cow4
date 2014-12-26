package com.tamina.cow4.socket.message;
import haxe.Json;
class SocketMessage {

    inline public static var END_CHAR:String='#end#';

    public var type:String='';

    public function new( type:String ) {
        this.type = type;
    }

    public function serialize():String{
        return Json.stringify(this)+END_CHAR;
    }
}
