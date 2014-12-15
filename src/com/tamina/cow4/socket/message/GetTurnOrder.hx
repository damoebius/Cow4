package com.tamina.cow4.socket.message;
import haxe.Serializer;
import com.tamina.cow4.model.GameMap;
class GetTurnOrder extends GameServerMessage {

    public static inline var MESSAGE_TYPE:String='getTurnOrder';

    public var data:String;

    public function new( data:GameMap ) {
        super(MESSAGE_TYPE);
        this.data = Serializer.run( data.toGameMapVO() );
    }
}
