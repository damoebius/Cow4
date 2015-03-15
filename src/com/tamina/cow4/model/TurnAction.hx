package com.tamina.cow4.model;

/**
* Une action à executer pendant le tour
* @author d.mouton
* @class TurnAction
*/
class TurnAction {

/**
	 * le type d'action
	 * @property type
	 * @type Action
	 */
    public var type:Action;

    public function new(type:Action) {
        this.type = type;
    }
}
