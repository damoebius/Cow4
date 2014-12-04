package com.tamina.cow4.socket.message;
class StartBattle extends SocketMessage{

    public static inline var MESSAGE_TYPE:String='startbattle';

    public var gameId:String;
    public var IA1:String;
    public var IA2:String;

    public function new(gameId:String, ia1:String,ia2:String ) {
        super( MESSAGE_TYPE);
        this.gameId = gameId;
        this.IA1 = ia1;
        this.IA2 = ia2;
    }
}
