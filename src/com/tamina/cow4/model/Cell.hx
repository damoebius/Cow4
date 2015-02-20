package com.tamina.cow4.model;
import com.tamina.cow4.model.vo.CellVO;
import msignal.Signal.Signal0;
import org.tamina.utils.UID;
class Cell {

    public var changeSignal:Signal0;

    public var id:Float;

    public var top(get, set):Cell;
    public var bottom(get, set):Cell;
    public var left(get, set):Cell;
    public var right(get, set):Cell;

    public var occupant:IAInfo;

    private var _top:Cell;
    private var _bottom:Cell;
    private var _left:Cell;
    private var _right:Cell;

    public function new() {
        this.id = UID.getUID();
        changeSignal = new Signal0();
    }

    public function toCellVO():CellVO {
        var result = new CellVO(id, occupant);
        if (null != result.top) result.top = this.top.id;
        if (null != result.bottom) result.bottom = this.bottom.id;
        if (null != result.left) result.left = this.left.id;
        if (null != result.right) result.right = this.right.id;
        return result;
    }

    public function getNeighboors():Array<Cell> {
        var result = new Array<Cell>();
        if (top != null) {
            result.push(top);
        }
        if (bottom != null) {
            result.push(bottom);
        }
        if (left != null) {
            result.push(left);
        }
        if (right != null) {
            result.push(right);
        }
        return result;
    }

    public function getNeighboorById(cellId:Float):Cell {
        var result:Cell = null;
        if (top != null && top.id == cellId) {
            result = top;
        } else if (bottom != null && bottom.id == cellId) {
            result = bottom;
        } else if (left != null && left.id == cellId) {
            result = left;
        } else if (right != null && right.id == cellId) {
            result = right;
        }
        return result;
    }

    public static function fromCellVO(value:CellVO):Cell {
        var result = new Cell();
        result.id = value.id;
        result.occupant = value.occupant;
        return result;
    }

    private function get_top():Cell {
        return _top;
    }

    private function set_top(value:Cell):Cell {
        if (value != _top) {
            _top = value;
            changeSignal.dispatch();
        }
        return _top;
    }

    private function get_bottom():Cell {
        return _bottom;
    }

    private function set_bottom(value:Cell):Cell {
        if (value != _bottom) {
            _bottom = value;
            changeSignal.dispatch();
        }
        return _bottom;
    }

    private function get_left():Cell {
        return _left;
    }

    private function set_left(value:Cell):Cell {
        if (value != _left) {
            _left = value;
            changeSignal.dispatch();
        }
        return _left;
    }

    private function get_right():Cell {
        return _right;
    }

    private function set_right(value:Cell):Cell {
        if (value != _right) {
            _right = value;
            changeSignal.dispatch();
        }
        return _right;
    }
}
