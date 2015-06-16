package com.tamina.cow4.socket;
import com.tamina.cow4.model.Profil;
import com.tamina.cow4.model.ItemType;
import com.tamina.cow4.model.Item;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.IAInfo;
import msignal.Signal;
import com.tamina.cow4.socket.message.TurnResult;
interface IIA {

    var id:Float;
    var name:String;
    var turnComplete:Signal1<TurnResult>;
    var pm:Int;
    var items:Array<Item>;
    var invisibilityDuration:Int;
    var trappedDuration:Int=0;
    var profil:Profil;


    function toInfo():IAInfo;
    function getTurnOrder(data:GameMap):Void;
    function getItemByType(type:ItemType):Item;
}
