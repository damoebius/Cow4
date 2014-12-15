package com.tamina.cow4.core;

import com.tamina.cow4.events.StartBattleNotification;
import com.tamina.cow4.socket.message.StartBattle;
import com.tamina.cow4.events.NotificationBus;
import com.tamina.cow4.socket.IA;
import com.tamina.cow4.socket.SocketServer;
import com.tamina.cow4.core.Game;

class GameManager {

    private var _games:Array<Game>;

    public function new() {
        _games = new Array<Game>();
        NotificationBus.instance.startBattle.add(startBattleHandler);
    }

    private function startBattleHandler(battle:StartBattleNotification):Void{
        var game = new Game(battle.IAList, cast battle.gameId, battle.player );
        _games.push(game);
        game.start();
    }
}
