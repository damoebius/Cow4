package com.tamina.cow4;
import com.tamina.cow4.view.HomeView;
import org.tamina.log.QuickLogger;
@:expose class Frontend {

    public static inline var MODULE_NAME:String = 'frontend_app';

    private static var _instance:Frontend;

    private var _homeView:HomeView;

    public function new( ) {
        Console.start();
        QuickLogger.info("instantiation de l'application ");
    }

    public function init():Void{

        _homeView = new HomeView(MODULE_NAME);

    }

    static function main() {
        _instance = new Frontend();
        untyped __js__("window.Frontend = com.tamina.cow4.Frontend._instance");
    }
}
