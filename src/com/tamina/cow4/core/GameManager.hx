package com.tamina.cow4.core;

import com.tamina.cow4.socket.message.StartBattle;
import com.tamina.cow4.events.NotificationBus;
import com.tamina.cow4.socket.IA;
import com.tamina.cow4.socket.SocketServer;
import com.tamina.cow4.core.GameEngine;

class GameManager {

    private var _games:Array<GameEngine>;

    public function new() {
        _games = new Array<GameEngine>();
        NotificationBus.instance.startBattle.add(startBattleHandler);
    }

    private function startBattleHandler(battle:StartBattle):Void{
        var iaList = new Array<IA>();
        iaList.push(SocketServer.getIAById( cast battle.IA1));
        iaList.push(SocketServer.getIAById( cast battle.IA2) ) ;
        var game = new GameEngine(iaList, cast battle.gameId );
    }
}
