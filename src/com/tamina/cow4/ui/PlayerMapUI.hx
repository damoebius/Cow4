package com.tamina.cow4.ui;
import js.html.Event;
import org.tamina.events.html.ImageEvent;
import js.html.Image;
import createjs.easeljs.Shape;
import js.html.CanvasElement;
class PlayerMapUI extends MapUI<PlayerCellSprite> {
    private static inline var FPS:Float = 30.0;

    private var _background:Shape;
    private var _backgroundImage:Image;

    public function new( display:CanvasElement ) {
        super( PlayerCellSprite, display, FPS );
        _background = new Shape();
        _backgroundImage = new Image();
        _backgroundImage.addEventListener(ImageEvent.LOAD,backgroundLoadHandler);
        _backgroundImage.src = "images/background.png";
        super.addChildAt(_background,0);
        _cellsContainer.x = 32;
        _cellsContainer.y = 32;

    }

    private function backgroundLoadHandler(evt:Event):Void{
        _background.graphics.beginBitmapFill(_backgroundImage);
        _background.graphics.drawRect(0,0,864,864);
        _background.graphics.endFill();
    }
}
