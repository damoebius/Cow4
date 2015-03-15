package com.tamina.cow4.socket.message;


/**
* Code d'erreur
* @author d.mouton
* @class ErrorCode
* @enum
*/
@:enum abstract ErrorCode(Int) from Int to Int {

/**
	 * déja authentifié
	 * @property ALREADY_AUTH
	 * @type Int
	 * @default 1
	 * @static
	 * @readOnly
	 */
    var ALREADY_AUTH = 1;

/**
	 * Message inconnu
	 * @property UNKNOWN_MESSAGE
	 * @type Int
	 * @default 2
	 * @static
	 * @readOnly
	 */
    var UNKNOWN_MESSAGE = 2;
}
