package com.tamina.cow4.ui;
import com.tamina.cow4.model.GameMap;
import createjs.easeljs.Container;
import com.tamina.cow4.data.Mock;
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
    private var _cellsContainer:Container;
    private var _data:GameMap;

    public function new(display:CanvasElement, width:Int, height:Int ) {
        super(display);

        _data = Mock.instance.getTestMap();

        _width = width;
        _height = height;
        _backgroundUI = new Shape();
        _backgroundUI.graphics.beginFill("#333333");
        _backgroundUI.graphics.drawRect(0, 0, _width, _height);
        _backgroundUI.graphics.endFill();
        addChild(_backgroundUI);

        _cellsContainer = new Container();
        addChild(_cellsContainer);

        Ticker.setFPS(FPS);
        Ticker.addEventListener(CreateJSEvent.TICKER_TICK, tickerHandler);

        drawMap();
    }

    private function drawMap():Void{
        var cell = new CellSprite(_data.cells[0]);
        _cellsContainer.addChild(cell);
    }

    private function tickerHandler():Void {
        this.update();
    }
}
