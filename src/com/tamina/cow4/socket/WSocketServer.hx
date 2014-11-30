package com.tamina.cow4.socket;
import nodejs.ws.WebSocket;
import com.tamina.cow4.config.Config;
import nodejs.ws.WebSocketServer;
class WSocketServer {

    private var _server:WebSocketServer;

    public function new( ) {
        var opt:WebSocketServerOption = cast {
        port : Config.WEB_SOCKET_PORT
        };
        _server = new WebSocketServer(opt);
        _server.on(WebSocketServerEventType.Error, errorHandler);
        _server.on(WebSocketServerEventType.Connection, connectionHandler);
    }

    private function errorHandler( evt:Dynamic ):Void {
        trace('Socket server Error');
    }

    private function connectionHandler( socket:WebSocket ):Void {
        trace('Socket server : New Connection');
        socket.addEventListener(WebSocketEventType.Message, socketMessageHandler);
    }

    private function socketMessageHandler( message:String ):Void {
        trace('websocket message incomming');
    }
}
