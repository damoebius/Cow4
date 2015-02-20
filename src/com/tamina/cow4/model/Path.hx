package com.tamina.cow4.model;


class Path {

    public var length(get, null):Int;

    private var _content:Array<Cell>;

    public function new(?content:Array<Cell>) {
        if (content == null) {
            _content = new Array<Cell>();
        } else {
            _content = content;
        }
    }

    public static function contains(item:Cell, list:Array<Path>):Bool{
        var result:Bool = false;
        for(i in 0...list.length){
            if( list[i].hasItem(item)){
                result = true;
                break;
            }
        }
        return result;
    }

    public function getLastItem():Cell {
        return _content[_content.length - 1];
    }

    public function hasItem(item:Cell):Bool {
        var result = false;
        for (i in 0..._content.length) {
            if (item.id == _content[i].id) {
                result = true;
                break;
            }
        }
        return result;
    }

    public function getItemAt(index:Int):Cell {
        return _content[index];
    }

    public function push(item:Cell):Void {
        _content.push(item);
    }

    public function remove(item:Cell):Bool {
        return _content.remove(item);
    }

    public function copy():Path {
        return new Path(_content.copy());
    }

    private function get_length():Int {
        return _content.length;
    }
}
