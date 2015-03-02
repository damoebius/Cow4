package com.tamina.cow4.socket;

import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.IAInfo;
import org.tamina.utils.UID;
import com.tamina.cow4.socket.message.TurnResult;
import msignal.Signal;
class SheepIA implements IIA {

    inline public static var IA_NAME:String='SheepIA';

    public var id:Float;
    public var name:String= IA_NAME;
    public var turnComplete:Signal1<TurnResult>;
    public var pm:Int=1;

    public function new():Void {
        id = UID.getUID();
        turnComplete = new Signal1<TurnResult>();
    }

    public function toInfo():IAInfo {
        return new IAInfo(id, name, "",pm);
    }

    public function getTurnOrder(data:GameMap):Void {
        var result = new TurnResult();
        turnComplete.dispatch(result);
    }


}
