package com.tamina.cow4.ui;
import haxe.Timer;
import com.tamina.cow4.model.Cell;
import org.tamina.geom.Point;
import createjs.easeljs.Container;
import js.html.CanvasElement;
import com.tamina.cow4.model.GameMap;
import createjs.easeljs.Stage;

@:generic class MapUI<T:CellSprite> extends Stage {

    private var _data:GameMap;

    private var _cellsSprite:Array<T>;
    private var _cellsContainer:Container;
    private var _fps:Float=30.0;
    private var CellSpriteClass:Class<T>;


    public var data(get, set):GameMap;

    public function new(cellSpriteClass:Class<T>, display:CanvasElement, fps:Float ) {
        super(display);
        CellSpriteClass = cellSpriteClass;
        _fps = fps;
        _cellsContainer = new Container();
        addChild(_cellsContainer);

        var t = new Timer( Math.round(1000/30));
        t.run = tickerHandler;
    }

    private function get_data( ):GameMap {
        return _data;
    }

    private function set_data( value:GameMap ):GameMap {
        _data = value;
        _cellsSprite = new Array<T>();
        _cellsContainer.removeAllChildren();
        drawCell(_data.cells[0][0], new Point(0, 0));
        return _data;
    }

    private function drawCell( data:Cell, position:Point ):Void {
        var sprite:T = Type.createInstance(CellSpriteClass,[data]);
        sprite.x = position.x;
        sprite.y = position.y;
        _cellsContainer.addChild(sprite);
        _cellsSprite.push(sprite);

        if ( data.top != null && !cellDrawn(data.top) ) {
            drawCell(data.top, new Point(position.x, position.y - sprite.height));
        }

        if ( data.bottom != null && !cellDrawn(data.bottom) ) {
            drawCell(data.bottom, new Point(position.x, position.y + sprite.height));
        }

        if ( data.left != null && !cellDrawn(data.left) ) {
            drawCell(data.left, new Point(position.x - sprite.width, position.y));
        }

        if ( data.right != null && !cellDrawn(data.right) ) {
            drawCell(data.right, new Point(position.x + sprite.width, position.y));
        }
    }

    private function cellDrawn( target:Cell ):Bool {
        var result:Bool = false;
        for ( i in 0..._cellsSprite.length ) {
            if ( _cellsSprite[i].data.id == target.id ) {
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
