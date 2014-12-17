package com.tamina.cow4.core;


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
    private var _sheep:IA;
    private var _player:Player;

    private var _IAList:Array<IA>;
    private var _iaTurnIndex:Int = 0;

    public function new(iaList:Array<IA>, gameId:Float, player:Player) {
        _IAList = iaList;
        _sheep = new SheepIA();
        _IAList.push(_sheep);
        _player = player;
        _data = Mock.instance.getTestMap(25, 25);
        _data.id = gameId;
        _data.getCellAt(0, 0).occupant = _IAList[0].toInfo();
        _data.getCellAt(24, 24).occupant = _IAList[1].toInfo();
        _data.getCellAt(12, 12).occupant = _sheep.toInfo();
    }

    public function start():Void {
        _currentTurn = 0;
        _isComputing = false;
        _maxNumTurn = GameConstants.GAME_MAX_NUM_TURN;
        _startBattleDate = Date.now();
        performTurn();
    }

    private function performTurn():Void {
        updatePlayer();
        retrieveIAOrders(_IAList[_iaTurnIndex]);
    }

    private function updatePlayer():Void {
        _player.render(_data);
    }


    private function retrieveIAOrders(targetIA:IA):Void {
        targetIA.turnComplete.addOnce(turnCompleteHandler);
        targetIA.getTurnOrder(_data);
    }

    private function turnCompleteHandler(result:TurnResult):Void {
        _iaTurnIndex++;
        if (_iaTurnIndex >= _IAList.length) {
            _iaTurnIndex = 0;
            _currentTurn++;
        }
        if (_currentTurn < _maxNumTurn) {
            performTurn();
        } else {
            nodejs.Console.info('FIN DU COMBAT');
        }
    }
}
