package com.tamina.cow4.ui;
import com.tamina.cow4.events.NotificationBus;
import createjs.easeljs.MouseEvent;
import org.tamina.events.CreateJSEvent;
import createjs.easeljs.Shape;
import createjs.easeljs.Container;
import com.tamina.cow4.model.Cell;

class CellSprite extends Container {

    public var data(get, null):Cell;

    private var _backgroundShape:Shape;
    private var _topWall:HWallSprite;
    private var _bottomWall:HWallSprite;
    private var _leftWall:VWallSprite;
    private var _rightWall:VWallSprite;
    private var _data:Cell;
    private var _width:Int;
    private var _height:Int;

    public function new( data:Cell, width:Int, height:Int ) {
        super();
        this._data = data;
        _data.changeSignal.add(modelChangeHandler);
        _width = width;
        _height = height;
        _backgroundShape = new Shape();
        _backgroundShape.graphics.beginFill("#FFFFFF");
        _backgroundShape.graphics.drawRect(0, 0, _width, _height);
        _backgroundShape.graphics.endFill();
        addChild(_backgroundShape);
        drawWalls();
        update();
    }

    private function modelChangeHandler( ):Void {
        update();
    }

    private function update( ):Void {
        _topWall.display = (_data.top == null);
        _bottomWall.display = (_data.bottom == null);
        _rightWall.display = (_data.right == null);
        _leftWall.display = (_data.left == null);
    }

    private function drawWalls( ):Void {
        _topWall = new HWallSprite(_width);
        _topWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        addChild(_topWall);

        _bottomWall = new HWallSprite(_width);
        _bottomWall.y = _height;
        _bottomWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);

        addChild(_bottomWall);

        _leftWall = new VWallSprite(_height);
        _leftWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        addChild(_leftWall);

        _rightWall = new VWallSprite(_height);
        _rightWall.x = _width;
        _rightWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        addChild(_rightWall);
    }

    private function wall_clickHandler( evt:MouseEvent ):Void {
        NotificationBus.instance.startUpdateDisplay.dispatch();
        var map = MapUI.getMap();
        var currentCellPosition = map.getCellPosition(_data);
        var neighborCell:Cell = null;
        if ( evt.currentTarget == _bottomWall ) {
            neighborCell = map.getCellAt(cast currentCellPosition.x, cast currentCellPosition.y + 1);
            if ( _data.bottom != null ) {
                _data.bottom = null;
                neighborCell.top = null;
            } else if ( neighborCell != null ) {
                _data.bottom = neighborCell;
                neighborCell.top = _data;
            }
        } else if ( evt.currentTarget == _topWall ) {

            neighborCell = map.getCellAt(cast currentCellPosition.x, cast currentCellPosition.y - 1);
            if ( _data.top != null ) {
                _data.top = null;
                neighborCell.bottom = null;
            } else if ( neighborCell != null ) {
                _data.top = neighborCell;
                neighborCell.bottom = _data;
            }

        } else if ( evt.currentTarget == _leftWall ) {
            neighborCell = map.getCellAt(cast currentCellPosition.x - 1, cast currentCellPosition.y);
            if ( _data.left != null ) {
                _data.left = null;
                neighborCell.right = null;
            } else if ( neighborCell != null ) {
                _data.left = neighborCell;
                neighborCell.right = _data;
            }

        } else if ( evt.currentTarget == _rightWall ) {
            neighborCell = map.getCellAt(cast currentCellPosition.x + 1, cast currentCellPosition.y);
            if ( _data.right != null ) {
                _data.right = null;
                neighborCell.left = null;
            } else if ( neighborCell != null ) {
                _data.right = neighborCell;
                neighborCell.left = _data;
            }
        }
        NotificationBus.instance.stopUpdateDisplay.dispatch();
    }

    private function get_data( ):Cell {
        return _data;
    }
}
