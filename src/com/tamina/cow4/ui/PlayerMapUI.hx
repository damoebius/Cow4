package com.tamina.cow4.ui;
import js.html.CanvasElement;
class PlayerMapUI extends MapUI<CellSprite> {
    private static inline var FPS:Float = 30.0;

    public function new( display:CanvasElement ) {
        super( CellSprite, display, FPS );
    }
}
