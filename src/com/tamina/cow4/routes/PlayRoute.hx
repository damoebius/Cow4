package com.tamina.cow4.routes;

import com.tamina.cow4.data.Mock;
import com.tamina.cow4.socket.IA;

import com.tamina.cow4.socket.SocketServer;
import com.tamina.cow4.core.GameEngine;
import com.tamina.cow4.net.request.PlayRequestParam;
import com.tamina.cow4.config.Config;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;
class PlayRoute extends Route {

    private var _games:Array<GameEngine>;

    public function new( ) {
        _games = new Array<GameEngine>();
        super(_sucessHandler);
    }

    private function _sucessHandler( request:ExpressRequest, response:ExpressResponse ):Void {
        if ( request.param(PlayRequestParam.IA1) != null && request.param(PlayRequestParam.IA2) != null && request.param(PlayRequestParam.GAME_ID) != null ) {
            nodejs.Console.info('fight ' + request.param(PlayRequestParam.IA1) + ' VS ' + request.param(PlayRequestParam.IA2));
            var iaList = new Array<IA>();
            iaList.push(SocketServer.getIAById( cast request.param(PlayRequestParam.IA1) ));
            iaList.push(SocketServer.getIAById( cast request.param(PlayRequestParam.IA2) )) ;
            var game = new GameEngine(iaList,cast request.param(PlayRequestParam.GAME_ID));
            response.sendfile(Config.ROOT_PATH + 'play.html');
        } else {
            nodejs.Console.error('ERROR : url params not found');
        }
    }
}
