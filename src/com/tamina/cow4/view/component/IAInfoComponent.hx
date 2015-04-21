package com.tamina.cow4.view.component;

import js.html.ImageElement;
import com.tamina.cow4.model.IAInfo;
import js.Browser;
import js.html.Element;
import org.tamina.html.HTMLComponent;
@view('com/tamina/cow4/view/component/IAInfoComponent.html')

class IAInfoComponent extends HTMLComponent {

    @skinpart("")
    private var _logo:ImageElement;

    @skinpart("")
    private var _name:Element;

    @skinpart("")
    private var _pm:Element;

    @skinpart("")
    private var _potion:Element;

    @skinpart("")
    private var _trap:Element;

    @skinpart("")
    private var _parfum:Element;

    private var _data:IAInfo;

    public function new(containerId:String) {
        super(Browser.document.getElementById(containerId));
    }

    public function updateData(data:IAInfo):Void{
       _data  = data;
        _pm.innerHTML = 'PM : ' + _data.pm;
        _name.innerHTML = _data.name;
        _logo.src = _data.avatar;
        _trap.innerHTML = 'Trap : ' + _data.pm;
        _potion.innerHTML = 'Potion : ' + _data.pm;
        _parfum.innerHTML = 'Parfum : ' + _data.pm;
    }
}
