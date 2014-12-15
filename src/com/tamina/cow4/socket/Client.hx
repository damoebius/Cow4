package com.tamina.cow4.socket;


import msignal.Signal;
import org.tamina.utils.UID;

class Client {

    public var id:Float;
    public var isLoggued:Bool = false;
    public var exitSignal:Signal1<Float>;

    public function new() {
        id = UID.getUID();
        exitSignal = new Signal1<Float>();
    }

    private function exitHandler():Void{
        exitSignal.dispatch(id);
    }


}
