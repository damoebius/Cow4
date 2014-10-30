package com.tamina.cow4.events;
import msignal.Signal.Signal0;
class NotificationBus {

    public static var instance(get, null):NotificationBus;
    private static var _instance:NotificationBus;

    public var startUpdateDisplay:Signal0;
    public var stopUpdateDisplay:Signal0;

    private function new( ) {
        startUpdateDisplay = new Signal0();
        stopUpdateDisplay = new Signal0();
    }

    private static function get_instance():NotificationBus {
        if (_instance == null) {
            _instance = new NotificationBus();
        }
        return _instance;
    }
}
