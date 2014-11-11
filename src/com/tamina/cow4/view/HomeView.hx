package com.tamina.cow4.view;

import com.tamina.cow4.view.component.IAItemRenderer;
import js.html.DivElement;
import com.tamina.cow4.model.IAInfo;
import com.tamina.cow4.net.ServerProxy;
import js.Browser;
import org.tamina.html.HTMLComponent;
@view('com/tamina/cow4/view/HomeView.html')
class HomeView extends HTMLComponent {

    private var _iaListContainer:DivElement;
    private var _proxy:ServerProxy;
    private var _iaList:Array<IAInfo>;

    public function new( containerId:String = "" ) {
        super(Browser.document.getElementById(containerId));
        _iaListContainer = cast Browser.document.getElementById(HomeViewElementId.IALIST_CONTAINER);
        _proxy = new ServerProxy();
        _proxy.getIAListComplete.add(getIACompleteHandler);
        _proxy.getIAList();
    }

    private function getIACompleteHandler(iaList:Array<IAInfo>):Void{
        _iaList = iaList;
      _iaListContainer.innerHTML = '';
        for(i in 0..._iaList.length){
            var item = new IAItemRenderer( _iaListContainer ,_iaList[i]);
        }
    }

}
