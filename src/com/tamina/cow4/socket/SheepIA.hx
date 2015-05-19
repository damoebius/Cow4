package com.tamina.cow4.socket;

import com.tamina.cow4.model.ItemType;
import com.tamina.cow4.model.Item;
import com.tamina.cow4.socket.message.order.MoveOrder;
import com.tamina.cow4.utils.GameUtils;
import com.tamina.cow4.model.Cell;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.IAInfo;
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
    public var invisibilityDuration:Int=0;

    private var _targetCell:Cell;
    private var _isFirstTurn:Bool = true;
    private var _data:GameMap;

    public function new( ):Void {
        id = UID.getUID();
        items = new Array<Item>();
        turnComplete = new Signal1<TurnResult>();
        _isFirstTurn = true;

    }

    public function toInfo( ):IAInfo {
        return new IAInfo(id, name, "", pm, items, invisibilityDuration);
    }

    public function getTurnOrder( data:GameMap ):Void {
        var result = new TurnResult();
        _data = data;
        try {
            var currentCell = data.getCellByIA(id);

            if ( _isFirstTurn ) {
                initFirstTurn();
            } else {

                if ( _targetCell == null || _targetCell.id == currentCell.id ) {
                    _targetCell = getNewDestination();
                }
                var path = GameUtils.getPath(currentCell, _targetCell, data);
                if ( path != null ) {
                    var order = new MoveOrder(path.getItemAt(1));
                    result.actions.push(order);
                } else {
                    trace('path null : ' + currentCell.id + "//" + _targetCell.id);
                    _targetCell = null;
                }
            }


        } catch ( e:js.Error ) {
            trace('error : ' + e.message);
        }
        turnComplete.dispatch(result);
    }

    private function initFirstTurn( ):Void {
        _targetCell = _data.getCellAt(0, 12);
        _isFirstTurn = false;
    }

    private function getNextIntersection( fromCell:Cell, byCell:Cell ):Cell {
        var result:Cell = null;
        var neighbors = byCell.getNeighboors();
        if(neighbors.length == 1 || neighbors.length > 2){
            result = byCell;
        } else {
            var nextCell = neighbors[0];
            if(nextCell.id == fromCell.id){
                nextCell = neighbors[1];
            }
            result = getNextIntersection(byCell,nextCell);
        }
        return result;
    }

    private function getNewDestination( ):Cell {
        var currentCell = _data.getCellByIA(id);

        var ia1Cell = _data.getCellByIA(_data.iaList[0].id);
        var ia2Cell = _data.getCellByIA(_data.iaList[1].id);
        var ia1Path = GameUtils.getPath(currentCell, ia1Cell, _data);
        var ia2Path = GameUtils.getPath(currentCell, ia2Cell, _data);

        var neighbors = currentCell.getNeighboors();
        var selectedNeighbor:Cell = null;
        var neighborIndex:Int = 0;
        while ( neighborIndex < neighbors.length ) {
            selectedNeighbor = neighbors[neighborIndex];
            if ( neighbors[neighborIndex].id != ia1Path.getItemAt(1).id && neighbors[neighborIndex].id != ia2Path.getItemAt(1).id ) {
                break;
            } else {
                selectedNeighbor = null;
                neighborIndex++;
            }
        }


        return getNextIntersection(currentCell, selectedNeighbor);
    }

    public function getItemByType(type:ItemType):Item{
        var result:Item = null;
        for(i in 0...items.length){
            if(items[i].type == type){
                result = items[i];
            }
        }
        return result;
    }


}
