package com.tamina.cow4.model.vo;
class GameMapVO {

    public var cells:Array<Array<CellVO>>;
    public var currentTurn:Int=0;
    public var iaList:Array<IAInfo>;

    public function new() {
        cells = new Array<Array<CellVO>>();
        iaList = new Array<IAInfo>();
    }
}
