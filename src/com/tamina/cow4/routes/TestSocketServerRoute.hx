package com.tamina.cow4.routes;
import com.tamina.cow4.socket.message.GetTurnOrder;
import com.tamina.cow4.socket.message.GameServerMessage;
import com.tamina.cow4.socket.GameServerProxy;
import haxe.Timer;
import haxe.Json;
import com.tamina.cow4.socket.message.ErrorCode;
import com.tamina.cow4.socket.message.Error;
import com.tamina.cow4.socket.message.ID;
import com.tamina.cow4.socket.message.SocketMessage;
import com.tamina.cow4.socket.message.Authenticate;
import nodejs.net.TCPSocket;
import com.tamina.cow4.config.Config;
import nodejs.net.Net;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;
class TestSocketServerRoute extends Route {

    private static inline var ALIVE_DURATION:Int = 10*60*1000;

    private var _socket:TCPSocket;
    private var _proxy:GameServerProxy;
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
        _log += 'CONNECTED <br/> Sending Auth message...';
        _proxy = new GameServerProxy(_socket);
        _proxy.messageSignal.add(serverMessageHandler);

        _proxy.sendMessage( new Authenticate('TestIA','http://images.groups.adobe.com/1332a08/logo100x100.gif'));
        Timer.delay(quit,ALIVE_DURATION);
    }

    private function quit():Void{
        _socket.destroy();
    }

    private function serverMessageHandler(message:GameServerMessage):Void{
        _log += 'Data recevied <br/>';
        if(message.type != null){
            switch( message.type){
                case ID.MESSAGE_TYPE:
                    var idMessage:ID = cast message;
                    _log += 'identification ' + idMessage;
                case Error.MESSAGE_TYPE:
                    var errorMessage:Error = cast message;
                    _log += 'ERROR ' +errorMessage.message +  ' <br/>';

                case GetTurnOrder.MESSAGE_TYPE:
                    nodejs.Console.info('demande de tour');
                    var getTurnOrder:GetTurnOrder = cast message;

                default: _log += 'type de message inconnu <br/>';

            }

        } else {
            _log += ' MESSAGE inconnu <br/>';
        }
        _response.send(_log);
    }
}
