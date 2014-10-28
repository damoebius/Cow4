package com.tamina.cow4.ui;
import org.tamina.geom.Point;
import com.tamina.cow4.model.Cell;
import com.tamina.cow4.model.GameMap;
import createjs.easeljs.Container;
import com.tamina.cow4.data.Mock;
import createjs.easeljs.Ticker;
import org.tamina.events.CreateJSEvent;
import createjs.easeljs.Shape;
import js.html.CanvasElement;
import createjs.easeljs.Stage;
class MapUI extends Stage {
    private static inline var FPS:Float = 30.0;
    private static inline var CELL_WIDTH:Int = 20;
    private static inline var CELL_HEIGHT:Int = 20;

    private var _width:Int;
    private var _height:Int;
    private var _backgroundShape:Shape;
    private var _cellsContainer:Container;
    private var _data:GameMap;
    private var _cellsSprite:Array<CellSprite>;

    public function new( display:CanvasElement, width:Int, height:Int ) {
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
        _cellsSprite = new Array<CellSprite>();
        drawCell(_data.cells[0], new Point(CELL_WIDTH, CELL_HEIGHT));
    }

    private function drawCell( data:Cell, position:Point ):Void {
        var sprite = new CellSprite(data, CELL_WIDTH, CELL_HEIGHT);
        sprite.x = position.x;
        sprite.y = position.y;
        _cellsContainer.addChild(sprite);
        _cellsSprite.push(sprite);

        if ( data.top != null && !cellDrawn(data.top)) {
            drawCell(data.top, new Point(position.x, position.y - CELL_HEIGHT));
        }

        if ( data.bottom != null && !cellDrawn(data.bottom)) {
            drawCell(data.bottom, new Point(position.x, position.y + CELL_HEIGHT));
        }

        if ( data.left != null && !cellDrawn(data.left)) {
            drawCell(data.left, new Point(position.x - CELL_WIDTH, position.y));
        }

        if ( data.right != null && !cellDrawn(data.right)) {
            drawCell(data.right, new Point(position.x + CELL_WIDTH, position.y));
        }
    }

    private function cellDrawn( target:Cell):Bool {
        var result:Bool = false;
        for(i in 0..._cellsSprite.length){
            if( _cellsSprite[i].data.id == target.id){
                result = true;
                break;
            }
        }
        return result;
    }

    private function tickerHandler( ):Void {
        this.update();
    }
}
