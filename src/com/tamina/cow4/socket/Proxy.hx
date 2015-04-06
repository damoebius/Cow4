package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.SocketMessage;
import com.tamina.cow4.socket.message.ErrorCode;
import com.tamina.cow4.socket.message.Error;
import haxe.Json;
import msignal.Signal;
class Proxy<T:SocketMessage> {

    public var errorSignal:Signal0;
    public var closeSignal:Signal0;
    public var messageSignal:Signal1<T>;

    private var _data:String = '';
    private var _type:String = 'proxy';

    public function new( type:String ) {
        _type = type;
        errorSignal = new Signal0();
        closeSignal = new Signal0();
        messageSignal = new Signal1<T>();
    }

    public function sendError( error:Error ):Void {
    }

    private function socketServer_openHandler( c:Dynamic ):Void {
        trace('[' + _type + '] new connection');
    }

    private function socketServer_errorHandler( c:Dynamic ):Void {
        trace('[' + _type + '] ERROR ' + c);
        errorSignal.dispatch();
    }

    private function socketServer_closeHandler( c:Dynamic ):Void {
        trace('[' + _type + '] connection close');
        closeSignal.dispatch();
    }

    private function socketServer_dataHandler( data:String ):Void {
//trace('['+_type+'] data received ');
        _data += data.toString();
        if ( _data.indexOf(SocketMessage.END_CHAR) >= 0 ) {
            _data = _data.split(SocketMessage.END_CHAR).join('');
            if ( _data.length > 0 ) {
                socketServer_endHandler();
            } else {
                trace('message vide: ' + data);
            }
        }

    }

    private function socketServer_endHandler( ):Void {
//trace('[player proxy] MESSAGE OK : ' + _data);
        try {
            var message:T = Json.parse(_data);
            _data = '';
            if ( message.type != null ) {
                messageSignal.dispatch(message);
            } else {
                sendError(new Error( ErrorCode.UNKNOWN_MESSAGE, 'message inconnu'));
            }
        } catch ( e:js.Error ) {
            trace('[' + _type + '] impossible de parser le message json : ' + e.message);
            sendError(new Error( ErrorCode.UNKNOWN_MESSAGE, 'message inconnu'));
        }


    }
}
