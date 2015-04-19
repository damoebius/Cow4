package com.tamina.cow4.model;

/**
* Objet du model representant une IA
* @author d.mouton
* @class IAInfo
*/
class IAInfo {

/**
	 * id de l'IA
	 * @property id
	 * @type Float
	 */
    public var id:Float;

/**
	 * nom de l'IA
	 * @property name
	 * @type String
	 */
    public var name:String;

/**
	 * url de son avatar
	 * @property avatar
	 * @type String
	 */
    public var avatar:String;

/**
	 * Points de mouvement
	 * @property pm
	 * @type Int
	 */
    public var pm:Int=1;

    /**
    * Liste des items récupérées
    * @property items
    * @type Array<Item>
    *
**/
    public var items:Array<Item>;



    public function new( id:Float,name:String,avatar:String, pm:Int ) {
        this.id = id;
        this.name= name;
        this.avatar = avatar;
        this.pm = pm;
        this.items = new Array<Item>();
    }
}
