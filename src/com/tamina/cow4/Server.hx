package com.tamina.cow4;

import nodejs.NodeJS;
import com.tamina.cow4.core.GameManager;
import com.tamina.cow4.socket.WSocketServer;
import com.tamina.cow4.routes.PlayRoute;
import com.tamina.cow4.routes.Routes;
import com.tamina.cow4.routes.IAListRoute;
import com.tamina.cow4.routes.TestSocketServerRoute;
import com.tamina.cow4.socket.SocketServer;
import com.tamina.cow4.config.Config;
import com.tamina.cow4.routes.MainRoute;
import nodejs.express.Application;
import nodejs.express.Express;

/**
 * Code of war Server
 * <br/>https://github.com/damoebius/Cow4
 *
 * @module Server
 */
class Server {

    private static var _server:Server;

    private var _express:Application;
    private var _socketServer:SocketServer;
    private var _websocketServer:WSocketServer;
    private var _gameManager:GameManager;

    public function new() {

        Config.ROOT_PATH = NodeJS.dirname+'/../../server/';
        _express = Express.GetApplication();
        _express.listen(Config.APP_PORT);
        _express.use(Express.Static(Config.ROOT_PATH));

        var mainRoute = new MainRoute();
        _express.get('/', mainRoute.succesHandler);

        var testSocketServerRoute = new TestSocketServerRoute();
        _express.get('/' + Routes.SOCKET_TEST, testSocketServerRoute.succesHandler);

        var iaListRoute = new IAListRoute();
        _express.get('/' + Routes.IAList, iaListRoute.succesHandler);

        var playRoute = new PlayRoute();
        _express.get('/' + Routes.Play, playRoute.succesHandler);

        trace('server listening on ' + Config.APP_PORT);

        _socketServer = new SocketServer(Config.SOCKET_PORT);
        _websocketServer = new WSocketServer();
        _gameManager = new GameManager();
    }

    public static function main() {
        haxe.Log.trace = myTrace;
        _server = new Server();
    }

    private static function myTrace(v:Dynamic, ?inf:haxe.PosInfos) {
        nodejs.Console.info(v);
    }

}
