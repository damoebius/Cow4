package com.tamina.cow4.socket;

import com.tamina.cow4.model.GameConstants;
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
class QualifIA implements IIA {

    inline public static var IA_NAME:String = 'QualifIA';

    public var id:Float;
    public var name:String = IA_NAME;
    public var turnComplete:Signal1<TurnResult>;
    public var pm:Int = 1;
    public var items:Array<Item>;
    public var invisibilityDuration:Int = 0;
    public var trappedDuration:Int = 0;
    public var profil:Profil = Profil.HAND_OF_THE_KING;
    public var token:String="";
    

    private var _currentPath:Path;
    private var _data:GameMap;
    private var _lastSheepIntersection:Cell;
    private var _nextSheepIntersection:Cell;

    public function new():Void {
        id = UID.getUID();
        token = Std.string(id);
        items = new Array<Item>();
        turnComplete = new Signal1<TurnResult>();

    }

    public function toInfo():IAInfo {
        return new IAInfo(id, name, "/images/qualif.png", pm, items, invisibilityDuration, profil);
    }

    public function getTurnOrder(data:GameMap):Void {
        var result = new TurnResult();
        _data = data;
        try {
            result = processQualifTurn();
        } catch (e:js.Error) {
            trace('error : ' + e.message);
        }
        turnComplete.dispatch(result);
    }

    private function processQualifTurn():TurnResult {
        var result = new TurnResult();
        var myIa = _data.getIAById(id);
        var sheepIa = _data.iaList[2];
        var currentCell = _data.getCellByIA(id);
        var sheepCell = _data.getCellByIA(sheepIa.id);
        var sheepPath = GameUtils.getPath(currentCell, sheepCell, _data);
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

                var path = GameUtils.getPath(currentCell, targetCell, _data);
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
