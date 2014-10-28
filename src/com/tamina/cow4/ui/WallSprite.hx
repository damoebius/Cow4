package com.tamina.cow4.ui;
import createjs.easeljs.Point;
import createjs.easeljs.MouseEvent;
import createjs.easeljs.Shape;
import createjs.easeljs.Container;
class WallSprite extends Container{

    private static inline var NORMAL_COLOR:String="#00FF00";
    private static inline var HIDEN_COLOR:String="#FFFFFF";
    private static inline var OVER_COLOR:String="#FF0000";

    private var _color:String;

    private var _backgroundShape:Shape;
    private var _size:Point;

    public function new(size:Point) {
        super();
        _size = size;
        _backgroundShape = new Shape();
        addChild(_backgroundShape);
        drawWall(NORMAL_COLOR);
        _backgroundShape.addEventListener('mouseover', mouseOverHandler);
        _backgroundShape.addEventListener('mouseout', mouseOutHandler);
    }

    public function hide():Void{
        drawWall(HIDEN_COLOR);
    }

    private function drawWall(color:String=NORMAL_COLOR):Void{
        _backgroundShape.graphics.clear();
        _backgroundShape.graphics.beginFill(color);
        _backgroundShape.graphics.drawRect(0,0,_size.x,_size.y);
    }

    private function mouseOverHandler(evt:MouseEvent):Void{
        drawWall(OVER_COLOR);
    }

    private function mouseOutHandler(evt:MouseEvent):Void{
        drawWall(NORMAL_COLOR);
    }
}
