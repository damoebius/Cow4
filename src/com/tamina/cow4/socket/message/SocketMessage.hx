package com.tamina.cow4.socket.message;
import haxe.Json;

/**
* Classe de base des messages entre IA et Serveur
* @author d.mouton
* @class SocketMessage
*/
class SocketMessage {

/**
	 * la chaine à utiliser pour marquer la fin d'un message
	 * @property END_CHAR
	 * @type String
	 * @default #end#
	 * @static
	 * @readOnly
	 */
    inline public static var END_CHAR:String='#end#';

/**
	 * le type du message définit par la classe mere
	 * @property type
	 * @type String
	 */
    public var type:String='';

    public function new( type:String ) {
        this.type = type;
    }

    public function serialize():String{
        return Json.stringify(this)+END_CHAR;
    }
}
