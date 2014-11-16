package com.tamina.cow4.ui;
import com.tamina.cow4.model.Cell;
class PlayerCellSprite extends CellSprite {
    public function new( data:Cell) {
        super(data);
        _backgroundShape.visible = false;
    }

    override public function get_width():Int{
        return 32;
    }

    override public function get_height():Int{
        return 32;
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
