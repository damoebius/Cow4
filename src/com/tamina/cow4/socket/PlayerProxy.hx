package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.PlayerMessage;
import com.tamina.cow4.socket.message.GameServerMessage;
import com.tamina.cow4.socket.message.ClientMessage;

import com.tamina.cow4.socket.message.ErrorCode;
import haxe.Json;
import com.tamina.cow4.socket.message.Error;
import msignal.Signal;
import nodejs.ws.WebSocket;

class PlayerProxy {

    public var errorSignal:Signal0;
    public var messageSignal:Signal1<PlayerMessage>;

    private var _socket:WebSocket;

    public function new(c:WebSocket) {
        errorSignal = new Signal0();
        messageSignal = new Signal1<PlayerMessage>();
        _socket = c;
        _socket.on(WebSocketEventType.Open,socketServer_openHandler);
        _socket.on(WebSocketEventType.Close,socketServer_closeHandler);
        _socket.on(WebSocketEventType.Error,socketServer_errorHandler);
        _socket.on(WebSocketEventType.Message,socketServer_dataHandler);
    }

    public function sendMessage(message:GameServerMessage):Void{
        _socket.send(message.serialize());
    }

    public function sendError(error:Error):Void{
        _socket.send(error.serialize());
    }

    private function socketServer_closeHandler(c:Dynamic):Void{
        nodejs.Console.info('[player proxy] connection close');
    }

    private function socketServer_dataHandler(data:String):Void{
        nodejs.Console.info('[player proxy] data received : ' + data);
        var message:PlayerMessage = Json.parse( data );
        if(message.type != null){
            messageSignal.dispatch(message);
        } else {
            sendError(new Error( ErrorCode.UNKNOWN_MESSAGE,'message inconnu'));
        }

    }

    private function socketServer_openHandler(c:Dynamic):Void{
        nodejs.Console.info('[player proxy] new connectionzzz');
    }

    private function socketServer_errorHandler(c:Dynamic):Void{
        nodejs.Console.info('[player proxy] ERROR '+ c);
        errorSignal.dispatch();
    }
}
