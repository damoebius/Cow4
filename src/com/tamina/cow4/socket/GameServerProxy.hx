package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.GameServerMessage;
import com.tamina.cow4.socket.message.ClientMessage;

import nodejs.net.TCPSocket;
import com.tamina.cow4.socket.message.ErrorCode;
import haxe.Json;
import com.tamina.cow4.socket.message.Error;
import msignal.Signal;

class GameServerProxy {

    public var errorSignal:Signal0;
    public var messageSignal:Signal1<GameServerMessage>;

    private var _socket:TCPSocket;
    private var _data:String = '';

    public function new(c:TCPSocket) {
        errorSignal = new Signal0();
        messageSignal = new Signal1<GameServerMessage>();
        _socket = c;
        _socket.on(TCPSocketEventType.Connect, socketServer_openHandler);
        _socket.on(TCPSocketEventType.Close, socketServer_closeHandler);
        _socket.on(TCPSocketEventType.Error, socketServer_errorHandler);
        _socket.on(TCPSocketEventType.Data, socketServer_dataHandler);
        _socket.on(TCPSocketEventType.Data, socketServer_endHandler);
    }

    public function sendMessage(message:ClientMessage):Void {
        _socket.write(message.serialize());
    }

    public function sendError(error:Error):Void {
        _socket.write(error.serialize());
    }

    private function socketServer_closeHandler(c:Dynamic):Void {
        nodejs.Console.info('[game server proxy] connection close');
    }

    private function socketServer_endHandler(data:String):Void {
        nodejs.Console.info('[game server proxy] message received : ' + data);
        if (_data != data) {
            _data += data;
        }
        var message:GameServerMessage = Json.parse(_data);
        _data = '';
        if (message.type != null) {
            messageSignal.dispatch(message);
        } else {
            sendError(new Error( ErrorCode.UNKNOWN_MESSAGE, 'message inconnu'));
        }


    }

    private function socketServer_dataHandler(data:String):Void {
        nodejs.Console.info('[game server proxy] data received : ' + data);
        _data += data;

    }

    private function socketServer_openHandler(c:Dynamic):Void {
        nodejs.Console.info('[game server proxy] new connectionzzz');
    }

    private function socketServer_errorHandler(c:Dynamic):Void {
        nodejs.Console.info('[game server proxy] ERROR ' + c);
        errorSignal.dispatch();
    }
}
