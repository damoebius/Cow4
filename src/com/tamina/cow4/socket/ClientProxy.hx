package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.GameServerMessage;
import com.tamina.cow4.socket.message.ClientMessage;

import nodejs.net.TCPSocket;
import com.tamina.cow4.socket.message.Error;
class ClientProxy extends Proxy<ClientMessage> {

    private var _socket:TCPSocket;

    public function new( c:TCPSocket ) {
        super('client proxy');
        _socket = c;
        _socket.on(TCPSocketEventType.Connect, socketServer_openHandler);
        _socket.on(TCPSocketEventType.Close, socketServer_closeHandler);
        _socket.on(TCPSocketEventType.Error, socketServer_errorHandler);
        _socket.on(TCPSocketEventType.Data, socketServer_dataHandler);
    }

    public function sendMessage( message:GameServerMessage ):Void {
        _socket.write(message.serialize());
    }

    override public function sendError( error:Error ):Void {
        _socket.write(error.serialize());
    }

}
