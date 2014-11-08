import com.tamina.cow4.gen.Cell;
import createjs.easeljs.Point;


class MapGen {

    // Possibles directions
    private static var UP    :Int = 0;
    private static var RIGHT :Int = 1;
    private static var DOWN  :Int = 2;
    private static var LEFT  :Int = 3;

    private var _width  :Int;
    private var _height :Int;
    private var startCell:Cell;

    private var _map :Array<Array<Cell>>;

    function getMap(width:Int, height:Int, startPos:Point):Cell{
        initMapAndStartCell(width, height, startPos);
        generate(startCell);
        return startCell;
    }

    function generate(actualCell:Cell){
        if (actualCell == startCell && !actualCell.visited ) return;
        actualCell.visited = true;

        var nextCell = getNextCell(actualCell);
        actualCell = openWall(actualCell, nextCell);
        generate(actualCell);
    }

    function openWall(actualCell:Cell, nextCell:Cell):Cell{
        actualCell.nexts.push(nextCell);
        nextCell.previous.push(actualCell);
        return nextCell;
    }

    function getPossibleNeigtboardCells(cell:Cell):Array<Cell>{

    }

    function getNextCell(actualCell:Cell):Cell{
        var possibleNeigtboardCells = getPossibleNeigtboardCells(actualCell);
        return possibleNeigtboardCells[Std.random(possibleNeigtboardCells.length - 1)];
    }

    function initMapAndStartCell(width:Int, height:Int, startPos:Point){
        this._width     = width;
        this._height    = height;
        this._map       = [for(x in 0..._width) for(y in 0..._height) _map[x][y] = new Cell(new Point(x, y))];
        this.startCell  = _map[startPos.x][startPos.y];
    }

}

