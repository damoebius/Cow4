package com.tamina.cow4.model.vo;
class CellVO {

    public var id:Float;
    public var top:Float;
    public var bottom:Float;
    public var left:Float;
    public var right:Float;
    public var occupant:IAInfo;
    
    public function new(id:Float, ?occupant:IAInfo ) {
        this.id = id;
        this.occupant = occupant;
    }
}
