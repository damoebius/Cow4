package com.tamina.cow4.socket.message;
@:enum abstract ErrorCode(Int) from Int to Int {
    var ALREADY_AUTH = 1;
    var UNKNOWN_MESSAGE = 2;
}
