package com.tamina.cow4.socket;
import nodejs.net.TCPSocket;
import nodejs.net.Net;
import nodejs.net.TCPServer;
class SocketServer {

    private var _server:TCPServer;
    private var _connection:TCPSocket;

    public function new( port:Int ) {
        _server = Net.createServer( socketServer_connectionHandler);
        /* */
        _server.listen(port,socketServer_createHandler);
    }

    private function socketServer_connectionHandler(c:TCPSocket):Void{
        trace('[socket server] new connection ');
        _connection = c;
        _connection.on(TCPSocketEventType.Connect,socketServer_connectHandler);
        _connection.on(TCPSocketEventType.End,socketServer_endHandler);
        _connection.on(TCPSocketEventType.Data,socketServer_dataHandler);
    }

    private function socketServer_dataHandler(c:Dynamic):Void{
        trace('[socket server] data received : ' + c);
        _connection.write('pong');
    }

    private function socketServer_connectHandler(c:Dynamic):Void{
        trace('[socket server] new connectionzzz');
    }

    private function socketServer_endHandler(c:Dynamic):Void{
        trace('[socket server] connection end');
    }

    private function socketServer_createHandler(c:Dynamic):Void{
        trace('[socket server] ready');
    }
}
