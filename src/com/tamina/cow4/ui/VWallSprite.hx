package com.tamina.cow4.ui;
import createjs.easeljs.Point;
import createjs.easeljs.Shape;

class VWallSprite extends WallSprite {


    public function new(height:Int) {
        super(new Point(4,height));
        _backgroundShape.x = -2;
    }

}