package com.tamina.cow4.ui;
import createjs.easeljs.Shape;
import createjs.easeljs.Container;
class ChickenIASprite extends Container {

    private var _chickenSprite:Shape;

    public function new( ) {
        super();
        _chickenSprite = new Shape();
        _chickenSprite.graphics.beginFill('#FF0000');
        _chickenSprite.graphics.drawRect(0,0,15,15);
        _chickenSprite.graphics.endFill();
        addChild(_chickenSprite);
        _chickenSprite.x = 8;
        _chickenSprite.y = 8;
    }

}
