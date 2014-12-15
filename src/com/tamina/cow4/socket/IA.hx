package com.tamina.cow4.socket;
import msignal.Signal;
import com.tamina.cow4.socket.message.Error;
import com.tamina.cow4.socket.message.ClientMessage;
import com.tamina.cow4.socket.message.GetTurnOrder;
import com.tamina.cow4.socket.message.ID;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.IAInfo;
import com.tamina.cow4.socket.message.GetTurnOrder;
import com.tamina.cow4.socket.message.Authenticate;
import org.tamina.net.URL;
import nodejs.net.TCPSocket;
import com.tamina.cow4.socket.message.ErrorCode;
class IA extends Client {

    public var name:String;
    public var avatar:URL;

    private var _proxy:ClientProxy;

    public function new( c:TCPSocket ) {
        super();
        _proxy = new ClientProxy(c);
        _proxy.messageSignal.add(clientMessageHandler);
        _proxy.errorSignal.add(exitHandler);
    }

    public function toInfo():IAInfo{
        return new IAInfo(id,name,avatar.path);
    }

    public function getTurnOrder(data:GameMap):Void{
        _proxy.sendMessage(new GetTurnOrder(data));
    }


    private function clientMessageHandler(message:ClientMessage):Void{
        switch( message.type){
            case Authenticate.MESSAGE_TYPE:
                nodejs.Console.info('demande dauthentifiction');
                var auth:Authenticate = cast message;
                if(isLoggued){
                    _proxy.sendError( new Error( ErrorCode.ALREADY_AUTH,'deja ahtentifié'));
                } else {
                    isLoggued = true;
                    name = auth.name;
                    avatar = new URL(auth.avatar);
                    _proxy.sendMessage( new ID( this.id ));
                }
            /*case GetTurnOrder.MESSAGE_TYPE:
                nodejs.Console.info('demande de tour');
                var getTurnOrder:GetTurnOrder = cast message;  */
            default: _proxy.sendError( new Error( ErrorCode.UNKNOWN_MESSAGE,'type de message inconnu') );

        }
    }

}
