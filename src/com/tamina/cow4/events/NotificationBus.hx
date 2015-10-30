package com.tamina.cow4.events;
import com.tamina.cow4.socket.message.StartBattle;
import msignal.Signal;
class NotificationBus {

    public static var instance(get, null):NotificationBus;
    private static var _instance:NotificationBus;

    public var startUpdateDisplay:Signal0;
    public var stopUpdateDisplay:Signal0;
    public var startBattle:Signal1<StartBattleNotification>;
    public var startQualif:Signal1<StartBattleNotification>;

    private function new( ) {
        startUpdateDisplay = new Signal0();
        stopUpdateDisplay = new Signal0();
        startBattle = new Signal1<StartBattleNotification>();
        startQualif = new Signal1<StartBattleNotification>();
    }

    private static function get_instance():NotificationBus {
        if (_instance == null) {
            _instance = new NotificationBus();
        }
        return _instance;
    }
}
