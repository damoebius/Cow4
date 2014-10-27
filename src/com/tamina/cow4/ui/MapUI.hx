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
    private static var CELL_WIDTH:Int = 20;
    private static var CELL_HEIGHT:Int = 20;

    private var _width:Int;
    private var _height:Int;
    private var _backgroundShape:Shape;
    private var _cellsContainer:Container;
    private var _data:GameMap;

    public function new(display:CanvasElement, width:Int, height:Int ) {
        super(display);

        _data = Mock.instance.getTestMap(15, 15);

        _width = width;
        _height = height;
        _backgroundShape = new Shape();
        _backgroundShape.graphics.beginFill("#333333");
        _backgroundShape.graphics.drawRect(0, 0, _width, _height);
        _backgroundShape.graphics.endFill();
        addChild(_backgroundShape);

        _cellsContainer = new Container();
        addChild(_cellsContainer);

        Ticker.setFPS(FPS);
        Ticker.addEventListener(CreateJSEvent.TICKER_TICK, tickerHandler);

        drawMap();
    }

    private function drawMap():Void{
        for(cellModel in _data.cells){
            _cellsContainer.addChild(new CellSprite(cellModel, CELL_WIDTH, CELL_HEIGHT));
        }


    }

    private function tickerHandler():Void {
        this.update();
    }
}
