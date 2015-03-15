package com.tamina.cow4.model;

/**
* Une action à executer pendant le tour
* @author d.mouton
* @class Action
*/
@:enum abstract Action(String) from String to String {
/**
	 * déplacement
	 * @property MOVE
	 * @type String
	 * @default move
	 * @static
	 * @readOnly
	 */
    var MOVE="move";

    var FAIL="fail";

    var SUCCESS="success";
}
