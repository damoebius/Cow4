package com.tamina.cow4.socket.message;
class StartQualif extends PlayerMessage{

    public static inline var MESSAGE_TYPE:String='startqualif';

    public var gameId:String;
    public var token:String;

    public function new(gameId:String, token:String ) {
        super( MESSAGE_TYPE);
        this.gameId = gameId;
        this.token = token;
    }
}
