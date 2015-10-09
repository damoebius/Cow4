package com.tamina.cow4.routes;

import nodejs.NodeJS;
import nodejs.Path;
import com.tamina.cow4.net.request.PlayRequestParam;
import com.tamina.cow4.config.Config;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;
class PlayRoute extends Route {



    public function new( ) {

        super(_sucessHandler);
    }

    private function _sucessHandler( request:ExpressRequest, response:ExpressResponse ):Void {
        if ( request.param(PlayRequestParam.IA1) != null && request.param(PlayRequestParam.IA2) != null && request.param(PlayRequestParam.GAME_ID) != null ) {
            var path:Path = NodeJS.require('path');
            response.sendfile(path.resolve(Config.ROOT_PATH + 'play.html'));
        } else {
            nodejs.Console.error('ERROR : url params not found');
        }
    }
}
