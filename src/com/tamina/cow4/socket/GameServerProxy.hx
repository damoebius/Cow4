package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.GameServerMessage;
import com.tamina.cow4.socket.message.ClientMessage;

import nodejs.net.TCPSocket;
import com.tamina.cow4.socket.message.Error;

class GameServerProxy extends Proxy<GameServerMessage> {

    private var _socket:TCPSocket;

    public function new( c:TCPSocket ) {
        super('game server proxy');
        _socket = c;
        _socket.on(TCPSocketEventType.Connect, socketServer_openHandler);
        _socket.on(TCPSocketEventType.Close, socketServer_closeHandler);
        _socket.on(TCPSocketEventType.Error, socketServer_errorHandler);
        _socket.on(TCPSocketEventType.Data, socketServer_dataHandler);
//_socket.on(TCPSocketEventType.End, socketServer_endHandler);
    }

    public function sendMessage( message:ClientMessage ):Void {
        try {
            _socket.write(message.serialize());
        } catch ( e:js.Error ) {
            trace('ERROR : ' + e.message);
        }
    }

    override public function sendError( error:Error ):Void {
//_socket.write(error.serialize());
    }

}
