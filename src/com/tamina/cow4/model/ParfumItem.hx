package com.tamina.cow4.model;

/**
* Item de parfum aux hormones de poule. Utilisée pour donner un bonus en PM au Coq.
* @author d.mouton
* @class ParfumItem
* @extends Item
*/
class ParfumItem extends Item {
    public function new( ) {
        super(ItemType.PARFUM);
    }
}
