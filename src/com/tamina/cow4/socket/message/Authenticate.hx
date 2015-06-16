package com.tamina.cow4.socket.message;

/**
* Message d'authentification d'une IA
* @author d.mouton
* @class Authenticate
* @extends SocketMessage
*/
import com.tamina.cow4.model.Profil;
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

/**
	 * le profil de l'ia
	 * @property profil
	 * @type Profil
	 */
    public var profil:Profil;


/**
	 * le token pour controler l'identité de l'IA. www.codeofwar.net pour obtenir un token.
	 * @property token
	 * @type String
	 */
    public var token:String;

    public function new(name:String, avatar:String='', token:String='', profil:Profil=Profil.TECH_WIZARD ) {
        super( MESSAGE_TYPE);
        this.name = name;
        this.avatar = avatar;
        this.token = token;
        this.profil = profil;
    }
}
