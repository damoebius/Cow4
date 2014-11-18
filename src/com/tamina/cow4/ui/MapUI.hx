package com.tamina.cow4.ui;
import org.tamina.log.QuickLogger;
import org.tamina.log.QuickLogger;
import Lambda;
import haxe.Timer;
import com.tamina.cow4.model.Cell;
import org.tamina.geom.Point;
import createjs.easeljs.Container;
import js.html.CanvasElement;
import com.tamina.cow4.model.GameMap;
import createjs.easeljs.Stage;

@:generic class MapUI<T:CellSprite> extends Stage {

    private var _data:GameMap;
    private var _drawed:Int=0;

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
        QuickLogger.info("Value set data "+ value.cells.length);
        _data = value;
        _cellsSprite = new Array<T>();
        _cellsContainer.removeAllChildren();
        draws(_data.cells[0][0]);
        return _data;
    }

    private function draws(cell:Cell){
        if(cell != null){
            if (!cell.drawed) {
                cell.drawed = true;
                cellDrawn(cell);
                QuickLogger.debug('draw cell id : ' + cell.id);
                var sprite:T = Type.createInstance(CellSpriteClass, [data]);
                sprite.x = cell.position.x;
                sprite.y = cell.position.y;
                QuickLogger.debug('position: ' + cell.position);

                _cellsContainer.addChild(sprite);
                _cellsSprite.push(sprite);
            }
            var plop = cell.nexts;
            Lambda.foreach(plop, function(cell:Cell){if(cell.drawed){plop.remove(cell);}return true;});
            Lambda.foreach(plop, function(cell){draws(cell);return true;});
        }else{
            QuickLogger.info('finish');
            return;
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
