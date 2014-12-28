package com.tamina.cow4.socket.message.order;
import com.tamina.cow4.model.Action;
import com.tamina.cow4.model.TurnAction;
import com.tamina.cow4.model.Cell;

class MoveOrder extends TurnAction {

    public var target:Float;

    public function new( targetCell:Cell ) {
        super(Action.MOVE);
        this.target = targetCell.id;
    }
}
