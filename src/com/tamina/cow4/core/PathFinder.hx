package com.tamina.cow4.core;


import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.Cell;
import com.tamina.cow4.model.Path;
class PathFinder {

    private var _paths:Array<Path>;

    private var _source:Cell;
    private var _target:Cell;
    private var _map:GameMap;
    private var _inc:Int = 0;
    private var _result:Path;

    public function new() {
        _paths = new Array<Path>();
    }

    public function getPath(fromCell:Cell,toCell:Cell, map:GameMap):Path {
        _map = map;
        _source = fromCell;
        _target = toCell;

        var p = new Path();
        p.push(_source);
        _paths.push(p);
        var startDate = Date.now();
        find();
        return _result;
    }

    private function find():Void {
        var result:Bool = false;
        _inc++;
        var paths = _paths.copy();
        for (i in 0...paths.length) {
            if (checkPath(paths[i])) {
                result = true;
                break;
            }
        }
        if (!result && _inc < 500) {
            find();
        }
    }

    private function checkPath(target:Path):Bool {
        var result:Bool = false;
        var currentCell = target.getLastItem();
        for (i in 0...currentCell.getNeighboors().length) {
            var nextCell:Cell = currentCell.getNeighboors()[i];
            if (nextCell.id == _target.id) {
                result = true;
                var p:Path = target.copy();
                p.push(nextCell);
                _result = p;
                break;
            } else if ( !Path.contains(nextCell, _paths) ) {
                var p:Path = target.copy();
                p.push(nextCell);
                _paths.push(p);
            }
        }
        _paths.remove(target);
        return result;
    }

}
