package com.tamina.cow4.socket;
import nodejs.net.TCPSocket;
import nodejs.net.Net;
import nodejs.net.TCPServer;
class SocketServer {

    public static var connections:Array<IA>;

    private var _server:TCPServer;

    public function new( port:Int ) {
        connections = new Array<IA>();
        _server = Net.createServer(socketServer_connectionHandler);
        _server.listen(port, socketServer_createHandler);
    }

    public static function getIAById(id:Float):IA{
        var result:IA = null;
        for(i in 0...connections.length){
            if(connections[i].id == id){
                result = connections[i];
                break;
            }
        }
        return result;
    }

    private function socketServer_connectionHandler( c:TCPSocket ):Void {
        trace('[socket server] new connection ');
        var ia = new IA(c);
        ia.exitSignal.addOnce(iaCloseHandler);
        connections.push(ia);

    }

    private function iaCloseHandler( id:Float ):Void {
        for ( i in 0...connections.length ) {
            var c = connections[i];
            if(c.id == id){
                connections.remove(c);
                break;
            }
        }
    }

    private function socketServer_createHandler( c:Dynamic ):Void {
        trace('[socket server] ready');
    }
}
