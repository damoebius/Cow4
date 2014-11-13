package com.tamina.cow4.routes;
import com.tamina.cow4.config.Config;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;
class PlayRoute extends Route{
    public function new( ) {
        super(_sucessHandler);
    }

    private function _sucessHandler(request:ExpressRequest,response:ExpressResponse):Void{
        response.sendfile(Config.ROOT_PATH+'play.html');
    }
}
