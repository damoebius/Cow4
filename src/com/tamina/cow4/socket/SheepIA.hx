package com.tamina.cow4.socket;

import org.tamina.net.URL;
import com.tamina.cow4.config.Config;
import nodejs.net.TCPSocket;

class SheepIA extends IA {

    private var _socket:TCPSocket;

    public function new():Void {
        _socket = new TCPSocket();
        _socket.connect(Config.SOCKET_PORT,'localhost');
        super(_socket);
        avatar = new URL("");
    }

    private function quit():Void{
        _socket.destroy();
    }
}
