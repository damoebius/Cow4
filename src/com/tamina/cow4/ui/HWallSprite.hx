package com.tamina.cow4.ui;
import createjs.easeljs.Point;
import createjs.easeljs.Shape;

class HWallSprite extends WallSprite {


    public function new(width:Int) {
        super(new Point(width,4));
        _backgroundShape.y = -2;
    }

}
