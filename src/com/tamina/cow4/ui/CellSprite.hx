package com.tamina.cow4.ui;
import com.tamina.cow4.model.ItemType;
import createjs.easeljs.Bitmap;
import createjs.easeljs.Shape;
import createjs.easeljs.Container;
import com.tamina.cow4.model.Cell;

class CellSprite extends Container {

    public var width(get,null):Int;
    public var height(get,null):Int;

    public var data(get, null):Cell;

    private var _backgroundShape:Shape;
    private var _itemBitmap:Bitmap;
    private var _topWall:WallSprite;
    private var _bottomWall:WallSprite;
    private var _leftWall:WallSprite;
    private var _rightWall:WallSprite;
    private var _data:Cell;

    public function new( data:Cell ) {
        super();
        this._data = data;
        _data.changeSignal.add(modelChangeHandler);
        _backgroundShape = new Shape();
        _backgroundShape.graphics.beginFill("#FFFFFF");
        _backgroundShape.graphics.drawRect(0, 0, width, height);
        _backgroundShape.graphics.endFill();
        addChild(_backgroundShape);
        drawWalls();
        drawItem();
        updateDisplay();
    }

    public function get_width():Int{
        return 20;
    }

    public function get_height():Int{
        return 20;
    }

    private function modelChangeHandler( ):Void {
        updateDisplay();
    }

    public function updateDisplay( ):Void {
        _topWall.display = (_data.top == null);
        _bottomWall.display = (_data.bottom == null);
        _rightWall.display = (_data.right == null);
        _leftWall.display = (_data.left == null);
        drawItem();
    }

    private function drawItem():Void{
        if(_data.item != null && !contains(_itemBitmap)){
            switch(_data.item.type){
                case ItemType.POTION:
                    _itemBitmap = new Bitmap('/images/potion_sprite.png');
                case ItemType.TRAP:
                    _itemBitmap = new Bitmap('/images/trap_sprite.png');
                case ItemType.PARFUM:
                    _itemBitmap = new Bitmap('/images/parfum_sprite.png');
            }
            addChild(_itemBitmap);
        }
    }

    private function drawWalls( ):Void {
        _topWall = new HWallSprite(width);
        addChild(_topWall);

        _bottomWall = new HWallSprite(height);
        _bottomWall.y = height;

        addChild(_bottomWall);

        _leftWall = new VWallSprite(height);
        addChild(_leftWall);

        _rightWall = new VWallSprite(height);
        _rightWall.x = width;
        addChild(_rightWall);
    }

    private function get_data( ):Cell {
        return _data;
    }
}
