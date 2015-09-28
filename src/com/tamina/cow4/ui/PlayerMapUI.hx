package com.tamina.cow4.ui;
import msignal.Signal;
import com.tamina.cow4.model.ItemType;
import com.tamina.cow4.socket.message.order.UseItemOrder;
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
    private static inline var FPS:Float = 10.0;

    public var endSignal:Signal2<IAInfo,EndOrder>;

    private var _background:Shape;
    private var _backgroundImage:Image;

    private var _width:Int = 1000;
    private var _height:Int = 1000;
    private var _runningActions:Int = 0;
    public var runningActions(get, null):Int;

    public function new( display:CanvasElement ) {
        super(PlayerCellSprite, display, FPS);
        _background = new Shape();
        _backgroundImage = new Image();
        _backgroundImage.addEventListener(ImageEvent.LOAD, backgroundLoadHandler);
        _backgroundImage.src = "images/background.png";
        //_endScreen = new EndScreen(_width, _height);
        super.addChildAt(_background, 0);
        _cellsContainer.x = 0;
        _cellsContainer.y = 0;
        endSignal = new Signal2<IAInfo,EndOrder>();

    }

    public function updateMap( ia:IAInfo, actions:Array<TurnAction> ):Void {
        _runningActions = actions.length;
        for ( i in 0...actions.length ) {
            Timer.delay(function( ):Void {
                parseAction(ia, actions[i]);
            }, 250 * i);
        }

    }

    private function get_runningActions( ):Int {
        return _runningActions;
    }

    private function parseAction( ia:IAInfo, action:TurnAction ):Void {
        var currentCell:Cell = this.data.getCellByIA(ia.id);
        if ( currentCell != null ) {
            currentCell.occupant = ia;
        } else {
            trace('ERROR : CELL NULL');
        }
        switch (action.type){
            case Action.MOVE:
                var move:MoveOrder = cast action;
                var targetCell:Cell = super.data.getCellById(move.target);

                if ( targetCell != null ) {
                    targetCell.occupant = ia;
                    if(targetCell.id == currentCell.id){
                        trace('CANNOT MOVE TO THE SAME CELL');
                    } else {
                        currentCell.occupant = null;
                    }

                } else {
                    trace('TARGET CELL NULL');
                }

            case Action.FAIL:
                var fail:EndOrder = cast action;
                trace(fail.message);
                endSignal.dispatch(ia, fail);
            case Action.SUCCESS:
                var success:EndOrder = cast action;
                endSignal.dispatch(ia, success);
            case Action.GET_ITEM :
                currentCell.item = null;
            case Action.USE_ITEM :
                var useAction:UseItemOrder = cast action;
                if ( useAction.item.type == ItemType.TRAP ) {
                    trace('use trap');
                    currentCell.item = useAction.item;
                }
        }
        _runningActions--;
        updateDisplay();
        if(super.data.getCellByIA(ia.id) == null){
            trace('BUUUUG : DISAPARED IA');
        }
    }

    private function backgroundLoadHandler( evt:Event ):Void {
        _background.graphics.beginBitmapFill(_backgroundImage);
        _background.graphics.drawRect(0, 0, _width, _height);
        _background.graphics.endFill();
    }
}
