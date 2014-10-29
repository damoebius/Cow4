package com.tamina.cow4.data;
import org.tamina.log.QuickLogger;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.Cell;
class Mock {

    private static var _instance:Mock;
    public static var instance(get, null):Mock;

    private var _goRight:Bool;
    private var _columnNumber:Int;
    private var _rowNumber:Int;

    private function new( ) {
    }

    public function getTestMap( row:Int, col:Int ):GameMap {
        this._goRight = true;
        this._columnNumber = col;
        this._rowNumber = row;

        var result = new GameMap();
        var oldCell = null;
        QuickLogger.debug("Nombre total de cellules : " + Std.string(this._rowNumber * this._columnNumber));
        for ( rowIndex in 0...this._rowNumber ) {
            result.cells.push(new Array<Cell>());
            if ( _goRight ) {
                for ( columnIndex in 0...this._columnNumber ) {
                    var currentCell = fillCell(oldCell, (rowIndex + 1 ) * columnIndex);
                    result.cells[rowIndex].push(currentCell);
                    oldCell = currentCell;
                }
            } else {
                var columnIndex = _columnNumber;
                while ( columnIndex > 0 ) {
                    var currentCell = fillCell(oldCell, (rowIndex + 1 ) * columnIndex);
                    result.cells[rowIndex][columnIndex] = currentCell;
                    oldCell = currentCell;
                    columnIndex--;
                }
            }


        }
        return result;
    }

    private function fillCell( old:Cell, cellCursor:Int ):Cell {
        var cell = new Cell();
        if ( cellCursor % this._columnNumber == 0 ) {
            cell.top = old;
            if ( old != null ) {
                old.bottom = cell;
            }

            _goRight = (cellCursor / this._columnNumber) % 2 == 0;
        }
        else if ( _goRight ) {
            cell.left = old;
            if ( old != null ) {
                old.right = cell;
            }
        }
        else {
            cell.right = old;
            if ( old != null ) {
                old.left = cell;
            }
        }

        return cell;
    }

    private static function get_instance( ):Mock {
        if ( _instance == null ) {
            _instance = new Mock();
        }
        return _instance;
    }

}
