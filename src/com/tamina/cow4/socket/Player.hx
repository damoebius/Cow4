package com.tamina.cow4.socket;

import com.tamina.cow4.socket.message.StartQualif;
import com.tamina.cow4.socket.message.TurnResult;
import com.tamina.cow4.socket.message.UpdateRender;
import com.tamina.cow4.model.TurnAction;
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

    public function updateRender(turn:TurnResult):Void{
        var msg = new UpdateRender();
        msg.ia = turn.ia;
        msg.actions = turn.actions;
        _proxy.sendMessage(msg);
    }

    private function playerMessageHandler(message:PlayerMessage):Void{
        switch( message.type){
            case StartBattle.MESSAGE_TYPE:
                nodejs.Console.info('StartBattle');
                var startBattle:StartBattle = cast message;
                var iaList = new Array<IA>();
                var ia = SocketServer.getIAById( cast startBattle.IA1);
                if(ia != null){
                    iaList.push(ia);
                    var ia = SocketServer.getIAById( cast startBattle.IA2);
                    if(ia != null){
                        iaList.push(ia);
                        var notif = new StartBattleNotification(iaList,this);
                        NotificationBus.instance.startBattle.dispatch(notif);
                    } else {
                        nodejs.Console.error('ia 2 introuvable');
                        _proxy.sendError( new Error( ErrorCode.UNKNOWN_MESSAGE,'ia 1 introuvable') );
                    }
                }  else {
                   nodejs.Console.error('ia 1 introuvable');
                    _proxy.sendError( new Error( ErrorCode.UNKNOWN_MESSAGE,'ia1 introuvable') );
                }
            case StartQualif.MESSAGE_TYPE:
                nodejs.Console.info('StartBattle');
                var qualifBattle:StartQualif = cast message;
                var iaList = new Array<IA>();
                var ia = SocketServer.getIAByToken( qualifBattle.token);
                if(ia != null){
                    iaList.push(ia);
                    var notif = new StartBattleNotification(iaList,this);
                    NotificationBus.instance.startQualif.dispatch(notif);
                }  else {
                    nodejs.Console.error('ia 1 introuvable');
                    _proxy.sendError( new Error( ErrorCode.UNKNOWN_MESSAGE,'ia1 introuvable') );
                }
            default: _proxy.sendError( new Error( ErrorCode.UNKNOWN_MESSAGE,'type de message inconnu') );

        }
    }

}
