package com.tamina.cow4.socket;

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

    private var _targetCell:Cell;

    public function new( ):Void {
        id = UID.getUID();
        items = new Array<Item>();
        turnComplete = new Signal1<TurnResult>();
    }

    public function toInfo( ):IAInfo {
        return new IAInfo(id, name, "", pm, items);
    }

    public function getTurnOrder( data:GameMap ):Void {
        var result = new TurnResult();
        try {
            var currentCell = data.getCellByIA(id);

            if ( _targetCell == null || _targetCell.id == currentCell.id ) {
                _targetCell = data.getCellAt(Math.floor(Math.random() * data.cells.length), Math.floor(Math.random() * data.cells.length));
            }
            var path = GameUtils.getPath(currentCell, _targetCell, data);
            if ( path != null ) {
                var order = new MoveOrder(path.getItemAt(1));
                result.actions.push(order);
            } else {
                trace('path null : ' + currentCell.id + "//" + _targetCell.id);
                _targetCell = null;
            }
        } catch ( e:js.Error ) {
            trace('error : ' + e.message);
        }
        turnComplete.dispatch(result);
    }


}
