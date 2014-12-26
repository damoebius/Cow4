package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.SocketMessage;
import js.html.MessageEvent;
import js.html.WebSocket;
import com.tamina.cow4.socket.message.PlayerMessage;
import com.tamina.cow4.socket.message.GameServerMessage;

import com.tamina.cow4.socket.message.ErrorCode;
import haxe.Json;
import com.tamina.cow4.socket.message.Error;
import msignal.Signal;

class PlayerServerProxy {

    public var errorSignal:Signal0;
    public var messageSignal:Signal1<GameServerMessage>;

    private var _socket:WebSocket;
    private var _data:String='';

    public function new(c:WebSocket) {
        errorSignal = new Signal0();
        messageSignal = new Signal1<GameServerMessage>();
        _socket = c;
        _socket.addEventListener('open',socketServer_openHandler);
        _socket.addEventListener('error',socketServer_errorHandler);
        _socket.addEventListener('message',socketServer_dataHandler);
    }

    public function sendMessage(message:PlayerMessage):Void{
        _socket.send(message.serialize());
    }

    public function sendError(error:Error):Void{
        _socket.send(error.serialize());
    }

    private function socketServer_closeHandler(c:Dynamic):Void{
        trace('[player server proxy] connection close');
    }

    private function socketServer_dataHandler(event:MessageEvent):Void {
        trace('[player server proxy] data received : ' + event.data);
        _data += event.data.toString();
        if(_data.indexOf(SocketMessage.END_CHAR) >= 0){
            _data = _data.split(SocketMessage.END_CHAR).join('');
            socketServer_endHandler();
        }

    }

    private function socketServer_endHandler():Void{
        var message:GameServerMessage = Json.parse( _data );
        _data = '';
        if(message.type != null){
            messageSignal.dispatch(message);
        } else {
            sendError(new Error( ErrorCode.UNKNOWN_MESSAGE,'message inconnu'));
        }

    }

    private function socketServer_openHandler(c:Dynamic):Void{
        trace('[player server proxy] new connectionzzz');
    }

    private function socketServer_errorHandler(c:Dynamic):Void{
        trace('[player server proxy] ERROR '+ c);
        errorSignal.dispatch();
    }
}
