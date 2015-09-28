package com.tamina.cow4.view.component;

import com.tamina.cow4.model.Action;
import com.tamina.cow4.socket.message.order.EndOrder;
import org.tamina.html.HTMLComponent;
import js.html.Element;
import js.html.ImageElement;
import js.Browser;
import com.tamina.cow4.model.IAInfo;
@view('com/tamina/cow4/view/component/EndScreen.html')
class EndScreen  extends HTMLComponent{

    @skinpart("")
    private var _logo:ImageElement;

    @skinpart("")
    private var _name:Element;

    @skinpart("")
    private var _message:Element;

    @skinpart("")
    private var _title:Element;

    private var _data:IAInfo;

    public function new(containerId:String ) {
        super(Browser.document.getElementById(containerId));
    }

    public function updateData(data:IAInfo, message:EndOrder):Void{
        _data  = data;
        _name.innerHTML = _data.name;
        _logo.src = _data.avatar;
        _message.innerHTML = message.message;
        if(message.type == Action.FAIL){
            _title.innerHTML = 'ECHEC';
        }
    }
}
