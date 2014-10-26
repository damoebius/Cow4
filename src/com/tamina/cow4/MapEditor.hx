package com.tamina.cow4;
import js.html.HtmlElement;
import js.Browser;
import js.html.CanvasElement;
import org.tamina.log.QuickLogger;

@:expose class MapEditor {

    private static var _instance:MapEditor;

    private var _applicationCanvas:CanvasElement;

    public function new( ) {
        Console.start();
        QuickLogger.info("instantiation de l'application ");
    }

    static function main() {
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

    }
}
