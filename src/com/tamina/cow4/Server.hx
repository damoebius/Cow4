package com.tamina.cow4;
import com.tamina.cow4.config.Config;
import com.tamina.cow4.routes.MainRoute;
import nodejs.express.Application;
import nodejs.express.Express;
class Server {

    private static inline var APP_PORT:Int = 3000;

    private static var _server:Server;

    private var _express:Application;

    public function new( ) {
        _express = Express.GetApplication();
        _express.listen( APP_PORT );
        _express.use( Express.Static(Config.ROOT_PATH));

        var mainRoute = new MainRoute();
        _express.get('/', mainRoute.succesHandler);

        trace('server listening on ' + APP_PORT);
    }

    static function main() {
        _server = new Server();
    }

}
