package com.tamina.cow4.model.vo;

/**
* Objet du model representant l'ensemble des éléments d'une partie
* @author d.mouton
* @class GameMap
*/
class GameMapVO {

/**
	 * id de la map
	 * @property id
	 * @type Float
	 */
    public var id:Float;

/**
	 * liste 2d des cases de la map
	 * @property cells
	 * @type Cell[]
	 */
    public var cells:Array<Array<CellVO>>;

/**
	 * numero du tour courant
	 * @property currentTurn
	 * @type Int
	 * @default 0
	 */
    public var currentTurn:Int = 0;

/**
	 * liste des 3 IA
	 * @property iaList
	 * @type IAInfo[]
	 */
    public var iaList:Array<IAInfo>;

    public function new( ) {
        cells = new Array<Array<CellVO>>();
        iaList = new Array<IAInfo>();
    }
}
