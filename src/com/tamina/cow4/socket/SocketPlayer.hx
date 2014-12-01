package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.ErrorCode;
import com.tamina.cow4.socket.message.GetTurnOrder;
import com.tamina.cow4.socket.message.ID;
import org.tamina.net.URL;
import com.tamina.cow4.socket.message.Error;
import com.tamina.cow4.socket.message.Authenticate;
import haxe.Json;
import com.tamina.cow4.socket.message.SocketMessage;
import nodejs.ws.WebSocket;
import msignal.Signal;
import org.tamina.utils.UID;
class SocketPlayer {

    public var id:Float;

    public var exitSignal:Signal1<Float>;

    private var _socket:WebSocket;

    public function new( c:WebSocket ) {
        id = UID.getUID();
        exitSignal = new Signal1<Float>();
        _socket = c;
        _socket.on(WebSocketEventType.Open,socketServer_openHandler);
        _socket.on(WebSocketEventType.Close,socketServer_closeHandler);
        _socket.on(WebSocketEventType.Error,socketServer_errorHandler);
        _socket.on(WebSocketEventType.Message,socketServer_dataHandler);
    }

    private function socketServer_closeHandler(c:Dynamic):Void{
        nodejs.Console.info('[web socket server] connection close');
    }

    private function socketServer_dataHandler(data:String):Void{
        nodejs.Console.info('[web socket server] data received : ' + data);
        var message:SocketMessage = Json.parse( data );
        if(message.type != null){
            switch( message.type){
                case Authenticate.MESSAGE_TYPE:
                    nodejs.Console.info('demande dauthentifiction');
                    var auth:Authenticate = cast message;
                    if(isLoggued){
                        _socket.write( new Error( ErrorCode.ALREADY_AUTH,'deja ahtentifié').serialize());
                    } else {
                        isLoggued = true;
                        name = auth.name;
                        avatar = new URL(auth.avatar);
                        _socket.write( new ID( this.id ).serialize());
                    }
                case GetTurnOrder.MESSAGE_TYPE:
                    nodejs.Console.info('demande de tour');
                    var getTurnOrder:GetTurnOrder = cast message;
                default: _socket.write( new Error( ErrorCode.UNKNOWN_MESSAGE,'type de message inconnu').serialize());

            }

        } else {
            _socket.write( new Error( ErrorCode.UNKNOWN_MESSAGE,'message inconnu').serialize());
        }

    }

    private function socketServer_openHandler(c:Dynamic):Void{
        nodejs.Console.info('[web socket server] new connectionzzz');
    }

    private function socketServer_errorHandler(c:Dynamic):Void{
        nodejs.Console.info('[web socket server] ERROR '+ c);
        exitSignal.dispatch(id);
    }
}
