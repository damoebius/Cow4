package com.tamina.cow4.socket.message.order;
import com.tamina.cow4.model.Action;
import com.tamina.cow4.model.TurnAction;
class EndOrder extends TurnAction {

    public var message:String="";

    public function new( action:Action, message:String ) {
        super(action);
        this.message = message;
    }
}
