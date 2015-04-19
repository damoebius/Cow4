package com.tamina.cow4.model;

/**
* Item de piege. Utilisée pour placer un piege sur la map.
* @author d.mouton
* @class TrapItem
* @extends Item
*/
class TrapItem extends Item {
    public function new( ) {
        super(ItemType.TRAP);
    }
}
