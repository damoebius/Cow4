package com.tamina.cow4.model.vo;

/**
* Objet du model representant une case de la map
* @author d.mouton
* @class Cell
*/
class CellVO {

/**
	 * id de la case
	 * @property id
	 * @type Float
	 */
    public var id:Float;

/**
	 * id de la case au dessus
	 * @property top
	 * @type Float
	 */
    public var top:Float;

/**
	 * id de la case en dessous
	 * @property bottom
	 * @type Float
	 */
    public var bottom:Float;

/**
	 * id de la case à gauche
	 * @property left
	 * @type Float
	 */
    public var left:Float;

/**
	 * id de la  case à droite
	 * @property right
	 * @type Float
	 */
    public var right:Float;

    /**
	 * occupant de la case
	 * @property occupant
	 * @type IAInfo
	 */
    public var occupant:IAInfo;
    
    public function new(id:Float, ?occupant:IAInfo ) {
        this.id = id;
        this.occupant = occupant;
    }
}
