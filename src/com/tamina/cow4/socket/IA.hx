package com.tamina.cow4.socket;
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

    private var _socket:TCPSocket;
    private var _loggued:Bool = false;

    public function new( c:TCPSocket ) {
        id = UID.getUID();
        _socket = c;
        _socket.on(TCPSocketEventType.Connect,socketServer_connectHandler);
        _socket.on(TCPSocketEventType.End,socketServer_endHandler);
        _socket.on(TCPSocketEventType.Data,socketServer_dataHandler);
    }

    private function socketServer_dataHandler(data:String):Void{
        trace('[socket server] data received : ' + data);
        var message:SocketMessage = Json.parse( data );
        if(message.type != null){
            switch( message.type){
                case Authenticate.MESSAGE_TYPE:
                trace('demande dauthentifiction');
                var auth:Authenticate = cast message;
                if(_loggued){
                    _socket.write( new Error( ErrorCode.ALREADY_AUTH,'deja ahtentifié').serialize());
                } else {
                    _loggued = true;
                    name = auth.name;
                    avatar = new URL(auth.avatar);
                    _socket.write( new ID( this.id ).serialize());
                }
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
    }
}
