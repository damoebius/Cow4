package com.tamina.cow4;
import com.tamina.cow4.Frontend;
import com.tamina.cow4.config.FrontendConfig;
import com.tamina.cow4.view.PlayView;
import com.tamina.cow4.view.ViewName;
import org.tamina.net.URL;
import org.tamina.net.BaseRequest;
import org.tamina.utils.ClassUtils;
import com.tamina.cow4.view.HomeView;
import org.tamina.log.QuickLogger;
@:expose class Frontend {

    public static inline var MODULE_NAME:String = 'frontend_app';
    public static var config:FrontendConfig;

    private static var _instance:Frontend;

    private var _homeView:HomeView;
    private var _playView:PlayView;

    public function new( ) {
        Console.start();
        QuickLogger.info("instantiation de l'application ");
    }

    public function init(config:FrontendConfig,viewName:ViewName=ViewName.Home):Void{
        Frontend.config = config;
        BaseRequest.endpoint =  new URL('http://'+Frontend.config.server+':'+Frontend.config.port);
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
