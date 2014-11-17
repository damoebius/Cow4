package com.tamina.cow4.gen;

import com.tamina.cow4.gen.Cell;
import createjs.easeljs.Point;


class MapGen {

    private static var _instance:MapGen;
    public static var instance(get, null):MapGen;

    private var _width      :Int;
    private var _height     :Int;
    private var _startCell  :Cell;

    private var _map :Array<Array<Cell>>;

    private function new( ) {
    }

    private static function get_instance( ):MapGen {
        if ( _instance == null ) {
            _instance = new MapGen();
        }
        return _instance;
    }

    public function getMap(width:Int, height:Int, startPos:Point):Cell{
        initMapAndStartCell(width, height, startPos);
        generate(_startCell);
        return _startCell;
    }

    private function generate(actualCell:Cell){
        if (actualCell == _startCell && actualCell.visited ) return;
        actualCell.visited = true;

        var nextCell = getNextCell(actualCell);
        actualCell = openWall(actualCell, nextCell);
        generate(actualCell);
    }

    private function openWall(actualCell:Cell, nextCell:Cell):Cell{
        actualCell.nexts.push(nextCell);
        nextCell.previous.push(actualCell);
        return nextCell;
    }

    private function getPossibleNeigtboardCells(cell:Cell):Array<Cell>{
        return Lambda.array(Lambda.filter(cell.nexts, function(cell) { return !cell.visited; }));
    }

    private function getNextCell(actualCell:Cell):Cell{
        var possibleNeigtboardCells = getPossibleNeigtboardCells(actualCell);
        return possibleNeigtboardCells[Std.random(possibleNeigtboardCells.length - 1)];
    }

    private function initMapAndStartCell(width:Int, height:Int, startPos:Point){
        this._width     = width;
        this._height    = height;
        this._map       = [for(x in 0..._width) [ for(y in 0..._height) _map[x][y] = new Cell(new Point(x, y))]];
        this._startCell  = _map[Std.int(startPos.x)][Std.int(startPos.y)];
    }

}

