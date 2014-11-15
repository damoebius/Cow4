package com.tamina.cow4.view;

import com.tamina.cow4.ui.PlayerMapUI;
import com.tamina.cow4.ui.CellSprite;
import com.tamina.cow4.data.Mock;
import com.tamina.cow4.ui.MapUI;
import org.tamina.log.QuickLogger;
import js.html.CanvasElement;
import js.html.DivElement;
import js.Browser;
import org.tamina.html.HTMLComponent;
@view('com/tamina/cow4/view/PlayView.html')
class PlayView extends HTMLComponent {

    private static inline var APPLICATION_WIDTH:Int=720;
    private static inline var APPLICATION_HEIGHT:Int=720;

    private var _gameContainer:DivElement;
    private var _applicationCanvas:CanvasElement;
    private var _stage:PlayerMapUI;

    public function new( containerId:String = "") {
        super(Browser.document.getElementById(containerId));
        _gameContainer = cast Browser.document.getElementById(PlayViewElementId.GAME_CONTAINER);
        _applicationCanvas = cast Browser.document.createCanvasElement();
        _gameContainer.appendChild(_applicationCanvas);
        _applicationCanvas.width = APPLICATION_WIDTH;
        _applicationCanvas.height = APPLICATION_HEIGHT;
        QuickLogger.info("canvas initialized");
        _stage = new PlayerMapUI(_applicationCanvas);
        _stage.data = Mock.instance.getTestMap(25, 25);
    }
}
