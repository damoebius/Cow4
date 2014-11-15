package com.tamina.cow4.ui;
import haxe.Timer;
import com.tamina.cow4.events.NotificationBus;
import com.tamina.cow4.model.GameMap;
import js.html.CanvasElement;

class EditorMapUI extends MapUI<EditorCellSprite> {

    private static inline var FPS:Float = 30.0;
    private static var _map:GameMap;

    private var _width:Int;
    private var _height:Int;

    private var _updateDisplay:Bool = true;

    public function new( display:CanvasElement, width:Int, height:Int ) {
        super(EditorCellSprite, display,FPS);

        NotificationBus.instance.startUpdateDisplay.add(startUpdateDisplayHandler);
        NotificationBus.instance.stopUpdateDisplay.add(stopUpdateDisplayHandler);

        _width = width;
        _height = height;

    }

    public static function getMap():GameMap{
        return _map;
    }

    override private function get_data( ):GameMap {
        startUpdateDisplayHandler();
        return super.data;
    }

    override private function set_data( value:GameMap ):GameMap {
        startUpdateDisplayHandler();
        var result = (super.data = value);
        _map = result;
        stopUpdateDisplayHandler();
        return result;
    }

    private function startUpdateDisplayHandler( ):Void {
        _updateDisplay = true;
    }

    private function stopUpdateDisplayHandler( ):Void {
        Timer.delay(function( ):Void {
            _updateDisplay = false;
        }, 500);
    }

    override private function tickerHandler( ):Void {
        if ( _updateDisplay ) {
            super.update();
        }
    }
}
