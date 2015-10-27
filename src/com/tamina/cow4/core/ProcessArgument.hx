package com.tamina.cow4.core;
@:enum abstract ProcessArgument(String) from String to String  {
    var MODE = '-m';
    var SERVER = '-s';
    var HELP = '-?';
}
