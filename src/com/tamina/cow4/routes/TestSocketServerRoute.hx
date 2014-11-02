package com.tamina.cow4.routes;
import nodejs.net.TCPSocket;
import com.tamina.cow4.config.Config;
import nodejs.net.Net;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;
class TestSocketServerRoute extends Route {

    private var _socket:TCPSocket;
    private var _response:ExpressResponse;
    private var _log:String='';

    public function new( ) {
        super(_sucessHandler);
    }

    private function _sucessHandler(request:ExpressRequest,response:ExpressResponse):Void{
        _response = response;
        _log = 'connecting to socket server <br/>';
        _socket = new TCPSocket();
        _socket.connect(Config.SOCKET_PORT,'localhost',connectionHandler);
    }

    private function connectionHandler():Void{
        _log += 'CONNECTED <br/> Sending message...';
        _socket.on(TCPSocketEventType.Data, socket_dataHandler);
        _socket.write('ping');
    }

    private function socket_dataHandler(data:String):Void{
        _log += 'Data recevied <br/>';
        _response.send(_log);
        _socket.destroy();
    }
}
