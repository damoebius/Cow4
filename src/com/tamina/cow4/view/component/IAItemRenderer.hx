package com.tamina.cow4.view.component;
import msignal.Signal.Signal0;
import js.html.MouseEvent;
import org.tamina.events.html.MouseEventType;
import com.tamina.cow4.model.IAInfo;
import js.html.InputElement;
import js.html.DivElement;
import js.html.ImageElement;
import org.tamina.html.HTMLComponent;
import js.html.Element;
@view('com/tamina/cow4/view/component/IAItemRenderer.html')
class IAItemRenderer extends HTMLComponent {

    private var _image:ImageElement;
    private var _name:DivElement;
    private var _button:InputElement;

    private var _info:IAInfo;

    public var selected(get,set):Bool;
    public var info(get,null):IAInfo;
    public var clickSignal:Signal0;

    public function new( parent:Element, info:IAInfo ) {
        _info = info;
        clickSignal = new Signal0();
        super();
        addToElement(parent);
    }

    private function get_info():IAInfo{
        return _info;
    }

    private function get_selected():Bool{
        return _button.checked;
    }

    private function set_selected(value:Bool):Bool{
        _button.checked = value;
        return _button.checked;
    }

    override private function initContent():Void{
        _image = cast _tempElement.getElementsByClassName(IAItemRendererClassId.AVATAR)[0];
        _image.src = _info.avatar;

        _name = cast _tempElement.getElementsByClassName(IAItemRendererClassId.NAME)[0];
        _name.innerHTML = _info.name;

        _button = cast _tempElement.getElementsByClassName(IAItemRendererClassId.BUTTON)[0];
        _button.addEventListener(MouseEventType.CLICK, clickHandler);
    }

    private function clickHandler(evt:MouseEvent):Void{
       clickSignal.dispatch();
    }
}
