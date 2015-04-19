package com.tamina.cow4.ui;
import com.tamina.cow4.model.ParfumItem;
import com.tamina.cow4.model.TrapItem;
import com.tamina.cow4.model.PotionItem;
import com.tamina.cow4.model.ItemType;
import org.tamina.geom.Point;
import org.tamina.events.CreateJSEvent;
import com.tamina.cow4.model.Cell;
import com.tamina.cow4.events.NotificationBus;
import createjs.easeljs.MouseEvent;
class EditorCellSprite extends CellSprite {

    public function new(data:Cell) {
        super(data);
    }

    override private function drawWalls():Void {
        super.drawWalls();
        _topWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        _bottomWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        _leftWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        _rightWall.addEventListener(CreateJSEvent.MOUSE_DOWN, wall_clickHandler);
        _backgroundShape.addEventListener(CreateJSEvent.MOUSE_DOWN, background_clickHandler);
    }

    private function background_clickHandler(event:MouseEvent):Void{
        NotificationBus.instance.startUpdateDisplay.dispatch();
        switch (MapEditor.itemType){
            case ItemType.POTION:
                _data.item = new PotionItem();
            case ItemType.TRAP:
                _data.item = new TrapItem();
            case ItemType.PARFUM:
                _data.item = new ParfumItem();
        }
            drawItem();
        NotificationBus.instance.stopUpdateDisplay.dispatch();
    }

    private function getOppositeCell(target:Cell):Cell {
        var map = EditorMapUI.getMap();
        var targetPosition = map.getCellPosition(target);
        var oppositePositon = new Point(0, 0);
        var middlePosition = new Point( Math.ceil(map.cells.length / 2)-1, Math.ceil(map.cells.length / 2)-1);
        if (targetPosition.x > middlePosition.x) {
            oppositePositon.x = middlePosition.x - (targetPosition.x - middlePosition.x);
        } else {
            oppositePositon.x = middlePosition.x + ( middlePosition.x - targetPosition.x);
        }

        if (targetPosition.y > middlePosition.y) {
            oppositePositon.y = middlePosition.y - (targetPosition.y - middlePosition.y);
        } else {
            oppositePositon.y = middlePosition.y + ( middlePosition.y - targetPosition.y);
        }
        return map.getCellAt(cast oppositePositon.x, cast oppositePositon.y);
    }

    private function wall_clickHandler(evt:MouseEvent):Void {
        NotificationBus.instance.startUpdateDisplay.dispatch();
        var map = EditorMapUI.getMap();
        var currentCellPosition = map.getCellPosition(_data);
        var oppositeCell = getOppositeCell(_data);
        var oppositeCellPosition = map.getCellPosition(oppositeCell);
        var neighborCell:Cell = null;
        var oppositeNeighborCell:Cell = null;
        if (evt.currentTarget == _bottomWall) {
            neighborCell = map.getCellAt(cast currentCellPosition.x, cast currentCellPosition.y + 1);
            oppositeNeighborCell = map.getCellAt(cast oppositeCellPosition.x, cast oppositeCellPosition.y - 1);
            if (_data.bottom != null) {
                _data.bottom = null;
                neighborCell.top = null;
                oppositeCell.top = null;
                oppositeNeighborCell.bottom = null;
            } else if (neighborCell != null) {
                _data.bottom = neighborCell;
                neighborCell.top = _data;
                oppositeCell.top = oppositeNeighborCell;
                oppositeNeighborCell.bottom = oppositeCell;
            }
        } else if (evt.currentTarget == _topWall) {

            neighborCell = map.getCellAt(cast currentCellPosition.x, cast currentCellPosition.y - 1);
            oppositeNeighborCell = map.getCellAt(cast oppositeCellPosition.x, cast oppositeCellPosition.y + 1);
            if (_data.top != null) {
                _data.top = null;
                neighborCell.bottom = null;
                oppositeCell.bottom = null;
                oppositeNeighborCell.top = null;
            } else if (neighborCell != null) {
                _data.top = neighborCell;
                neighborCell.bottom = _data;
                oppositeCell.bottom = oppositeNeighborCell;
                oppositeNeighborCell.top = oppositeCell;
            }

        } else if (evt.currentTarget == _leftWall) {
            neighborCell = map.getCellAt(cast currentCellPosition.x - 1, cast currentCellPosition.y);
            oppositeNeighborCell = map.getCellAt(cast oppositeCellPosition.x + 1, cast oppositeCellPosition.y);
            if (_data.left != null) {
                _data.left = null;
                neighborCell.right = null;
                oppositeCell.right = null;
                oppositeNeighborCell.left = null;
            } else if (neighborCell != null) {
                _data.left = neighborCell;
                neighborCell.right = _data;
                oppositeCell.right = oppositeNeighborCell;
                oppositeNeighborCell.left = oppositeCell;
            }

        } else if (evt.currentTarget == _rightWall) {
            neighborCell = map.getCellAt(cast currentCellPosition.x + 1, cast currentCellPosition.y);
            oppositeNeighborCell = map.getCellAt(cast oppositeCellPosition.x - 1, cast oppositeCellPosition.y);
            if (_data.right != null) {
                _data.right = null;
                neighborCell.left = null;
                oppositeCell.left = null;
                oppositeNeighborCell.right = null;
            } else if (neighborCell != null) {
                _data.right = neighborCell;
                neighborCell.left = _data;
                oppositeCell.left = oppositeNeighborCell;
                oppositeNeighborCell.right = oppositeCell;
            }
        }
        NotificationBus.instance.stopUpdateDisplay.dispatch();
    }
}
