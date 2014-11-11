package com.tamina.cow4.routes;
import haxe.Json;
import com.tamina.cow4.model.IAInfo;
import com.tamina.cow4.socket.SocketServer;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;
class IAListRoute extends Route {

    public function new( ) {
        super(_sucessHandler);
    }

    private function _sucessHandler(request:ExpressRequest,response:ExpressResponse):Void{
        var connecions = SocketServer.connections;
        var result:Array<IAInfo> = new Array<IAInfo>();
        for(i in 0...connecions.length){
            if(connecions[i].isLoggued){
                result.push(connecions[i].toInfo());
            }
        }
        response.send( Json.stringify(result));
    }
}
