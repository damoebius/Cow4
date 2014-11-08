package com.tamina.cow4.socket.message;
class Authenticate extends SocketMessage{

    public static inline var MESSAGE_TYPE:String='authenticate';

    public var name:String;
    public var avatar:String;

    public function new(name:String, avatar:String='' ) {
        super( MESSAGE_TYPE);
        this.name = name;
        this.avatar = avatar;
    }
}
