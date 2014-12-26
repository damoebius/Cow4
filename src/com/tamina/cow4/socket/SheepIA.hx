package com.tamina.cow4.socket;

import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.IAInfo;
import org.tamina.utils.UID;
import com.tamina.cow4.socket.message.TurnResult;
import msignal.Signal;
class SheepIA implements IIA {

    public var id:Float;
    public var name:String='SheepIA';
    public var turnComplete:Signal1<TurnResult>;

    public function new():Void {
        id = UID.getUID();
        turnComplete = new Signal1<TurnResult>();
    }

    public function toInfo():IAInfo {
        return new IAInfo(id, name, "");
    }

    public function getTurnOrder(data:GameMap):Void {
        var result = new TurnResult();
        turnComplete.dispatch(result);
    }


}
