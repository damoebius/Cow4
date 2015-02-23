package com.tamina.cow4.ui;
import createjs.easeljs.Text;
import createjs.easeljs.Shape;
import createjs.easeljs.Container;
class EndScreen extends Container {

    private var _background:Shape;
    private var _messageText:Text;
    private var _width:Int;
    private var _height:Int;

    public function new( width:Int,height:Int ) {
        super();
        _width = width;
        _height = height;
        _background = new Shape();
        _background.graphics.beginFill('#333333');
        _background.graphics.drawRect(0,0,_width,_height);
        _background.graphics.endFill();
        _background.alpha = 0.6;
        addChild(_background);
        _messageText = new Text();
        addChild(_messageText);
    }

    public function setMessage(message:String):Void{
        _messageText.text = message;
    }
}
