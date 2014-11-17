package com.tamina.cow4.gen;

import org.tamina.log.QuickLogger;
import com.tamina.cow4.model.Cell;
import com.tamina.cow4.model.GameMap;
import createjs.easeljs.Point;


class MapGen {

    private static var _instance:MapGen;
    public static var instance(get, null):MapGen;

    private var _width      :Int;
    private var _height     :Int;
    private var _startCell  :Cell;

    private var _map :Array<Array<Cell>>;

    private function new() {}

    private static function get_instance( ):MapGen {
        if ( _instance == null ) {
            _instance = new MapGen();
        }
        return _instance;
    }

    public function getMap(width:Int, height:Int, startPos:Point):GameMap{
        initMapAndStartCell(width, height, startPos);
        generate(_startCell);
        var map:GameMap  = new GameMap();
        map.cells = _map;
        return map;
    }

    private function generate(actualCell:Cell){
        if (actualCell == null || (actualCell == _startCell && actualCell.visited )) return;
        actualCell.visited = true;

        var nextCell = getNextCell(actualCell);
        actualCell = openWall(actualCell, nextCell);
        generate(actualCell);
    }

    private function openWall(actualCell:Cell, nextCell:Cell):Cell{
        actualCell.nexts.push(nextCell);
        if(nextCell != null ) {
            nextCell.previous = actualCell;
        }
        return nextCell;
    }

    private function getPossibleNeigtboardCells(cell:Cell):Array<Cell>{
        var nexts = [];

        for (yIndex in getStartCoordinate(cell.position.y)...getEndCoordinate(cell.position.y, _map.length)) {
            for (xIndex in getStartCoordinate(cell.position.x)...getEndCoordinate(cell.position.x, _map[yIndex].length)) {
                if(!isCellUnderTest(cell.position.x, cell.position.y, xIndex, yIndex) && !_map[yIndex][xIndex].visited) {
                    nexts.push(_map[yIndex][xIndex]);
                }
            }
        }
        QuickLogger.debug("next" + nexts.length);
        return nexts;
    }

    private function getStartCoordinate(coordinate:Float):Int{
        var coo = Std.int(coordinate);
        return coo == 0 ? coo : coo - 1;
    }

    private function getEndCoordinate(coordinate:Float, arrayLenght:Int):Int{
        var coo = Std.int(coordinate);
        return coo >= arrayLenght - 1 ? arrayLenght : coo + 2;
    }
    private function isCellUnderTest(x:Float, y:Float, currentX:Int, currentY:Int):Bool{
        var cooX = Std.int(x);
        var cooY = Std.int(y);
        return currentX == cooX && currentY == cooY;
    }

    private function getNextCell(actualCell:Cell):Cell{
        var possibleNeigtboardCells= getPossibleNeigtboardCells(actualCell);
        return possibleNeigtboardCells[Std.random(possibleNeigtboardCells.length - 1)];
    }

    private function initMapAndStartCell(width:Int, height:Int, startPos:Point){
        this._width     = width;
        this._height    = height;

        this._map = [];
        for (x in 0..._width)
        {
            this._map[x] = [];
            for (y in 0..._height)
            {
                this._map[x][y] = new Cell(new Point(x, y));
            }
        }
        this._startCell  = _map[Std.int(startPos.x)][Std.int(startPos.y)];
    }

}

