package com.tamina.cow4.ui;
import createjs.easeljs.Ticker;
import org.tamina.events.CreateJSEvent;
import createjs.easeljs.Shape;
import js.html.CanvasElement;
import createjs.easeljs.Stage;
class MapUI extends Stage {
    private static var FPS:Float = 30.0;

    private var _width:Int;
    private var _height:Int;
    private var _backgroundUI:Shape;

    public function new(display:CanvasElement, width:Int, height:Int ) {
        super(display);
        _width = width;
        _height = height;
        _backgroundUI = new Shape();
        _backgroundUI.graphics.beginFill("#333333");
        _backgroundUI.graphics.drawRect(0, 0, _width, _height);
        _backgroundUI.graphics.endFill();
        addChild(_backgroundUI);


        Ticker.setFPS(FPS);
        Ticker.addEventListener(CreateJSEvent.TICKER_TICK, tickerHandler);
    }

    private function tickerHandler():Void {
        this.update();
    }
}
