package com.tamina.cow4.ui;
import haxe.Timer;
import com.tamina.cow4.socket.message.order.EndOrder;
import com.tamina.cow4.socket.message.order.MoveOrder;
import com.tamina.cow4.model.Cell;
import com.tamina.cow4.model.IAInfo;
import com.tamina.cow4.model.TurnAction;
import com.tamina.cow4.model.Action;
import js.html.Event;
import org.tamina.events.html.ImageEvent;
import js.html.Image;
import createjs.easeljs.Shape;
import js.html.CanvasElement;
class PlayerMapUI extends MapUI<PlayerCellSprite> {
    private static inline var FPS:Float = 30.0;

    private var _background:Shape;
    private var _backgroundImage:Image;
    private var _endScreen:EndScreen;

    private var _width:Int=864;
    private var _height:Int=864;
    private var _runningActions:Int=0;
    public var runningActions(get,null):Int;

    public function new( display:CanvasElement ) {
        super(PlayerCellSprite, display, FPS);
        _background = new Shape();
        _backgroundImage = new Image();
        _backgroundImage.addEventListener(ImageEvent.LOAD, backgroundLoadHandler);
        _backgroundImage.src = "images/background.png";
        _endScreen = new EndScreen(_width,_height);
        super.addChildAt(_background, 0);
        _cellsContainer.x = 32;
        _cellsContainer.y = 32;

    }

    public function updateMap( ia:IAInfo, actions:Array<TurnAction> ):Void {
        trace('updateMap ' + actions.length);
        _runningActions = actions.length;
        for ( i in 0...actions.length ) {
            Timer.delay(function():Void{
               parseAction(ia,actions[i]);
            }, 250*i);
        }

    }

    private function get_runningActions():Int{
        return _runningActions;
    }

    private function parseAction( ia:IAInfo, action:TurnAction ):Void{
        var currentCell:Cell = this.data.getCellByIA(ia.id);
        switch (action.type){
            case Action.MOVE:
                var move:MoveOrder = cast action;
                var targetCell = currentCell.getNeighboorById(move.target);
                targetCell.occupant = currentCell.occupant;
                currentCell.occupant = null;
            case Action.FAIL:
                var fail:EndOrder = cast action;
                trace(fail.message);
                this.addChild(_endScreen);

                _endScreen.setMessage('fail : ' + ia.name + ' : ' + fail.message);
            case Action.SUCCESS:
                var success:EndOrder = cast action;
                this.addChild(_endScreen);

                _endScreen.setMessage('success : ' + ia.name + ' : ' + success.message);
            case Action.GET_ITEM :
//todo
            case Action.USE_ITEM :
//todo
        }
        _runningActions--;
        updateDisplay();
    }

    private function backgroundLoadHandler( evt:Event ):Void {
        _background.graphics.beginBitmapFill(_backgroundImage);
        _background.graphics.drawRect(0, 0, _width, _height);
        _background.graphics.endFill();
    }
}
