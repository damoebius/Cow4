package com.tamina.cow4.ui;
import createjs.easeljs.Shape;
import createjs.easeljs.Container;
import com.tamina.cow4.model.Cell;

class CellSprite extends Container {

    public var data(get,null):Cell;

    private var _backgroundShape:Shape;
    private var _data:Cell;
    private var _width:Int;
    private var _height:Int;

    public function new( data:Cell, width:Int, height:Int ) {
        super();
        this._data = data;
        _width = width;
        _height = height;
        _backgroundShape = new Shape();
        _backgroundShape.graphics.beginFill("#FFFFFF");
        _backgroundShape.graphics.drawRect(0, 0, _width, _height);
        _backgroundShape.graphics.endFill();
        addChild(_backgroundShape);
        drawWall();
    }

    private function drawWall( ):Void {
        _backgroundShape.graphics.beginStroke('#FF0000');
        if ( _data.top == null ) {
            _backgroundShape.graphics.moveTo(0, 0);
            _backgroundShape.graphics.lineTo(_width, 0);
        }
        if ( _data.bottom == null ) {
            _backgroundShape.graphics.moveTo(0, _height);
            _backgroundShape.graphics.lineTo(_width, _height);
        }
        if ( _data.left == null ) {
            _backgroundShape.graphics.moveTo(0, 0);
            _backgroundShape.graphics.lineTo(0, _height);
        }
        if ( _data.right == null ) {
            _backgroundShape.graphics.moveTo(_width, 0);
            _backgroundShape.graphics.lineTo(_width, _height);
        }
        _backgroundShape.graphics.endStroke();
    }

    private function get_data():Cell{
        return _data;
    }
}
