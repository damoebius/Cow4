package com.tamina.cow4;
import nodejs.NodeJS;
import com.tamina.cow4.socket.message.TurnResult;
import com.tamina.cow4.socket.message.GetTurnOrder;
import com.tamina.cow4.socket.message.ID;
import com.tamina.cow4.socket.message.Error;
import com.tamina.cow4.socket.message.GameServerMessage;
import haxe.Timer;
import com.tamina.cow4.socket.message.Authenticate;
import com.tamina.cow4.config.Config;
import nodejs.net.TCPSocket;
import com.tamina.cow4.socket.GameServerProxy;
import nodejs.Process;
class IADemoApp {

    private static inline var ALIVE_DURATION:Int = 10*60*1000;

    private static var _app:IADemoApp;

    private var _socket:TCPSocket;
    private var _proxy:GameServerProxy;

    public function new() {
        _socket = new TCPSocket();
        _socket.connect(Config.SOCKET_PORT,'localhost',connectionHandler);
    }

    private function connectionHandler():Void{
        nodejs.Console.log( 'CONNECTED <br/> Sending Auth message...');
        _proxy = new GameServerProxy(_socket);
        _proxy.messageSignal.add(serverMessageHandler);
        _proxy.closeSignal.add(quit);
        _proxy.sendMessage( new Authenticate('DemoIA','http://images.groups.adobe.com/1332a08/logo100x100.gif'));
        Timer.delay(quit,ALIVE_DURATION);
    }

    private function serverMessageHandler(message:GameServerMessage):Void{
        nodejs.Console.info( '[TestIA] Data recevied ' );
        if(message.type != null){
            switch( message.type){
                case ID.MESSAGE_TYPE:
                    var idMessage:ID = cast message;
                    nodejs.Console.info( '[TestIA] identification ' + idMessage);
                case Error.MESSAGE_TYPE:
                    var errorMessage:Error = cast message;
                    nodejs.Console.info( '[TestIA] ERROR ' +errorMessage.message );

                case GetTurnOrder.MESSAGE_TYPE:
                    nodejs.Console.info('demande de tour');
                    var getTurnOrder:GetTurnOrder = cast message;
                    processTurn(getTurnOrder);

                default: nodejs.Console.warn( '[TestIA] type de message inconnu ');

            }

        } else {
            nodejs.Console.warn( '[TestIA]  MESSAGE inconnu ');
        }
    }
    private function processTurn(data:GetTurnOrder):Void{
        var result = new TurnResult();
        _proxy.sendMessage(result);
    }


    private function quit():Void{
        _socket.destroy();
       NodeJS.process.exit(0);
    }

    public static function main() {
        _app = new IADemoApp();
    }
}
