package com.tamina.cow4.config;
import com.tamina.cow4.model.vo.Position;
class Config {

    public static var ROOT_PATH:String='server/';
    public static inline var APP_PORT:Int = 3000;
    public static inline var SOCKET_PORT:Int = 8127;
    public static inline var WEB_SOCKET_PORT:Int = 8128;

    public static var PLAYER_1_START_POSITION:Position = new Position(0,0);
    public static var PLAYER_2_START_POSITION:Position = new Position(24,24);
    public static var SHEEP_START_POSITION:Position = new Position(12,12);


    private function new( ) {
    }
}
