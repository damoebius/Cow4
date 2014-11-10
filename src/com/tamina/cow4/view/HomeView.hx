package com.tamina.cow4.view;

import js.Browser;
import org.tamina.html.HTMLComponent;
@view('com/tamina/cow4/view/HomeView.html')
class HomeView extends HTMLComponent {

    public function new( containerId:String = "" ) {
        super(Browser.document.getElementById(containerId));
    }

}
