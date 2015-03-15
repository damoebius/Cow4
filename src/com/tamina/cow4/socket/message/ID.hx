package com.tamina.cow4.socket.message;

/**
* Message de confirmation d'Authentification
* @author d.mouton
* @class ID
* @extends SocketMessage
*/
class ID extends GameServerMessage {

/**
	 * le type du message d'authentification
	 * @property MESSAGE_TYPE
	 * @type String
	 * @default id
	 * @static
	 * @readOnly
	 */
    public static inline var MESSAGE_TYPE:String='id';

/**
	 * l'id l'IA
	 * @property id
	 * @type Float
	 */
    public var id:Float;

    public function new( id:Float ) {
        super( MESSAGE_TYPE);
        this.id = id;
    }
}
