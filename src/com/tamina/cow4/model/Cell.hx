package com.tamina.cow4.model;
import createjs.easeljs.Point;
import createjs.easeljs.Point;
import com.tamina.cow4.model.vo.CellVO;
import msignal.Signal.Signal0;
import org.tamina.utils.UID;
class Cell {

    public var id           : Float;
    public var position     : Point;
    public var nexts        : Array<Cell>;
    public var visited      : Bool;
    public var drawed       : Bool;
    public var changeSignal :Signal0;


    public function new(position:Point) {
        this.id             = UID.getUID();
        this.visited        = false;
        this.drawed         = false;
        this.nexts          = new Array<Cell>();
        this.position       = position;
        this.changeSignal   = new Signal0();
    }

    public function toCellVO():CellVO{
        return new CellVO(id);
    }

    public static function fromCellVO(value:CellVO):Cell{
        return new Cell(new Point(0,0));
    }
}
