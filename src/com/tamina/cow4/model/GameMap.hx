package com.tamina.cow4.model;
import org.tamina.geom.Point;
class GameMap {

    public var cells:Array<Array<Cell>>;

    public function new( ) {
        cells = new Array<Array<Cell>>();
    }

    public function getCellPosition(cell:Cell):Point{
        var result:Point = null;
        for(i in 0...cells.length){
            for(j in 0...cells[i].length){
                if( cells[i][j].id == cell.id){
                    result = new Point(j,i);
                    break;
                }
            }
        }
        return result;
    }

    public function getCellAt(column:Int, row:Int):Cell{
        return cells[row][column];
    }
}
