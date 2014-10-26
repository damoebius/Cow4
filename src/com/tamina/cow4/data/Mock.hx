package com.tamina.cow4.data;
class Mock {

    private static var _instance:Mock;
    public static var instance(get,null):Mock;

    private function new( ) {
    }

    public function getTestMap():Map{
        return new Map();
    }

    private function get_instance():Mock{
        if(_instance == null){
            _instance = new Mock();
        }
        return _instance;
    }

}
