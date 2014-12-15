package com.tamina.cow4.model;
import com.tamina.cow4.model.vo.GameMapVO;
import com.tamina.cow4.model.vo.CellVO;
import org.tamina.geom.Point;
class GameMap {

    public var id:Float;
    public var cells:Array<Array<Cell>>;
    public var currentTurn:Int=0;
    public var iaList:Array<IAInfo>;


    public function new( ) {
        cells = new Array<Array<Cell>>();
        iaList = new Array<IAInfo>();
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

    public static function fromGameMapVO(value:GameMapVO):GameMap{
        var result = new GameMap();
        result.id = value.id;
        result.iaList = value.iaList;
        result.currentTurn = value.currentTurn;
        for(i in 0...value.cells.length){
            result.cells.push( new Array<Cell>());
            for(j in 0...value.cells[i].length){
                result.cells[i].push( Cell.fromCellVO(   value.cells[i][j]) );
            }
        }

        for(i in 0...result.cells.length){
            for(j in 0...result.cells[i].length){
                var cell = result.cells[i][j];
                var cellVO = value.cells[i][j];
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

    public function toGameMapVO():GameMapVO{
        var result = new GameMapVO();
        result.id = this.id;
        result.iaList = this.iaList;
        result.currentTurn = this.currentTurn;
        // on construit la matrice
        for(i in 0...cells.length){
            result.cells.push( new Array<CellVO>());
            for(j in 0...cells[i].length){
                result.cells[i].push(cells[i][j].toCellVO());
            }
        }
        // on cré les références
        for(i in 0...cells.length){
            for(j in 0...cells[i].length){
                var cell = cells[i][j];
                var cellVO = result.cells[i][j];
                if(cell.top != null) {
                    cellVO.top = result.cells[i-1][j].id;
                }
                if(cell.bottom != null) {
                    cellVO.bottom = result.cells[i+1][j].id;
                }
                if(cell.left != null) {
                    cellVO.left = result.cells[i][j-1].id;
                }
                if(cell.right != null) {
                    cellVO.right = result.cells[i][j+1].id;
                }
            }
        }
        return result;
    }
}
