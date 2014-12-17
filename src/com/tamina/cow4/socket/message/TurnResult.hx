package com.tamina.cow4.socket.message;
import com.tamina.cow4.model.TurnAction;
class TurnResult extends ClientMessage{

    public static inline var MESSAGE_TYPE:String='turnResult';

    public var actions:Array<TurnAction>;


    public function new( ) {
        super( MESSAGE_TYPE);
        actions = new Array<TurnAction>();
    }
}
