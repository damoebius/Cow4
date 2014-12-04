package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.GetTurnOrder;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.IAInfo;
import haxe.Json;
import com.tamina.cow4.socket.message.ID;
import org.tamina.net.URL;
import com.tamina.cow4.socket.message.Authenticate;
import com.tamina.cow4.socket.message.SocketMessage;
import com.tamina.cow4.socket.message.ErrorCode;
import com.tamina.cow4.socket.message.Error;
import nodejs.net.TCPSocket;
class IA extends Client {

    public var name:String;
    public var avatar:URL;

    private var _socket:TCPSocket;


    public function new( c:TCPSocket ) {
        super();
        _socket = c;
        _socket.on(TCPSocketEventType.Connect,socketServer_openHandler);
        _socket.on(TCPSocketEventType.Close,socketServer_closeHandler);
        _socket.on(TCPSocketEventType.Error,socketServer_errorHandler);
        _socket.on(TCPSocketEventType.Data,socketServer_dataHandler);
    }

    public function toInfo():IAInfo{
        return new IAInfo(id,name,avatar.path);
    }

    public function sendIAOrder(data:GameMap):Void{
        _socket.write( new GetTurnOrder(data));
    }


    override private function parseMessage(message:SocketMessage):Void{
        switch( message.type){
            case Authenticate.MESSAGE_TYPE:
                nodejs.Console.info('demande dauthentifiction');
                var auth:Authenticate = cast message;
                if(isLoggued){
                    sendError( new Error( ErrorCode.ALREADY_AUTH,'deja ahtentifié'));
                } else {
                    isLoggued = true;
                    name = auth.name;
                    avatar = new URL(auth.avatar);
                    _socket.write( new ID( this.id ).serialize());
                }
            case GetTurnOrder.MESSAGE_TYPE:
                nodejs.Console.info('demande de tour');
                var getTurnOrder:GetTurnOrder = cast message;
            default: sendError( new Error( ErrorCode.UNKNOWN_MESSAGE,'type de message inconnu') );

        }
    }

    override private function sendError(error:Error):Void{
        _socket.write(error.serialize());
    }

}
