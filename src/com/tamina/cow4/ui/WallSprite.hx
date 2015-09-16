package com.tamina.cow4.ui;
import createjs.easeljs.Point;
import createjs.easeljs.MouseEvent;
import createjs.easeljs.Shape;
import createjs.easeljs.Container;
class WallSprite extends Container{

    private static inline var NORMAL_COLOR:String="#000000";

    private var _color:String;

    private var _backgroundShape:Shape;
    private var _size:Point;
    private var _display:Bool = true;
    public var display(get,set):Bool;

    public function new(size:Point) {
        super();
        _size = size;
        _backgroundShape = new Shape();
        addChild(_backgroundShape);
        drawWall(NORMAL_COLOR);
    }

    private function get_display():Bool{
        return _display;
    }

    private function set_display(value:Bool):Bool{
        _display = value;
        _backgroundShape.visible = _display;
        return _display;
    }


    private function drawWall(color:String=NORMAL_COLOR):Void{
        _backgroundShape.graphics.clear();
        _backgroundShape.graphics.beginFill(color);
        _backgroundShape.graphics.drawRect(0,0,_size.x,_size.y);
        _backgroundShape.graphics.endFill();
    }

}
