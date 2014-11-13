package com.tamina.cow4.view;

import js.Browser;
import org.tamina.html.HTMLComponent;
@view('com/tamina/cow4/view/PlayView.html')
class PlayView extends HTMLComponent {
    public function new( containerId:String = "") {
        super(Browser.document.getElementById(containerId));
    }
}
