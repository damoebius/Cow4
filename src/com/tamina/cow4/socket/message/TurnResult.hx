package com.tamina.cow4.socket.message;
import com.tamina.cow4.model.IAInfo;
import com.tamina.cow4.model.TurnAction;
/**
* Retour la liste des actions d'un tour
* @author d.mouton
* @class TurnResult
* @extends SocketMessage
*/
class TurnResult extends ClientMessage{

/**
	 * le type du message
	 * @property MESSAGE_TYPE
	 * @type String
	 * @default turnResult
	 * @static
	 * @readOnly
	 */
    public static inline var MESSAGE_TYPE:String='turnResult';

/**
	 * la liste des actions
	 * @property actions
	 * @type {TurnAction[]}
	 */
    public var actions:Array<TurnAction>;

/**
	 * les informations sur l'IA
	 * @property ia
	 * @type IAInfo
	 */
    public var ia:IAInfo;


    public function new( ) {
        super( MESSAGE_TYPE);
        actions = new Array<TurnAction>();
    }
}
