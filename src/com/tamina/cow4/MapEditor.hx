package com.tamina.cow4;
import org.tamina.log.QuickLogger;
class MapEditor {

    private static var _instance:MapEditor;

    public function new( ) {
        Console.start();
        QuickLogger.info("instantiation de l'application ");
    }

    static function main() {
        _instance = new MapEditor();
    }
}
