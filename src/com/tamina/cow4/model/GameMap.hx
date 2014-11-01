package com.tamina.cow4.model;
import com.tamina.cow4.model.vo.CellVO;
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

    public static function fromGameMapVO(value:Array<Array<CellVO>>):GameMap{
        var result = new GameMap();
        for(i in 0...value.length){
            result.cells.push( new Array<Cell>());
            for(j in 0...value[i].length){
                result.cells[i].push( Cell.fromCellVO(   value[i][j]) );
            }
        }

        for(i in 0...result.cells.length){
            for(j in 0...result.cells[i].length){
                var cell = result.cells[i][j];
                var cellVO = value[i][j];
                if(cellVO.top != null) {
                    cell.top = result.cells[i-1][j];
                }
                if(cellVO.bottom != null) {
                    cell.bottom = result.cells[i+1][j];
                }
                if(cellVO.left != null) {
                    cell.left = result.cells[i][j-1];
                }
                if(cellVO.right != null) {
                    cell.right = result.cells[i][j+1];
                }
            }
        }

        return result;
    }

    public function toGameMapVO():Array<Array<CellVO>>{
        var result = new Array<Array<CellVO>>();
        // on construit la matrice
        for(i in 0...cells.length){
            result.push( new Array<CellVO>());
            for(j in 0...cells[i].length){
                result[i].push(cells[i][j].toCellVO());
            }
        }
        // on cré les références
        for(i in 0...cells.length){
            for(j in 0...cells[i].length){
                var cell = cells[i][j];
                var cellVO = result[i][j];
                if(cell.top != null) {
                    cellVO.top = result[i-1][j];
                }
                if(cell.bottom != null) {
                    cellVO.bottom = result[i+1][j];
                }
                if(cell.left != null) {
                    cellVO.left = result[i][j-1];
                }
                if(cell.right != null) {
                    cellVO.right = result[i][j+1];
                }
            }
        }
        return result;
    }
}
