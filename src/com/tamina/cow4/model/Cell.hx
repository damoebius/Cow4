package com.tamina.cow4.model;
import org.tamina.utils.UID;
class Cell {
    public var id:Float;
    public var top:Cell;
    public var bottom:Cell;
    public var left:Cell;
    public var right:Cell;

    public function new( ) {
        this.id = UID.getUID();
    }
}
