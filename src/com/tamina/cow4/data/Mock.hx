package com.tamina.cow4.data;
import org.tamina.log.QuickLogger;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.Cell;
class Mock {

    private static var _instance:Mock;
    public static var instance(get,null):Mock;

    private var goRight:Bool;
    private var column:Int;
    private var row:Int;

    private function new( ) {
    }

    public function getTestMap(row:Int, col:Int):GameMap{
        this.goRight = true;
        this.column = col;
        this.row = row;

        var result = new GameMap();
        var oldCell = null;
        QuickLogger.debug("Nombre total de cellules : " + Std.string(this.row * this.column));
        for ( cellCursor in 0...(this.row * this.column)){
            oldCell = retrieveCellAndSave(result, oldCell, cellCursor);
        }
        return result;
    }

    private function retrieveCellAndSave(result:GameMap, oldCell:Cell, cellCursor:Int):Cell{
        var currentCell = fillCell(oldCell, cellCursor);
        result.cells.push(currentCell);
        return currentCell;
    }

    private function fillCell(old:Cell, cellCursor:Int):Cell{
        var cell = new Cell();
        if ( cellCursor % this.column == 0 ){
            cell.top = old;
            if(old != null){
                old.bottom = cell;
            }

            goRight = (cellCursor / this.column) % 2 == 0;
        }
        else if (goRight){
            cell.left = old;
            if(old != null){
                old.right = cell;
            }
        }
        else  {
            cell.right = old;
            if(old != null){
                old.left = cell;
            }
        }

        return cell;
    }

    private static function get_instance():Mock{
        if(_instance == null){
            _instance = new Mock();
        }
        return _instance;
    }

}
