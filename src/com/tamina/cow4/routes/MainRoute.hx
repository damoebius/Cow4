package com.tamina.cow4.routes;
import nodejs.NodeJS;
import nodejs.Path;
import com.tamina.cow4.config.Config;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;
class MainRoute extends Route{

    public function new( ) {
        super(_sucessHandler);
    }

    private function _sucessHandler(request:ExpressRequest,response:ExpressResponse):Void{
        var path:Path = NodeJS.require('path');
        response.sendfile(path.resolve(Config.ROOT_PATH+'index.html'));
    }
}
