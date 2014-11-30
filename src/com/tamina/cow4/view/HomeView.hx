package com.tamina.cow4.view;

import org.tamina.utils.UID;
import com.tamina.cow4.net.request.PlayRequestParam;
import js.html.ButtonElement;
import js.html.MouseEvent;
import org.tamina.events.html.MouseEventType;
import js.html.LinkElement;
import org.tamina.log.QuickLogger;
import haxe.Timer;
import com.tamina.cow4.view.component.IAItemRenderer;
import js.html.DivElement;
import com.tamina.cow4.model.IAInfo;
import com.tamina.cow4.net.ServerProxy;
import js.Browser;
import org.tamina.html.HTMLComponent;
@view('com/tamina/cow4/view/HomeView.html')
class HomeView extends HTMLComponent {

    private static inline var UPDATE_LIST_TIMER_DURATION:Int = 60 * 1000;

    private var _iaListContainer:DivElement;
    private var _proxy:ServerProxy;
    private var _iaList:Array<IAInfo>;
    private var _itemList:Array<IAItemRenderer>;
    private var _updateListTimer:Timer;
    private var _fightButton:ButtonElement;

    public function new( containerId:String = "" ) {
        super(Browser.document.getElementById(containerId));
        _iaListContainer = cast Browser.document.getElementById(HomeViewElementId.IALIST_CONTAINER);
        _fightButton = cast Browser.document.getElementById(HomeViewElementId.FIGHT_BUTTON);
        _fightButton.addEventListener(MouseEventType.CLICK,fightClickHandler);
        _itemList = new Array<IAItemRenderer>();
        _updateListTimer = new Timer(UPDATE_LIST_TIMER_DURATION);
        _proxy = new ServerProxy();
        _proxy.getIAListComplete.add(getIACompleteHandler);
        _updateListTimer.run = updateList_timerHandler;
        updateList_timerHandler();
    }

    private function updateList_timerHandler( ):Void {
        QuickLogger.info('update timer');
        _proxy.getIAList();
    }

    private function getIACompleteHandler( iaList:Array<IAInfo> ):Void {
        for ( i in 0..._itemList.length ) {
            _itemList[i].clickSignal.remove(itemClickHandler);
        }
        _itemList = new Array<IAItemRenderer>();
        _iaList = iaList;
        _iaListContainer.innerHTML = '';
        for ( i in 0..._iaList.length ) {
            var item = new IAItemRenderer( _iaListContainer, _iaList[i]);
            item.clickSignal.add(itemClickHandler);
            _itemList.push(item);
        }
    }

    private function fightClickHandler(evt:MouseEvent):Void{
        var selectedItems = new Array<IAItemRenderer>();
        for ( i in 0..._itemList.length ) {
            if(_itemList[i].selected){
                selectedItems.push(_itemList[i]);
            }
        }

        if(selectedItems.length >=2){
            Browser.window.location.href = "/PLAY?"+PlayRequestParam.IA1+"="+selectedItems[0].info.id + "&"+PlayRequestParam.IA2+"="+selectedItems[1].info.id+"&"+PlayRequestParam.GAME_ID+"="+UID.getUID();
        }
    }

    private function itemClickHandler( ):Void {
        var numSelectedItems = 0;
        for ( i in 0..._itemList.length ) {
            if(numSelectedItems == 2 && _itemList[i].selected == true){
                _itemList[i].selected = false;
            } else if(_itemList[i].selected == true) {
                numSelectedItems++;
            }
        }
    }

}
