package com.tamina.cow4;
import haxe.Serializer;
import haxe.Json;
import com.tamina.cow4.ui.MapUI;
import js.html.HtmlElement;
import js.Browser;
import js.html.CanvasElement;
import org.tamina.log.QuickLogger;

@:expose class MapEditor {

    private static var _instance:MapEditor;

    private var _applicationCanvas:CanvasElement;
    private var _stage:MapUI;

    public function new( ) {
        Console.start();
        QuickLogger.info("instantiation de l'application ");
    }

    static function main() {
        Serializer.USE_CACHE = true;
        _instance = new MapEditor();
        untyped __js__("window.MapEditor = com.tamina.cow4.MapEditor._instance");
    }

    public function init(targetContentId:String, contentWidth:Int, contentHeight:Int):Void {
        QuickLogger.info("initialisation");
        _applicationCanvas = cast Browser.document.createCanvasElement();
        var targetContainer:HtmlElement = cast Browser.document.getElementById(targetContentId);
        targetContainer.appendChild(cast _applicationCanvas);
        _applicationCanvas.width = contentWidth;
        _applicationCanvas.height = contentHeight;
        QuickLogger.info("canvas initialized");
        _stage = new MapUI(_applicationCanvas,contentWidth,contentHeight);
    }

    public function export():String{
        QuickLogger.info('exporting data');
        var exportedData = Serializer.run( MapUI.getMap().toGameMapVO() );
        return exportedData;
    }
}
