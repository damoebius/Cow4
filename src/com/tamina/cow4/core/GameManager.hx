package com.tamina.cow4.core;

import com.tamina.cow4.socket.QualifIA;
import com.tamina.cow4.socket.IIA;
import com.tamina.cow4.events.StartBattleNotification;
import com.tamina.cow4.socket.message.StartBattle;
import com.tamina.cow4.events.NotificationBus;
import com.tamina.cow4.socket.IA;
import com.tamina.cow4.model.Item;
import com.tamina.cow4.socket.SocketServer;
import com.tamina.cow4.core.Game;

class GameManager {

    private var _games:Array<Game>;

    public function new() {
        _games = new Array<Game>();
        NotificationBus.instance.startBattle.add(startBattleHandler);
        NotificationBus.instance.startQualif.add(startQualifHandler);
    }

    private function startQualifHandler(battle:StartBattleNotification):Void{
        var list = new Array<IIA>();
        var ia:IA = battle.IAList[0];
        ia.reset();
        list.push(ia);
        list.push( new QualifIA() );
        var game = new Game(list, cast battle.gameId, battle.player,true );
        _games.push(game);
        game.start();
    }

    private function startBattleHandler(battle:StartBattleNotification):Void{
        var list = new Array<IIA>();
        for(i in 0...battle.IAList.length){
            var ia:IA = battle.IAList[i];
            ia.reset();
            list.push(ia);
        }
        var game = new Game(list, cast battle.gameId, battle.player );
        _games.push(game);
        game.start();
    }
}
