package com.tamina.cow4.socket.message.order;
import com.tamina.cow4.model.Action;
import com.tamina.cow4.model.TurnAction;
import com.tamina.cow4.model.Cell;

/**
* Order de déplacement
* @author d.mouton
* @class MoveOrder
*/
class MoveOrder extends TurnAction {

/**
	 * l'id de la cellule ciblée
	 * @property target
	 * @type Float
	 */
    public var target:Float;

    public function new( targetCell:Cell ) {
        super(Action.MOVE);
        this.target = targetCell.id;
    }
}
