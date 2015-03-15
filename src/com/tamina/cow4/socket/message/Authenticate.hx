package com.tamina.cow4.socket.message;

/**
* Message d'authentification d'une IA
* @author d.mouton
* @class Authenticate
* @extends SocketMessage
*/
class Authenticate extends ClientMessage{

/**
	 * le type du message d'authentification
	 * @property MESSAGE_TYPE
	 * @type String
	 * @default authenticate
	 * @static
	 * @readOnly
	 */
    public static inline var MESSAGE_TYPE:String='authenticate';

/**
	 * le nom de l'IA
	 * @property name
	 * @type String
	 */
    public var name:String;

/**
	 * l'url vers l'avatar de l'IA
	 * @property name
	 * @type String
	 */
    public var avatar:String;

    public function new(name:String, avatar:String='' ) {
        super( MESSAGE_TYPE);
        this.name = name;
        this.avatar = avatar;
    }
}
