package com.tamina.cow4.core;


import com.tamina.cow4.core.ParseResult.ParseResultType;
import com.tamina.cow4.socket.message.order.EndOrder;
import com.tamina.cow4.socket.message.order.MoveOrder;
import com.tamina.cow4.model.Action;
import com.tamina.cow4.model.TurnAction;
import com.tamina.cow4.socket.IIA;
import com.tamina.cow4.socket.message.TurnResult;
import com.tamina.cow4.socket.Player;
import com.tamina.cow4.model.GameConstants;
import com.tamina.cow4.socket.IA;

import com.tamina.cow4.socket.SheepIA;
import com.tamina.cow4.data.Mock;
import com.tamina.cow4.model.GameMap;

class Game {

    private var _currentTurn:Int;
    private var _endBattleDate:Date;
    private var _data:GameMap;
    private var _isComputing:Bool;
    private var _maxNumTurn:Int;
    private var _startBattleDate:Date;
    private var _sheep:IIA;
    private var _player:Player;

    private var _IAList:Array<IIA>;
    private var _iaTurnIndex:Int = 0;

    public function new( iaList:Array<IIA>, gameId:Float, player:Player ) {
        _player = player;
        _IAList = iaList;
        _sheep = new SheepIA();
        _IAList.push(_sheep);
        _data = Mock.instance.getDefaultMap();
        _data.iaList.push(_IAList[0].toInfo());
        _data.iaList.push(_IAList[1].toInfo());
        _data.iaList.push(_IAList[2].toInfo());
        _data.id = gameId;

        _data.getCellAt(0, 0).occupant = _IAList[0].toInfo();
        _data.getCellAt(24, 24).occupant = _IAList[1].toInfo();
        _data.getCellAt(12, 12).occupant = _sheep.toInfo();
    }

    public function start( ):Void {
        _currentTurn = 0;
        _isComputing = false;
        _maxNumTurn = GameConstants.GAME_MAX_NUM_TURN;
        _startBattleDate = Date.now();
        initPlayer();
        performTurn();
    }

    private function initPlayer( ):Void {
        _player.render(_data);
    }

    private function performTurn( ):Void {
        nodejs.Console.info('performTurn');
        retrieveIAOrders(_IAList[_iaTurnIndex]);
    }

    private function updatePlayer( turn:TurnResult ):Void {
        _player.updateRender(turn);
    }


    private function retrieveIAOrders( targetIA:IIA ):Void {
        nodejs.Console.info(targetIA.id + ' : retrieveIAOrders');
        targetIA.turnComplete.addOnce(turnCompleteHandler);
        targetIA.getTurnOrder(_data);
    }

    private function parseTurnResult( value:TurnResult ):ParseResult {
        var result = new ParseResult();
        for ( i in 0...value.actions.length ) {
            switch(value.actions[i].type){
                case Action.MOVE :
                    result = parseMoveOrder(cast value.actions[i]);
                    break;
                case Action.FAIL :
                    result.type = ParseResultType.ERROR;
                    result.message = 'action interdite';
                    end(result.message);
            }

        }
        return result;
    }

    private function parseMoveOrder( order:MoveOrder ):ParseResult {
        var result = new ParseResult();
        var currentIA = _IAList[_iaTurnIndex];
        var currentCell = _data.getCellByIA(currentIA.id);
        var targetCell = currentCell.getNeighboorById(order.target);
        if ( targetCell != null ) {
            if ( targetCell.occupant != null ) {
                result.type = ParseResultType.ERROR;
                result.message = 'la case ciblée est deja occupée';
                nodejs.Console.info(result.message);
            } else {
                targetCell.occupant = currentCell.occupant;
                currentCell.occupant = null;
            }
        } else {
            result.type = ParseResultType.ERROR;
            result.message = 'la case ciblée nest pas voisine de la courant';
            nodejs.Console.info(result.message);
        }
        return result;
    }

    private function turnCompleteHandler( result:TurnResult ):Void {
        nodejs.Console.info('fin de tour');
        var parseResult =  parseTurnResult(result);
        if ( parseResult.type == ParseResultType.SUCCESS ) {
            result.ia = _IAList[_iaTurnIndex].toInfo();
            updatePlayer(result);
            _iaTurnIndex++;
            if ( _iaTurnIndex >= _IAList.length ) {
                _iaTurnIndex = 0;
                _currentTurn++;
            }
            if ( _currentTurn < _maxNumTurn ) {
                performTurn();
            } else {
                end('nombre de tour max');
            }
        } else {
            end( parseResult.message );
        }

    }

    private function end( message:String ):Void {
        var result = new TurnResult();
        result.actions.push( new EndOrder(Action.FAIL,message));
        result.ia = _IAList[_iaTurnIndex].toInfo();
        updatePlayer(result);
        nodejs.Console.info(message);
    }
}
