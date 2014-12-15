package com.tamina.cow4.socket.message;
import com.tamina.cow4.model.vo.GameMapVO;
import com.tamina.cow4.model.GameMap;
class Render extends GameServerMessage {
    public static inline var MESSAGE_TYPE:String='render';

    public var map:GameMapVO;

    public function new( map:GameMapVO ) {
        super( MESSAGE_TYPE);
        this.map = map;
    }
}
