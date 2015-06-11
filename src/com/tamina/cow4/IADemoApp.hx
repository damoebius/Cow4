package com.tamina.cow4;
import com.tamina.cow4.model.ItemPosition;
import com.tamina.cow4.socket.message.order.UseItemOrder;
import com.tamina.cow4.socket.message.order.GetItemOrder;
import org.tamina.geom.Point;
import com.tamina.cow4.ia.Mode;
import com.tamina.cow4.utils.GameUtils;
import com.tamina.cow4.model.Direction;
import com.tamina.cow4.model.Cell;
import com.tamina.cow4.socket.message.order.MoveOrder;
import com.tamina.cow4.model.GameMap;
import nodejs.NodeJS;
import com.tamina.cow4.socket.message.TurnResult;
import com.tamina.cow4.socket.message.GetTurnOrder;
import com.tamina.cow4.socket.message.ID;
import com.tamina.cow4.socket.message.Error;
import com.tamina.cow4.socket.message.GameServerMessage;
import haxe.Timer;
import com.tamina.cow4.socket.message.Authenticate;
import com.tamina.cow4.config.Config;
import nodejs.net.TCPSocket;
import com.tamina.cow4.socket.GameServerProxy;
import nodejs.Process;
class IADemoApp {

    private static inline var ALIVE_DURATION:Int = 10 * 60 * 1000;

    private static var _app:IADemoApp;

    private var _socket:TCPSocket;
    private var _proxy:GameServerProxy;
    private var _id:Float;
    private var _currentDirection:Direction;
    private var _mode:Mode;

    public function new( ) {
        _mode = Mode.GET_A_TRAP;
        _socket = new TCPSocket();
        _socket.connect(Config.SOCKET_PORT, 'localhost', connectionHandler);
        _currentDirection = Direction.RIGHT;
    }

    private function connectionHandler( ):Void {
        nodejs.Console.log('CONNECTED <br/> Sending Auth message...');
        _proxy = new GameServerProxy(_socket);
        _proxy.messageSignal.add(serverMessageHandler);
        _proxy.closeSignal.add(quit);
        _proxy.sendMessage(new Authenticate('DemoIA ' + Date.now().getTime(), 'http://images.groups.adobe.com/1332a08/logo100x100.gif'));
        Timer.delay(quit, ALIVE_DURATION);
    }

    private function serverMessageHandler( message:GameServerMessage ):Void {
        nodejs.Console.info('[TestIA] Data recevied ');
        if ( message.type != null ) {
            switch( message.type){
                case ID.MESSAGE_TYPE:
                    var idMessage:ID = cast message;
                    nodejs.Console.info('[TestIA] identification ' + idMessage);
                    _id = idMessage.id;
                case Error.MESSAGE_TYPE:
                    var errorMessage:Error = cast message;
                    nodejs.Console.info('[TestIA] ERROR ' + errorMessage.message);

                case GetTurnOrder.MESSAGE_TYPE:
                    nodejs.Console.info('demande de tour');
                    var getTurnOrder:GetTurnOrder = cast message;
                    processTurn(getTurnOrder);

                default: nodejs.Console.warn('[TestIA] type de message inconnu ');

            }

        } else {
            nodejs.Console.warn('[TestIA]  MESSAGE inconnu ');
        }
    }

    private function processTurn( data:GetTurnOrder ):Void {
        var result = new TurnResult();
        try {
            var gameData = GameMap.fromGameMapVO(data.data);
            trace('turn : ' + gameData.currentTurn);
            if ( gameData.currentTurn <= 1 ) {
                _mode = Mode.GET_A_TRAP;
            }
            var myIa = gameData.getIAById(_id);
            trace('pm : ' + myIa.pm);
            var currentCell = gameData.getCellByIA(_id);
            var targetCell:Cell;
            if ( _mode != Mode.CATCH_THE_CHICKEN ) {
                trace('mode get an item');
                var c1:Cell = null;
                var c2:Cell = null;
                switch (_mode){
                    case Mode.GET_A_POTION:
                        trace('mode get a potion');
                        c1 = gameData.getCellAt(cast(ItemPosition.POTION_TOP.x), cast( ItemPosition.POTION_TOP.y));
                        c2 = gameData.getCellAt(cast(ItemPosition.POTION_BOTTOM.x), cast( ItemPosition.POTION_BOTTOM.y));
                    case Mode.GET_A_TRAP:
                        trace('mode get a TRAP');
                        c1 = gameData.getCellAt(cast(ItemPosition.TRAP_TOP.x), cast( ItemPosition.TRAP_TOP.y));
                        c2 = gameData.getCellAt(cast(ItemPosition.TRAP_BOTTOM.x), cast( ItemPosition.TRAP_BOTTOM.y));
                    case Mode.GET_A_PARFUM:
                        c1 = gameData.getCellAt(cast(ItemPosition.PARFUM_TOP.x), cast( ItemPosition.PARFUM_TOP.y));
                        c2 = gameData.getCellAt(cast(ItemPosition.PARFUM_BOTTOM.x), cast( ItemPosition.PARFUM_BOTTOM.y));
                    default:
                        trace('unkown mode');
                        c1 = gameData.getCellAt(cast(ItemPosition.POTION_TOP.x), cast( ItemPosition.POTION_TOP.y));
                        c2 = gameData.getCellAt(cast(ItemPosition.POTION_BOTTOM.x), cast( ItemPosition.POTION_BOTTOM.y));
                }

                if ( currentCell.id == c1.id || currentCell.id == c2.id ) {
                    trace('item found');
                    _mode = Mode.CATCH_THE_CHICKEN;
                    var order = new GetItemOrder();
                    result.actions.push(order);
                    targetCell = gameData.getCellByIA(gameData.iaList[2].id);
                } else {
                    var p1 = GameUtils.getPath(currentCell, c1, gameData);
                    var p2 = GameUtils.getPath(currentCell, c2, gameData);
                    targetCell = c1;
                    if ( p1 != null && p2 != null && p1.length > p2.length ) {
                        targetCell = c2;
                    }
                }
            } else {
                trace('---------------------------> ' + myIa.items.length);
                if ( myIa.items.length > 0 ) {
                    trace('---------------------------> POTION USED');
                    var useItemOrder = new UseItemOrder(myIa.items[0]);
                    result.actions.push(useItemOrder);
                }
                targetCell = gameData.getCellByIA(gameData.iaList[2].id);
            }
            var path = GameUtils.getPath(currentCell, targetCell, gameData);
            if ( path != null ) {
                for ( i in 0...myIa.pm ) {
                    trace(currentCell.id + ' -> ' + path.getItemAt(i + 1).id);
                    var order = new MoveOrder(path.getItemAt(i + 1));
                    result.actions.push(order);
                }
            } else {
                trace('path null : ' + currentCell.id + "//" + targetCell.id);
            }
        } catch ( e:js.Error ) {
            trace('error : ' + e.message);
        }

        var timeout = Math.round(Math.random()) == 0;
        if ( false ) {
            trace('timeout');
        } else {
            _proxy.sendMessage(result);
        }
    }


    private function quit( ):Void {
        _socket.destroy();
        NodeJS.process.exit(0);
    }

    public static function main( ) {
        _app = new IADemoApp();
    }
}
