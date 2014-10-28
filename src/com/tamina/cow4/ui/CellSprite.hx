package com.tamina.cow4.ui;
import createjs.easeljs.MouseEvent;
import org.tamina.events.CreateJSEvent;
import createjs.easeljs.Shape;
import createjs.easeljs.Container;
import com.tamina.cow4.model.Cell;

class CellSprite extends Container {

    public var data(get,null):Cell;

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
        _width = width;
        _height = height;
        _backgroundShape = new Shape();
        _backgroundShape.graphics.beginFill("#FFFFFF");
        _backgroundShape.graphics.drawRect(0, 0, _width, _height);
        _backgroundShape.graphics.endFill();
        addChild(_backgroundShape);
        drawWalls();
    }

    private function drawWalls( ):Void {
        _topWall = new HWallSprite(_width);
        _topWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        if(_data.top != null){
            _topWall.hide();
        }
        addChild(_topWall);

        _bottomWall = new HWallSprite(_width);
        _bottomWall.y = _height;
        _bottomWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        if(_data.bottom != null){
            _bottomWall.hide();
        }
        addChild(_bottomWall);

        _leftWall = new VWallSprite(_height);
        _leftWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        if(_data.left != null){
            _leftWall.hide();
        }
        addChild(_leftWall);

        _rightWall = new VWallSprite(_height);
        _rightWall.x = _width;
        _rightWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        if(_data.right != null){
            _rightWall.hide();
        }
        addChild(_rightWall);
    }

    private function wall_clickHandler(evt:MouseEvent):Void{
        trace('click');
        // switcher sur evt.target et changer la valeur
    }

    private function get_data():Cell{
        return _data;
    }
}
