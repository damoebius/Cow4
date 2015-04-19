package com.tamina.cow4.model;

/**
* Item de potion d'invisibilité. Utilisée pour masquer sa position aux autres.
* @author d.mouton
* @class PotionItem
* @extends Item
*/
class PotionItem extends Item {
    public function new( ) {
        super(ItemType.POTION);
    }
}
