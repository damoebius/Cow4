package com.tamina.cow4.data;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.Cell;
class Mock {

    private static var _instance:Mock;
    public static var instance(get,null):Mock;

    private function new( ) {
    }

    public function getTestMap():GameMap{
        var result = new GameMap();
        var cell1 = new Cell();
        var cell2 = new Cell();
        var cell3 = new Cell();

        cell1.right = cell2;
        cell2.left = cell1;
        cell2.right = cell3;
        cell3.left = cell1;

        result.cells.push(cell1);
        result.cells.push(cell2);
        result.cells.push(cell3);
        return result;
    }

    private static function get_instance():Mock{
        if(_instance == null){
            _instance = new Mock();
        }
        return _instance;
    }

}
