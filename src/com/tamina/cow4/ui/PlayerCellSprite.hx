package com.tamina.cow4.ui;
import createjs.easeljs.Shape;
import com.tamina.cow4.model.Cell;
class PlayerCellSprite extends CellSprite {

    private var _playerSprite:Shape;
    private var _sheepSprite:Shape;
    private var _initialized:Bool = false;

    public function new( data:Cell ) {
        super(data);
        _backgroundShape.visible = false;
        _playerSprite = new Shape();
        _playerSprite.graphics.beginFill('#0000FF');
        _playerSprite.graphics.drawRect(8, 8, 16, 16);
        _playerSprite.graphics.endFill();
        addChild(_playerSprite);

        _sheepSprite = new Shape();
        _sheepSprite.graphics.beginFill('#FF0000');
        _sheepSprite.graphics.drawRect(8, 8, 16, 16);
        _sheepSprite.graphics.endFill();
//addChild(_sheepSprite);

        _initialized = true;
        updateDisplay();

    }

    override public function get_width( ):Int {
        return 32;
    }

    override public function get_height( ):Int {
        return 32;
    }

    override private function updateDisplay( ):Void {
        super.updateDisplay();
        if ( _initialized ) {
            _playerSprite.visible = (data.occupant != null);
        }
    }

    override private function drawWalls( ):Void {
        _topWall = new BitmapWallSprite("images/fence_top.png");
        _topWall.y = -16;
        addChild(_topWall);

        _leftWall = new BitmapWallSprite("images/fence_left.png");
        _leftWall.y = -16;
        addChild(_leftWall);

        _rightWall = new BitmapWallSprite("images/fence_right.png");
        _rightWall.y = -16;
        addChild(_rightWall);

        _bottomWall = new BitmapWallSprite("images/fence_bottom.png");
        addChild(_bottomWall);
    }
}
