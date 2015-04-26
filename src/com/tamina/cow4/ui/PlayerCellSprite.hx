package com.tamina.cow4.ui;
import com.tamina.cow4.socket.SheepIA;
import createjs.easeljs.Shape;
import com.tamina.cow4.model.Cell;
class PlayerCellSprite extends CellSprite {

    private var _playerSprite:IASprite;
    private var _sheepSprite:IASprite;
    private var _initialized:Bool = false;

    public function new( data:Cell ) {
        super(data);
        _backgroundShape.visible = false;
        _playerSprite = new IASprite("images/ia_sprite.png");
        _playerSprite.x = 8;
        _playerSprite.y = 8;
        addChild(_playerSprite);

        _sheepSprite =  new IASprite("images/chicken_sprite.png");
        _sheepSprite.x = 8;
        _sheepSprite.y = 8;
        addChild(_sheepSprite);

        _initialized = true;
        updateDisplay();

    }

    override public function get_width( ):Int {
        return 32;
    }

    override public function get_height( ):Int {
        return 32;
    }

    override public function updateDisplay( ):Void {
        super.updateDisplay();
        if ( _initialized ) {
            if(data.occupant != null){
                if(data.occupant.name == SheepIA.IA_NAME){
                    _playerSprite.visible = false;
                    _sheepSprite.visible = true;
                } else {
                    _playerSprite.visible = true;
                    _sheepSprite.visible = false;
                }
            } else {
                _playerSprite.visible = false;
                _sheepSprite.visible = false;
            } if(data.item == null && _itemBitmap != null && _itemBitmap.visible){
                _itemBitmap.visible = false;
            }
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
