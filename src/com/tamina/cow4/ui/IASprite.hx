package com.tamina.cow4.ui;
import createjs.easeljs.Bitmap;
import createjs.easeljs.Container;
class IASprite extends Container {

    private var _backgroundBitmap:Bitmap;

    public function new(bitmapPath:String) {
        super();
        _backgroundBitmap = new Bitmap(bitmapPath);
        addChild(_backgroundBitmap) ;
    }

}
