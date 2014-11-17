package com.tamina.cow4.data;

import com.tamina.cow4.gen.Cell;
import createjs.easeljs.Point;
import com.tamina.cow4.gen.MapGen;

class Mock {

    private static var _instance:Mock;
    public static var instance(get, null):Mock;

    private var _goRight:Bool;
    private var _columnNumber:Int;
    private var _rowNumber:Int;

    private function new( ) {
    }

    public function getTestMap( row:Int, col:Int ):Cell {
        return MapGen.instance.getMap(col, row, new Point(0, 0));
    }

    private static function get_instance( ):Mock {
        if ( _instance == null ) {
            _instance = new Mock();
        }
        return _instance;
    }

}
