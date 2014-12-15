package com.tamina.cow4.events;
import com.tamina.cow4.socket.IA;
import com.tamina.cow4.socket.Player;
import com.tamina.cow4.socket.message.StartBattle;
class StartBattleNotification {

    public var gameId:String;
    public var player:Player;
    public var IAList:Array<IA>;

    public function new(iaList:Array<IA>,player:Player) {
        this.IAList = iaList;
        this.player = player;
    }
}
