package com.tamina.cow4.socket;
import nodejs.ws.WebSocket;
import com.tamina.cow4.config.Config;
import nodejs.ws.WebSocketServer;
class WSocketServer {

    public static var connections:Array<SocketPlayer>;

    private var _server:WebSocketServer;

    public function new( ) {
        connections = new Array<SocketPlayer>();
        var opt:WebSocketServerOption = cast {
        port : Config.WEB_SOCKET_PORT
        };
        _server = new WebSocketServer(opt);
        _server.on(WebSocketServerEventType.Error, errorHandler);
        _server.on(WebSocketServerEventType.Connection, connectionHandler);
    }

    public static function getPlayerById(id:Float):SocketPlayer{
        var result:SocketPlayer = null;
        trace('search Player : ' + id);
        for(i in 0...connections.length){
            if(connections[i].id == id){
                result = connections[i];
                trace('Player found');
                break;
            }
        }
        return result;
    }

    private function errorHandler( evt:Dynamic ):Void {
        trace('[Socket server] Error');
    }

    private function connectionHandler( socket:WebSocket ):Void {
        trace('[Socket server] : New Connection');
        var p = new SocketPlayer(socket);
        p.exitSignal.addOnce(playerCloseHandler);
        connections.push(p);
    }

    private function playerCloseHandler( id:Float ):Void {
        for ( i in 0...connections.length ) {
            var c = connections[i];
            if(c.id == id){
                connections.remove(c);
                break;
            }
        }
    }
}
