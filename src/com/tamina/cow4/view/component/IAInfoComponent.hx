package com.tamina.cow4.view.component;

import com.tamina.cow4.model.ItemType;
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

    @skinpart("")
    private var _profil:ImageElement;

    private var _data:IAInfo;
    private var _trapNumber:Int=0;
    private var _potionNumber:Int=0;
    private var _parfumNumber:Int=0;
    private var _playerIndex:Int=2;

    public function new(containerId:String) {
        super(Browser.document.getElementById(containerId));
        if(containerId == PlayViewElementId.IA2_CONTAINER){
            _playerIndex = 1;
        }
    }

    public function updateData(data:IAInfo):Void{
       _data  = data;
        _trapNumber = 0;
        _potionNumber = 0;
        _parfumNumber = 0;
        for(i in 0..._data.items.length){
            var item = _data.items[i];
            switch(item.type){
                case ItemType.POTION:
                _potionNumber++;
                case ItemType.PARFUM:
                    _parfumNumber++;
                case ItemType.TRAP:
                    _trapNumber++;
            }
        }
        _pm.innerHTML = '' + _data.pm;
        _name.innerHTML = _data.name;
        _logo.src = _data.avatar;
        _trap.innerHTML = '' + _trapNumber;
        _potion.innerHTML = '' + _potionNumber;
        _parfum.innerHTML = '' + _parfumNumber;
        _profil.innerHTML = '' + _data.profil;
        _profil.src = "/images/profil-"+_data.profil+"-"+_playerIndex+".svg";
    }
}
