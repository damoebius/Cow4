package com.tamina.cow4.socket.message.order;
import com.tamina.cow4.model.Item;
import com.tamina.cow4.model.Action;
import com.tamina.cow4.model.TurnAction;

/**
* Order de ramassage d'item
* @author d.mouton
* @class GetItemOrder
*/
class UseItemOrder extends TurnAction {

    public var item:Item;

    public function new(item:Item) {
        super(Action.USE_ITEM);
        this.item = item;
    }

}
