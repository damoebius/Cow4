package com.tamina.cow4.core;
class ParseResult {

    public var message:String='';
    public var type:ParseResultType = ParseResultType.SUCCESS;

    public function new( ) {
    }
}

@:enum abstract ParseResultType(Int) from Int to Int{
    var SUCCESS=0;
    var ERROR=1;
}


