package com.tamina.cow4.socket.message;
import com.tamina.cow4.model.vo.GameMapVO;
import haxe.Serializer;
import com.tamina.cow4.model.GameMap;

/**
* Demande le resultat du tour de l'IA
* @author d.mouton
* @class GetTurnOrder
* @extends SocketMessage
*/
class GetTurnOrder extends GameServerMessage {

/**
	 * le type du message
	 * @property MESSAGE_TYPE
	 * @type String
	 * @default getTurnOrder
	 * @static
	 * @readOnly
	 */
    public static inline var MESSAGE_TYPE:String='getTurnOrder';

/**
	 * les données de la partie
	 * @property data
	 * @type {GameMap}
	 */
    public var data:GameMapVO;

    public function new( data:GameMapVO ) {
        super(MESSAGE_TYPE);
        this.data = data ;
    }
}
