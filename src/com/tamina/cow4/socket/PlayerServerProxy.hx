package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.SocketMessage;
import js.html.MessageEvent;
import js.html.WebSocket;
import com.tamina.cow4.socket.message.PlayerMessage;
import com.tamina.cow4.socket.message.GameServerMessage;

import com.tamina.cow4.socket.message.ErrorCode;
import haxe.Json;
import com.tamina.cow4.socket.message.Error;
import msignal.Signal;

class PlayerServerProxy extends Proxy<GameServerMessage> {

    private var _socket:WebSocket;

    public function new(c:WebSocket) {
        super('player server proxy');
        _socket = c;
        _socket.addEventListener('open',socketServer_openHandler);
        _socket.addEventListener('error',socketServer_errorHandler);
        _socket.addEventListener('message',webSocketServer_dataHandler);
    }

    private function webSocketServer_dataHandler(event:MessageEvent):Void{
        super.socketServer_dataHandler(event.data);

    }

    public function sendMessage(message:PlayerMessage):Void{
        _socket.send(message.serialize());
    }

    override public function sendError(error:Error):Void{
        _socket.send(error.serialize());
    }

}
