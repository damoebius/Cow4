package com.tamina.cow4.routes;
import nodejs.ChildProcess;
import nodejs.express.ExpressResponse;
import nodejs.express.ExpressRequest;
class TestSocketServerRoute extends Route {

    private var _response:ExpressResponse;

    public function new( ) {
        super(_sucessHandler);
    }

    private function _sucessHandler(request:ExpressRequest,response:ExpressResponse):Void{
        response.send('launch new demoia');
        ChildProcessTool.exec('node js/release/IADemoApp.js',execHandler);
    }

    private function execHandler(error:String, stdout:String, stderr:String):Void{
        nodejs.Console.log(error + stdout + stderr);
    }
}
