package com.tamina.cow4.ui;
import createjs.easeljs.Container;
import com.tamina.cow4.model.Cell;

class CellSprite extends Container {

    private var _data:Cell;

    public function new( data:Cell ) {
        super();
        this._data = data;
    }
}
