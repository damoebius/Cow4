package com.tamina.cow4;
import com.tamina.cow4.model.GameConstants;
import com.tamina.cow4.core.ProcessArgument;
import com.tamina.cow4.model.Profil;
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
    private var _process:Process;
    private var _server:String = 'localhost';
    private var _lastSheepIntersection:Cell;
    private var _nextSheepIntersection:Cell;

    public function new() {
        _mode = Mode.GET_A_TRAP;
        _process = NodeJS.process;
        for (i in 2..._process.argv.length) {
            var arg = _process.argv[i];
            switch arg {
                case ProcessArgument.MODE:
                    if ((i + 1) < _process.argv.length) {
                        _mode = _process.argv[i + 1];
                    }
                    break;
                case ProcessArgument.SERVER:
                    if ((i + 1) < _process.argv.length) {
                        _server = _process.argv[i + 1];
                    }
                    break;
                case ProcessArgument.HELP:
                    this.displayHelp();
                    break;
                default:
                    nodejs.Console.warn("Unknown argument : " + arg);
                    this.displayHelp();
                    break;
            }
        }
        _socket = new TCPSocket();
        _socket.connect(Config.SOCKET_PORT, _server, connectionHandler);
        _currentDirection = Direction.RIGHT;
    }

    private function displayHelp():Void {
        nodejs.Console.info("IA de demo pour code of war 4");
        nodejs.Console.info("Version : 1.0.1");
        nodejs.Console.info("Usage :");
        nodejs.Console.info("-? : display this message");
        nodejs.Console.info("-m mode : mode de l'ia : get-potion/get-trap/get-parfum/get-chicken/qualif");
        nodejs.Console.info("-s : server url : default is localhost");
    }

    private function connectionHandler():Void {
        nodejs.Console.log('CONNECTED <br/> Sending Auth message...');
        _proxy = new GameServerProxy(_socket);
        _proxy.messageSignal.add(serverMessageHandler);
        _proxy.closeSignal.add(quit);
        _proxy.sendMessage(new Authenticate('DemoIA ' + Date.now().getTime(), 'http://3.bp.blogspot.com/_XMH6qEyqIPU/S9YSkGiuZyI/AAAAAAAAB4g/8PoYjbZcNfY/s400/sakura2.jpg', 'tokendemo', Profil.HAND_OF_THE_KING));
        Timer.delay(quit, ALIVE_DURATION);
    }

    private function serverMessageHandler(message:GameServerMessage):Void {
        nodejs.Console.info('[TestIA] Data recevied ');
        if (message.type != null) {
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

    private function processQualifTurn(gameData:GameMap):TurnResult {
        var result = new TurnResult();
        var myIa = gameData.getIAById(_id);
        var sheepIa = gameData.iaList[2];
        var currentCell = gameData.getCellByIA(_id);
        var sheepCell = gameData.getCellByIA(sheepIa.id);
        var sheepPath = GameUtils.getPath(currentCell, sheepCell, gameData);
        if (currentCell.getNeighboors().length > 2 && myIa.pm < GameConstants.MAX_PM && sheepPath.length > myIa.pm) {
// on se charge en pm
            if (sheepCell.getNeighboors().length > 2) {
                _lastSheepIntersection = sheepCell;
            } else if (sheepCell.getNeighboorById(_lastSheepIntersection.id) != null) {
                _nextSheepIntersection = getNextIntersection(_lastSheepIntersection, sheepCell);
            }

        } else {
            var targetCell:Cell = null;
            if (sheepPath.length <= myIa.pm || sheepCell.getNeighboors().length > 2) {
                targetCell = sheepCell;
                _lastSheepIntersection = targetCell;
            } else {
                if (sheepCell.getNeighboorById(_lastSheepIntersection.id) != null) {
//find next intersection
                    _nextSheepIntersection = getNextIntersection(_lastSheepIntersection, sheepCell);
                }
                targetCell = _nextSheepIntersection;
            }

            if (targetCell != null) {

                var path = GameUtils.getPath(currentCell, targetCell, gameData);
                if (path != null) {
                    for (i in 0...myIa.pm) {
                        var item = path.getItemAt(i + 1);
                        if (item != null) {
                            trace(currentCell.id + ' -> ' + item.id);
                            var order = new MoveOrder(item);
                            result.actions.push(order);
                        }
                    }
                } else {
                    trace('path null : ' + currentCell.id + "//" + targetCell.id);
                }
            } else {
                trace('NO targetCell !!');
            }
        }
        return result;
    }

    private function getNextIntersection(fromCell:Cell, byCell:Cell):Cell {
        var result:Cell = null;
        if (byCell != null) {
            var neighbors = byCell.getNeighboors();
            if (neighbors.length == 1 || neighbors.length > 2) {
                result = byCell;
            } else {
                var nextCell = neighbors[0];
                if (nextCell.id == fromCell.id) {
                    nextCell = neighbors[1];
                }
                result = getNextIntersection(byCell, nextCell);
            }
        } else {
            trace('byCell NULL');
        }
        return result;
    }

    private function processTurn(data:GetTurnOrder):Void {
        var result = new TurnResult();
        try {
            var gameData = GameMap.fromGameMapVO(data.data);
            trace('turn : ' + gameData.currentTurn);
            var myIa = gameData.getIAById(_id);
            trace('pm : ' + myIa.pm);
            var currentCell = gameData.getCellByIA(_id);
            var targetCell:Cell;
            if (_mode == Mode.QUALIF) {
                result = processQualifTurn(gameData);
            } else {
                if (_mode != Mode.CATCH_THE_CHICKEN) {
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

                    if (currentCell.id == c1.id || currentCell.id == c2.id) {
                        trace('item found');
                        _mode = Mode.CATCH_THE_CHICKEN;
                        var order = new GetItemOrder();
                        result.actions.push(order);
                        targetCell = gameData.getCellByIA(gameData.iaList[2].id);
                    } else {
                        var p1 = GameUtils.getPath(currentCell, c1, gameData);
                        var p2 = GameUtils.getPath(currentCell, c2, gameData);
                        targetCell = c1;
                        if (p1 != null && p2 != null && p1.length > p2.length) {
                            targetCell = c2;
                        }
                    }
                } else {
                    trace('---------------------------> ' + myIa.items.length);
                    if (myIa.items.length > 0) {
                        trace('---------------------------> POTION USED');
                        var useItemOrder = new UseItemOrder(myIa.items[0]);
                        result.actions.push(useItemOrder);
                    }
                    targetCell = gameData.getCellByIA(gameData.iaList[2].id);
                }
                var path = GameUtils.getPath(currentCell, targetCell, gameData);
                if (path != null) {
                    for (i in 0...myIa.pm) {
                        trace(currentCell.id + ' -> ' + path.getItemAt(i + 1).id);
                        var order = new MoveOrder(path.getItemAt(i + 1));
                        result.actions.push(order);
                    }
                } else {
                    trace('path null : ' + currentCell.id + "//" + targetCell.id);
                }
            }
        } catch (e:js.Error) {
            trace('error : ' + e.message);
        }

        var timeout = Math.round(Math.random()) == 0;
        if (false) {
            trace('timeout');
        } else {
            _proxy.sendMessage(result);
        }
    }


    private function quit():Void {
        _socket.destroy();
        NodeJS.process.exit(0);
    }

    public static function main() {
        _app = new IADemoApp();
    }
}
