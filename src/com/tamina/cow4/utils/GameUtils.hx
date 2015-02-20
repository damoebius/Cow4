package com.tamina.cow4.utils;
import com.tamina.cow4.model.Path;
import com.tamina.cow4.core.PathFinder;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.model.Cell;
class GameUtils {

    private function new( ) {
    }

    public static function getPath(fromCell:Cell,toCell:Cell, map:GameMap):Path{
        var p = new PathFinder();
        return p.getPath(fromCell,toCell,map);
    }
}
