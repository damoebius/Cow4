package com.tamina.cow4.model;

/**
* Classe de base des items
* @author d.mouton
* @class Item
*/
class Item {

/**
	 * le type d'item
	 * @property type
	 * @type ItemType
	 */
    public var type:ItemType;

    public function new(type:ItemType ) {
        this.type = type;
    }
}
