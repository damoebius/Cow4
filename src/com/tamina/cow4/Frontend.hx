package com.tamina.cow4;
import com.tamina.cow4.view.PlayView;
import com.tamina.cow4.view.ViewName;
import org.tamina.net.URL;
import org.tamina.net.BaseRequest;
import org.tamina.utils.ClassUtils;
import com.tamina.cow4.view.HomeView;
import org.tamina.log.QuickLogger;
@:expose class Frontend {

    public static inline var MODULE_NAME:String = 'frontend_app';

    private static var _instance:Frontend;

    private var _homeView:HomeView;
    private var _playView:PlayView;

    public function new( ) {
        Console.start();
        QuickLogger.info("instantiation de l'application ");
    }

    public function init(endpoint:String,viewName:ViewName=ViewName.Home):Void{
        BaseRequest.endpoint =  new URL(endpoint);
        switch(viewName){
            case ViewName.Home:
                _homeView = new HomeView(MODULE_NAME);
            case ViewName.Play:
                _playView = new PlayView(MODULE_NAME);
        }


    }

    static function main() {
        _instance = new Frontend();
        ClassUtils.expose(_instance,'Frontend');
    }
}
