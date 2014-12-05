package com.tamina.cow4.socket;

import com.tamina.cow4.events.NotificationBus;
import com.tamina.cow4.socket.message.StartBattle;
import com.tamina.cow4.socket.message.ErrorCode;
import com.tamina.cow4.socket.message.Authenticate;
import com.tamina.cow4.socket.message.SocketMessage;
import com.tamina.cow4.socket.message.Error;
import haxe.Json;
import nodejs.ws.WebSocket;

class Player extends Client {


    private var _socket:WebSocket;

    public function new( c:WebSocket ) {
        super();
        _socket = c;
        _socket.on(WebSocketEventType.Open,socketServer_openHandler);
        _socket.on(WebSocketEventType.Close,socketServer_closeHandler);
        _socket.on(WebSocketEventType.Error,socketServer_errorHandler);
        _socket.on(WebSocketEventType.Message,socketServer_dataHandler);
    }

    override private function parseMessage(message:SocketMessage):Void{
        switch( message.type){
            case StartBattle.MESSAGE_TYPE:
                nodejs.Console.info('StartBattle');
                var startBattle:StartBattle = cast message;
                NotificationBus.instance.startBattle.dispatch(startBattle);
            default: sendError( new Error( ErrorCode.UNKNOWN_MESSAGE,'type de message inconnu') );

        }
    }

    override private function sendError(error:Error):Void{
        _socket.send(error.serialize());
    }


}
