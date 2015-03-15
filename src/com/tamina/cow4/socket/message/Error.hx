package com.tamina.cow4.socket.message;

/**
* Message d'erreur
* @author d.mouton
* @class Error
* @extends SocketMessage
*/
class Error extends SocketMessage {

/**
	 * le type du message d'erreur
	 * @property MESSAGE_TYPE
	 * @type String
	 * @default error
	 * @static
	 * @readOnly
	 */
    public static inline var MESSAGE_TYPE:String='error';

/**
	 * le code d'erreur
	 * @property code
	 * @type {ErrorCode}
	 */
    public var code:ErrorCode;

/**
	 * le message
	 * @property message
	 * @type String
	 */
    public var message:String;

    public function new(code:ErrorCode,message:String ) {
        super( MESSAGE_TYPE);
        this.code = code;
        this.message = message;
    }
}
