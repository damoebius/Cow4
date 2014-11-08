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

    function getMap(width:Int, height:Int, startPos:Point){
        initMapAndStartCell(width, height, startPos);
        generate(startCell);
    }

    function generate(actualCell:Cell){
        if (actualCell == startCell && !actualCell.visited ) return;
        actualCell.visited = true;
        // Puis on regarde quelles sont les cellules voisines possibles et non visitées
        var possibleNeigtboardCells = getPossibleNeigtboardCells(actualCell);
        var nextCell = possibleNeigtboardCells[Std.random(possibleNeigtboardCells.length - 1)];

        actualCell.nexts.push(nextCell);
        nextCell.previous.push(actualCell);
        actualCell = nextCell;

        generate(actualCell);
    }

    function getPossibleNeigtboardCells(x:Int, y:Int):Array<Cell>{

    }

    function initMapAndStartCell(width:Int, height:Int, startPos:Point){
        this._width     = width;
        this._height    = height;
        this._map       = [for(x in 0..._width) for(y in 0..._height) _map[x][y] = new Cell(new Point(x, y))];
        this.startCell  = _map[startPos.x][startPos.y];
    }

}

