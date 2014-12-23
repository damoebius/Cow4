package com.tamina.cow4.socket.message;
import com.tamina.cow4.model.vo.GameMapVO;
import haxe.Serializer;
import com.tamina.cow4.model.GameMap;
class GetTurnOrder extends GameServerMessage {

    public static inline var MESSAGE_TYPE:String='getTurnOrder';

    public var data:GameMapVO;

    public function new( data:GameMapVO ) {
        super(MESSAGE_TYPE);
        this.data = data ;
    }
}
