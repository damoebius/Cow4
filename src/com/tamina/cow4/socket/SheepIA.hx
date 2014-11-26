package com.tamina.cow4.socket;

import com.tamina.cow4.config.Config;
import nodejs.net.TCPSocket;
class SheepIA extends IA {

    public function new():Void {
        super(new TCPSocket());
        _socket.connect(Config.SOCKET_PORT,'localhost');
    }

    private function quit():Void{
        _socket.destroy();
    }
}
