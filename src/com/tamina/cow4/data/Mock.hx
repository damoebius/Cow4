package com.tamina.cow4.data;
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
        var previousCell:Cell = null;
        var currentCell:Cell = null;
        for ( rowIndex in 0...this._rowNumber ) {
            result.cells.push(new Array<Cell>());
            if ( _goRight ) {
                currentCell = new Cell();
                currentCell.top = previousCell;
                if(previousCell != null){
                   previousCell.bottom = currentCell;
                }
                result.cells[rowIndex].push(currentCell);
                previousCell = currentCell;
                for ( columnIndex in 1...this._columnNumber ) {
                    currentCell = new Cell();
                    currentCell.left = previousCell;
                    if(previousCell != null){
                        previousCell.right = currentCell;
                    }
                    result.cells[rowIndex].push(currentCell);
                    previousCell = currentCell;
                }
                _goRight = false;
            } else {
                var columnIndex = _columnNumber - 1;
                currentCell = new Cell();
                currentCell.top = previousCell;
                if(previousCell != null){
                    previousCell.bottom = currentCell;
                }
                result.cells[rowIndex][columnIndex] = currentCell;
                previousCell = currentCell;
                columnIndex--;
                while ( columnIndex >= 0 ) {
                    currentCell = new Cell();
                    currentCell.right = previousCell;
                    if(previousCell != null){
                        previousCell.left = currentCell;
                    }
                    result.cells[rowIndex][columnIndex] = currentCell;
                    previousCell = currentCell;
                    columnIndex--;
                }
                _goRight = true;
            }


        }
        return result;
    }

    private static function get_instance( ):Mock {
        if ( _instance == null ) {
            _instance = new Mock();
        }
        return _instance;
    }

}
