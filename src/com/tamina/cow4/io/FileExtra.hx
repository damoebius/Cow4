package com.tamina.cow4.io;

/**
 * Class that gives access to the 'fs-extra' module.
 */
@:native("(require('fs-extra'))")
extern class FileExtra
{
    static function removeSync(path:String):Void;
    static function writeJsonSync(fileName:String,object:Dynamic,?callBack:String->Void):Void;
    static function readJsonSync(fileName:String):Dynamic;
    static function copySync(source:String,destination:String,?callBack:String->Void):Void;
}
