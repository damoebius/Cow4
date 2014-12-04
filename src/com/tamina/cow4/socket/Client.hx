package com.tamina.cow4.socket;
import com.tamina.cow4.socket.message.Error;
import msignal.Signal;
import org.tamina.utils.UID;
import com.tamina.cow4.socket.message.ErrorCode;
import haxe.Json;
import com.tamina.cow4.socket.message.SocketMessage;
class Client {

    public var id:Float;
    public var isLoggued:Bool = false;
    public var exitSignal:Signal1<Float>;

    public function new() {
        id = UID.getUID();
        exitSignal = new Signal1<Float>();
    }

    private function parseMessage(message:SocketMessage):Void{
    }

    private function sendError(error:Error):Void{
    }

    private function socketServer_closeHandler(c:Dynamic):Void{
        nodejs.Console.info('[web socket server] connection close');
    }

    private function socketServer_dataHandler(data:String):Void{
        nodejs.Console.info('[web socket server] data received : ' + data);
        var message:SocketMessage = Json.parse( data );
        if(message.type != null){
          parseMessage(message);
        } else {
            sendError(new Error( ErrorCode.UNKNOWN_MESSAGE,'message inconnu'));
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
