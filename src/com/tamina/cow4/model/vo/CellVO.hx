package com.tamina.cow4.model.vo;
class CellVO {

    public var id:Float;
    public var top:CellVO;
    public var bottom:CellVO;
    public var left:CellVO;
    public var right:CellVO;
    
    public function new(id:Float ) {
        this.id = id;
    }
}
