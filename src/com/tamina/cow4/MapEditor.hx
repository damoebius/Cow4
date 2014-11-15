package com.tamina.cow4;
import org.tamina.utils.ClassUtils;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.data.Mock;
import com.tamina.cow4.model.vo.CellVO;
import haxe.Serializer;
import haxe.Unserializer;
import com.tamina.cow4.ui.EditorMapUI;
import js.html.HtmlElement;
import js.Browser;
import js.html.CanvasElement;
import org.tamina.log.QuickLogger;

@:expose class MapEditor {

    private static var _instance:MapEditor;

    private var _applicationCanvas:CanvasElement;
    private var _stage:EditorMapUI;

    public function new( ) {
        Console.start();
        QuickLogger.info("instantiation de l'application ");
    }

    static function main() {
        Serializer.USE_CACHE = true;
        _instance = new MapEditor();
        ClassUtils.expose(_instance,'MapEditor');
    }

    public function init(targetContentId:String, contentWidth:Int, contentHeight:Int):Void {
        QuickLogger.info("initialisation");
        _applicationCanvas = cast Browser.document.createCanvasElement();
        var targetContainer:HtmlElement = cast Browser.document.getElementById(targetContentId);
        targetContainer.appendChild(cast _applicationCanvas);
        _applicationCanvas.width = contentWidth;
        _applicationCanvas.height = contentHeight;
        QuickLogger.info("canvas initialized");
        _stage = new EditorMapUI(_applicationCanvas,contentWidth,contentHeight);
        _stage.data = Mock.instance.getTestMap(25, 25);
    }

    public function exportModel():String{
        QuickLogger.info('exporting data');
        var exportedData = Serializer.run( EditorMapUI.getMap().toGameMapVO() );
        return exportedData;
    }

    public function importModel(model:String):Void{
        QuickLogger.info('importing data');
        var importedModel:Array<Array<CellVO>> = cast Unserializer.run( model );
        _stage.data = GameMap.fromGameMapVO(importedModel);
    }
}
