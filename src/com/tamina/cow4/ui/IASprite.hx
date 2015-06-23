package com.tamina.cow4.ui;
import createjs.easeljs.Bitmap;
import createjs.easeljs.Container;
class IASprite extends Container {

    private var _backgroundBitmap:Bitmap;
    private var _bitmapPath:String;

    public function new(bitmapPath:String) {
        super();
        _bitmapPath = bitmapPath;
        setBitmapPath(bitmapPath);
    }

    public function setBitmapPath(bitmapPath:String):Void {
        if (this.contains(_backgroundBitmap)) {
            this.removeChild(_backgroundBitmap);
        }
        _backgroundBitmap = new Bitmap(bitmapPath);
        addChild(_backgroundBitmap) ;
    }

}
