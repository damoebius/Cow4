package com.tamina.cow4.socket;

import com.tamina.cow4.socket.message.Render;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.events.StartBattleNotification;
import com.tamina.cow4.socket.message.PlayerMessage;
import com.tamina.cow4.events.NotificationBus;
import com.tamina.cow4.socket.message.StartBattle;
import com.tamina.cow4.socket.message.ErrorCode;
import com.tamina.cow4.socket.message.Error;
import nodejs.ws.WebSocket;

class Player extends Client {


    private var _socket:WebSocket;
    private var _proxy:PlayerProxy;

    public function new( c:WebSocket ) {
        super();
        _proxy = new PlayerProxy(c);
        _proxy.messageSignal.add(playerMessageHandler);
    }

    public function render(data:GameMap):Void{
        _proxy.sendMessage(new Render(data.toGameMapVO()));
    }

    private function playerMessageHandler(message:PlayerMessage):Void{
        switch( message.type){
            case StartBattle.MESSAGE_TYPE:
                nodejs.Console.info('StartBattle');
                var startBattle:StartBattle = cast message;
                var iaList = new Array<IA>();
                iaList.push(SocketServer.getIAById( cast startBattle.IA1));
                iaList.push(SocketServer.getIAById( cast startBattle.IA2) ) ;
                var notif = new StartBattleNotification(iaList,this);
                NotificationBus.instance.startBattle.dispatch(notif);
            default: _proxy.sendError( new Error( ErrorCode.UNKNOWN_MESSAGE,'type de message inconnu') );

        }
    }

}
