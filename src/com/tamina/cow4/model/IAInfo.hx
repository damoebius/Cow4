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

/**
    * Durée en nombre de tour de l'invisibilité
    * @property invisibilityDuration
    * @type Int
    *
**/
    public var invisibilityDuration:Int=0;

/**
	 * le profil de l'ia
	 * @property profil
	 * @type Profil
	 */
    public var profil:Profil;



    public function new( id:Float,name:String,avatar:String, pm:Int, items:Array<Item>,invisibilityDuration:Int, profil:Profil ) {
        this.id = id;
        this.name= name;
        this.avatar = avatar;
        this.pm = pm;
        this.items = new Array<Item>();
        this.invisibilityDuration = invisibilityDuration;
        this.profil = profil;
        for(i in 0...items.length){
            this.items.push(items[i]);
        }
    }
}
