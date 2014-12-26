package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.SocketMessage;
import com.tamina.cow4.socket.message.GameServerMessage;
import com.tamina.cow4.socket.message.ClientMessage;

import nodejs.net.TCPSocket;
import com.tamina.cow4.socket.message.ErrorCode;
import haxe.Json;
import com.tamina.cow4.socket.message.Error;
import msignal.Signal;
class ClientProxy {

    public var errorSignal:Signal0;
    public var messageSignal:Signal1<ClientMessage>;

    private var _socket:TCPSocket;
    private var _data:String = '';

    public function new(c:TCPSocket) {
        errorSignal = new Signal0();
        messageSignal = new Signal1<ClientMessage>();
        _socket = c;
        _socket.on(TCPSocketEventType.Connect,socketServer_openHandler);
        _socket.on(TCPSocketEventType.Close,socketServer_closeHandler);
        _socket.on(TCPSocketEventType.Error,socketServer_errorHandler);
        _socket.on(TCPSocketEventType.Data,socketServer_dataHandler);
    }

    public function sendMessage(message:GameServerMessage):Void{
        _socket.write(message.serialize());
    }

    public function sendError(error:Error):Void{
        _socket.write(error.serialize());
    }

    private function socketServer_closeHandler(c:Dynamic):Void{
        nodejs.Console.info('[client proxy] connection close');
    }

    private function socketServer_endHandler():Void{
        nodejs.Console.info('[client proxy] message received : ' + _data);
        var message:ClientMessage = Json.parse( _data );
        _data = '';
        if(message.type != null){
            messageSignal.dispatch(message);
        } else {
            sendError(new Error( ErrorCode.UNKNOWN_MESSAGE,'message inconnu'));
        }

    }

    private function socketServer_dataHandler(data:String):Void {
        _data += data.toString();
        if(_data.indexOf(SocketMessage.END_CHAR) >= 0){
            _data = _data.split(SocketMessage.END_CHAR).join('');
            socketServer_endHandler();
        }

    }

    private function socketServer_openHandler(c:Dynamic):Void{
        nodejs.Console.info('[client proxy] new connection');
    }

    private function socketServer_errorHandler(c:Dynamic):Void{
        nodejs.Console.info('[client proxy] ERROR '+ c);
        errorSignal.dispatch();
    }
}
