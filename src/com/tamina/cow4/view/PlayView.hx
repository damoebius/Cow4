package com.tamina.cow4.view;

import haxe.Timer;
import com.tamina.cow4.socket.message.UpdateRender;
import com.tamina.cow4.model.GameMap;
import com.tamina.cow4.socket.message.Render;
import com.tamina.cow4.socket.message.GameServerMessage;
import com.tamina.cow4.socket.PlayerServerProxy;
import org.tamina.net.URL;
import com.tamina.cow4.socket.message.StartBattle;
import com.tamina.cow4.config.Config;
import com.tamina.cow4.events.WebSocketEvent;
import com.tamina.cow4.net.request.PlayRequestParam;
import js.html.Event;
import js.html.WebSocket;
import com.tamina.cow4.ui.PlayerMapUI;
import com.tamina.cow4.ui.CellSprite;
import com.tamina.cow4.data.Mock;
import com.tamina.cow4.ui.MapUI;
import org.tamina.log.QuickLogger;
import js.html.CanvasElement;
import js.html.DivElement;
import js.Browser;
import org.tamina.html.HTMLComponent;
@view('com/tamina/cow4/view/PlayView.html')
class PlayView extends HTMLComponent {

    private static inline var APPLICATION_WIDTH:Int = 864;
    private static inline var APPLICATION_HEIGHT:Int = 864;

    private var _gameContainer:DivElement;
    private var _applicationCanvas:CanvasElement;
    private var _stage:PlayerMapUI;
    private var _socket:WebSocket;
    private var _proxy:PlayerServerProxy;
    private var _updatePool:Array<UpdateRender>;

    public function new( containerId:String = "" ) {
        super(Browser.document.getElementById(containerId));
        _updatePool = new Array<UpdateRender>();
        _gameContainer = cast Browser.document.getElementById(PlayViewElementId.GAME_CONTAINER);
        _applicationCanvas = cast Browser.document.createCanvasElement();
        _gameContainer.appendChild(_applicationCanvas);
        _applicationCanvas.width = APPLICATION_WIDTH;
        _applicationCanvas.height = APPLICATION_HEIGHT;
        QuickLogger.info("canvas initialized");
        _stage = new PlayerMapUI(_applicationCanvas);
        _socket = new WebSocket( 'ws://localhost:' + Config.WEB_SOCKET_PORT);

        _socket.addEventListener('open', socketOpenHandler);

        _proxy = new PlayerServerProxy(_socket);
        _proxy.messageSignal.add(serverMessageHandler);

        var t = new Timer(500);
        t.run = updateHandler;

    }

    private function socketOpenHandler( evt:Dynamic ):Void {
        QuickLogger.info('Socket Open');
        var url = new URL(Browser.document.URL);
        _proxy.sendMessage(new StartBattle( url.parameters.get(PlayRequestParam.GAME_ID), url.parameters.get(PlayRequestParam.IA1), url.parameters.get(PlayRequestParam.IA2) ));
    }

    private function updateHandler( ):Void {
        if ( _updatePool.length > 0 ) {
            var msg = _updatePool.shift();
            _stage.updateMap(msg.ia, msg.actions);
        }
    }

    private function serverMessageHandler( message:GameServerMessage ):Void {
        switch( message.type){
            case Render.MESSAGE_TYPE:
                var render:Render = cast message;
                _stage.data = GameMap.fromGameMapVO(render.map);
            case UpdateRender.MESSAGE_TYPE:
                var update:UpdateRender = cast message;
                _updatePool.push(update);
//_stage.updateMap(update.ia,update.actions);

            default: QuickLogger.error('message inconnu');

        }
    }

}
