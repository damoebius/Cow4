package com.tamina.cow4.socket.message;
class ID extends SocketMessage {
    public static inline var MESSAGE_TYPE:String='id';

    public var id:Float;

    public function new( id:Float ) {
        super( MESSAGE_TYPE);
        this.id = id;
    }
}
