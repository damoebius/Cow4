package com.tamina.cow4.socket.message;
import com.tamina.cow4.model.IAInfo;
import com.tamina.cow4.model.TurnAction;
class UpdateRender extends GameServerMessage {
    public static inline var MESSAGE_TYPE:String='updateRender';

    public var actions:Array<TurnAction>;
    public var ia:IAInfo;

    public function new() {
        super( MESSAGE_TYPE);
        this.actions = new Array<TurnAction>();
    }
}
