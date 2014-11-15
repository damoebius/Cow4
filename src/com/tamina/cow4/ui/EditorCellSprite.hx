package com.tamina.cow4.ui;
import org.tamina.events.CreateJSEvent;
import com.tamina.cow4.model.Cell;
import com.tamina.cow4.events.NotificationBus;
import createjs.easeljs.MouseEvent;
class EditorCellSprite extends CellSprite {

    public function new(data:Cell ) {
        super(data);
    }

    override private function drawWalls( ):Void {
        super.drawWalls();
        _topWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        _bottomWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        _leftWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        _rightWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
    }

    private function wall_clickHandler( evt:MouseEvent ):Void {
        NotificationBus.instance.startUpdateDisplay.dispatch();
        var map = EditorMapUI.getMap();
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
}
