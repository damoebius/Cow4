package com.tamina.cow4.model;

/**
* Les types d'items
* @author d.mouton
* @class ItemType
*/
@:enum abstract ItemType(String) from String to String {

    /**
	 * potion d'invisibilité
	 * @property POTION
	 * @type String
	 * @default potion
	 * @static
	 * @readOnly
	 */
    var POTION='potion';

/**
	 * parfum aux hormones
	 * @property PARFUM
	 * @type String
	 * @default parfum
	 * @static
	 * @readOnly
	 */
    var PARFUM='parfum';

/**
	 * piege
	 * @property TRAP
	 * @type String
	 * @default trap
	 * @static
	 * @readOnly
	 */
    var TRAP='trap';

}
