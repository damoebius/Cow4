package com.tamina.cow4.socket;

import com.tamina.cow4.utils.GameUtils;
import com.tamina.cow4.model.Profil;
import com.tamina.cow4.model.Path;
import com.tamina.cow4.model.ItemType;
import com.tamina.cow4.model.Item;
import com.tamina.cow4.socket.message.order.MoveOrder;
import com.tamina.cow4.utils.GameUtils;
import com.tamina.cow4.model.Cell;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.IAInfo;
import com.tamina.cow4.config.Config;
import org.tamina.utils.UID;
import com.tamina.cow4.socket.message.TurnResult;
import msignal.Signal;
class SheepIA implements IIA {

    inline public static var IA_NAME:String = 'SheepIA';

    public var id:Float;
    public var name:String = IA_NAME;
    public var turnComplete:Signal1<TurnResult>;
    public var pm:Int = 1;
    public var items:Array<Item>;
    public var invisibilityDuration:Int = 0;
    public var trappedDuration:Int = 0;
    public var profil:Profil = Profil.SHEEP;

    private var _currentPath:Path;
    private var _isFirstTurn:Bool = true;
    private var _data:GameMap;

    public function new():Void {
        id = UID.getUID();
        items = new Array<Item>();
        turnComplete = new Signal1<TurnResult>();
        _isFirstTurn = !Config.MODE_DEBUG;

    }

    public function toInfo():IAInfo {
        return new IAInfo(id, name, "", pm, items, invisibilityDuration, profil);
    }

    public function getTurnOrder(data:GameMap):Void {
        var result = new TurnResult();
        _data = data;
        try {
            var currentCell = data.getCellByIA(id);
            var myIa = data.getIAById(id);
            if (_isFirstTurn) {
                initFirstTurn();
            }

            if (_currentPath == null || _currentPath.getLastItem().id == currentCell.id) {
                _currentPath = getNewDestination();
            }
            if (_currentPath != null) {
                for (i in 0...myIa.pm) {
                    var currentIndex = _currentPath.getItemIndex(currentCell);
                    var cell = _currentPath.getItemAt(currentIndex + i + 1);
                    if (cell.occupant == null) {
                        var pos = _data.getCellPosition(cell);
                        trace('Sheep goto : ' + pos.x + '//' + pos.y);
                        var order = new MoveOrder(cell);
                        result.actions.push(order);
                    } else {
                        trace('case déja occupée');
                    }
                }
            } else {
                trace('Sheep : targetCell NULL');
            }

        } catch (e:js.Error) {
            trace('error : ' + e.message);
        }
        turnComplete.dispatch(result);
    }

    private function initFirstTurn():Void {
        var currentCell = _data.getCellByIA(id);
        _currentPath = GameUtils.getPath(currentCell,_data.getCellAt(0, 12),_data) ;
        _isFirstTurn = false;
    }

    private function getNextIntersection(fromCell:Cell, byCell:Cell, path:Path):Void {
        path.push(fromCell);
        if (byCell != null) {
            var neighbors = byCell.getNeighboors();
            if (neighbors.length == 1 || neighbors.length > 2) {
                path.push( byCell );
            } else {
                var nextCell = neighbors[0];
                if (nextCell.id == fromCell.id) {
                    nextCell = neighbors[1];
                }
                getNextIntersection(byCell, nextCell,path);
            }
        } else {
            trace('byCell NULL');
        }
    }

    private function hasNextIntersection(fromCell:Cell, byCell:Cell):Bool {
        var result:Bool = false;
        if (byCell != null) {
            var neighbors = byCell.getNeighboors();
            if (neighbors.length > 2) {
                result = true;
            } else if (neighbors.length == 1) {
                result = false;
            } else {
                var nextCell = neighbors[0];
                if (nextCell.id == fromCell.id) {
                    nextCell = neighbors[1];
                }
                result = hasNextIntersection(byCell, nextCell);
            }
        } else {
            trace('byCell NULL');
        }
        return result;
    }

    private function getNewDestination():Path {
        var result = new Path();
        var currentCell = _data.getCellByIA(id);

        var ia1Cell = _data.getCellByIA(_data.iaList[0].id);
        var ia1Path:Path = null;
        if (ia1Cell != null) {
            ia1Path = GameUtils.getPath(currentCell, ia1Cell, _data);
        } else {
            trace('---------------------------------> IA 1 invisible');
        }
        var ia2Cell = _data.getCellByIA(_data.iaList[1].id);
        var ia2Path:Path = null;
        if (ia2Cell != null) {
            ia2Path = GameUtils.getPath(currentCell, ia2Cell, _data);
        } else {
            trace('--------------------------------------> IA 2 invisible');
        }


        var neighbors = currentCell.getNeighboors();
        var selectedNeighbor:Cell = null;
        var neighborIndex:Int = 0;
        trace('SHEEP : recherche de sorties : ' + neighbors.length);
        while (neighborIndex < neighbors.length) {
            selectedNeighbor = neighbors[neighborIndex];
            if (
            (ia1Path == null || (ia1Path != null && neighbors[neighborIndex].id != ia1Path.getItemAt(1).id) )
            && (ia2Path == null || (ia2Path != null && neighbors[neighborIndex].id != ia2Path.getItemAt(1).id ))
            && hasNextIntersection(currentCell, selectedNeighbor)
            ) {
                trace('sortie trouvée : ' + selectedNeighbor.id);
                break;
            } else {
//selectedNeighbor = null;
                neighborIndex++;
            }
        }


        getNextIntersection(currentCell, selectedNeighbor, result);
        return result;
    }

    public function getItemByType(type:ItemType):Item {
        var result:Item = null;
        for (i in 0...items.length) {
            if (items[i].type == type) {
                result = items[i];
            }
        }
        return result;
    }


}
