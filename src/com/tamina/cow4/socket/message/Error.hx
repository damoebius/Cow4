package com.tamina.cow4.socket.message;
class Error extends SocketMessage {

    public static inline var MESSAGE_TYPE:String='error';

    public var code:ErrorCode;
    public var message:String;

    public function new(code:ErrorCode,message:String ) {
        super( MESSAGE_TYPE);
        this.code = code;
        this.message = message;
    }
}
