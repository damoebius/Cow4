package com.tamina.cow4.socket;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.IAInfo;
import msignal.Signal;
import com.tamina.cow4.socket.message.TurnResult;
interface IIA {

    var id:Float;
    var name:String;
    var turnComplete:Signal1<TurnResult>;
    function toInfo():IAInfo;
    function getTurnOrder(data:GameMap):Void;
}
