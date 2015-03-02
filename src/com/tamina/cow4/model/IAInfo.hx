package com.tamina.cow4.model;
class IAInfo {

    public var id:Float;
    public var name:String;
    public var avatar:String;
    public var pm:Int=1;


    public function new( id:Float,name:String,avatar:String, pm:Int ) {
        this.id = id;
        this.name= name;
        this.avatar = avatar;
        this.pm = pm;
    }
}
