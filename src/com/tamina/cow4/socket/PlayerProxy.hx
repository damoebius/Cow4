package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.PlayerMessage;
import com.tamina.cow4.socket.message.GameServerMessage;

import com.tamina.cow4.socket.message.Error;
import nodejs.ws.WebSocket;

class PlayerProxy extends Proxy<PlayerMessage> {

    private var _socket:WebSocket;

    public function new( c:WebSocket ) {
        super('player proxy');
        _socket = c;
        _socket.on(WebSocketEventType.Open, socketServer_openHandler);
        _socket.on(WebSocketEventType.Close, socketServer_closeHandler);
        _socket.on(WebSocketEventType.Error, socketServer_errorHandler);
        _socket.on(WebSocketEventType.Message, socketServer_dataHandler);
    }

    public function sendMessage( message:GameServerMessage ):Void {
        try {
            _socket.send(message.serialize());
        } catch ( e:js.Error ) {
            trace('ERROR : ' + e.message);
        }
    }

    override public function sendError( error:Error ):Void {
//_socket.send(error.serialize());
    }

}
