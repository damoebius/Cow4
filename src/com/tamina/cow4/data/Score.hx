package com.tamina.cow4.data;
class Score implements IScore{

    public var token:String="";
    public var name:String="";
    public var avatar:String="";
    public var score:Int = 0;

    public function new() {
    }
}

interface IScore {
    public var token:String;
    public var name:String;
    public var avatar:String;
    public var score:Int;
}
