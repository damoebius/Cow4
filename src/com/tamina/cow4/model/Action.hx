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

/**
	 * ramasser un objet
	 * @property GET_ITEM
	 * @type String
	 * @default getItem
	 * @static
	 * @readOnly
	 */
    var GET_ITEM="getItem";

/**
	 * utiliser un objet
	 * @property USE_ITEM
	 * @type String
	 * @default useItem
	 * @static
	 * @readOnly
	 */
    var USE_ITEM="useItem";

    var FAIL="fail";

    var SUCCESS="success";
}
