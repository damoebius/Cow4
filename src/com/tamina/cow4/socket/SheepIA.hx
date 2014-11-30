package com.tamina.cow4.socket;

import org.tamina.net.URL;
import com.tamina.cow4.config.Config;
import nodejs.net.TCPSocket;

class SheepIA extends IA {

    public function new():Void {
        super(new TCPSocket());
        _socket.connect(Config.SOCKET_PORT,'localhost');
        avatar = new URL("");
    }

    private function quit():Void{
        _socket.destroy();
    }
}
