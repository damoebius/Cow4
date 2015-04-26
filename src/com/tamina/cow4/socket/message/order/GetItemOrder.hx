package com.tamina.cow4.socket.message.order;
import com.tamina.cow4.model.Action;
import com.tamina.cow4.model.TurnAction;

/**
* Order de ramassage d'item
* @author d.mouton
* @class GetItemOrder
*/
class GetItemOrder extends TurnAction {

    public function new( ) {
        super(Action.GET_ITEM);
    }

}
