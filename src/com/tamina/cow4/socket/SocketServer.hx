package com.tamina.cow4.socket;
import nodejs.net.TCPSocket;
import nodejs.net.Net;
import nodejs.net.TCPServer;
class SocketServer {

    public static var connections:Array<IA>;

    private var _server:TCPServer;

    public function new( port:Int ) {
        connections = new Array<IA>();
        _server = Net.createServer( socketServer_connectionHandler);
        _server.listen(port,socketServer_createHandler);
    }

    private function socketServer_connectionHandler(c:TCPSocket):Void{
        trace('[socket server] new connection ');
        var ia = new IA(c);
        connections.push(ia);

    }

    private function socketServer_createHandler(c:Dynamic):Void{
        trace('[socket server] ready');
    }
}
