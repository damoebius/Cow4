package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.GetTurnOrder;
import com.tamina.cow4.model.GameMap;
import msignal.Signal.Signal1;
import com.tamina.cow4.model.IAInfo;
import haxe.Json;
import com.tamina.cow4.socket.message.ID;
import org.tamina.net.URL;
import org.tamina.utils.UID;
import com.tamina.cow4.socket.message.Authenticate;
import com.tamina.cow4.socket.message.SocketMessage;
import com.tamina.cow4.socket.message.ErrorCode;
import com.tamina.cow4.socket.message.Error;
import nodejs.net.TCPSocket;
class IA {

    public var id:Float;
    public var name:String;
    public var avatar:URL;
    public var isLoggued:Bool = false;

    public var exitSignal:Signal1<Float>;

    private var _socket:TCPSocket;


    public function new( c:TCPSocket ) {
        id = UID.getUID();
        exitSignal = new Signal1<Float>();
        _socket = c;
        _socket.on(TCPSocketEventType.Connect,socketServer_connectHandler);
        _socket.on(TCPSocketEventType.Close,socketServer_closeHandler);
        _socket.on(TCPSocketEventType.End,socketServer_endHandler);
        _socket.on(TCPSocketEventType.Data,socketServer_dataHandler);
    }

    public function toInfo():IAInfo{
        return new IAInfo(id,name,avatar.path);
    }

    public function sendIAOrder(data:GameMap):Void{
        _socket.write( new GetTurnOrder(data));
    }

    private function socketServer_closeHandler(c:Dynamic):Void{
        trace('[socket server] connection close');
    }

    private function socketServer_dataHandler(data:String):Void{
        trace('[socket server] data received : ' + data);
        var message:SocketMessage = Json.parse( data );
        if(message.type != null){
            switch( message.type){
                case Authenticate.MESSAGE_TYPE:
                trace('demande dauthentifiction');
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
                trace('demande de tour');
                var getTurnOrder:GetTurnOrder = cast message;
                default: _socket.write( new Error( ErrorCode.UNKNOWN_MESSAGE,'type de message inconnu').serialize());

            }

        } else {
            _socket.write( new Error( ErrorCode.UNKNOWN_MESSAGE,'message inconnu').serialize());
        }

    }

    private function socketServer_connectHandler(c:Dynamic):Void{
        trace('[socket server] new connectionzzz');
    }

    private function socketServer_endHandler(c:Dynamic):Void{
        trace('[socket server] connection end');
        exitSignal.dispatch(id);
    }
}
