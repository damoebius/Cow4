package com.tamina.cow4.net;
import js.html.ProgressEvent;
import org.tamina.log.QuickLogger;
import msignal.Signal.Signal1;
import haxe.Json;
import js.html.XMLHttpRequest;
import com.tamina.cow4.net.request.GetIAInfoList;
import com.tamina.cow4.model.IAInfo;
class ServerProxy {

    public var getIAListComplete:Signal1<Array<IAInfo>>;

    public function new( ) {
        getIAListComplete = new Signal1<Array<IAInfo>>();
    }

    public function getIAList( ):Void {
        QuickLogger.info('retreiving AIList');
        var request = new GetIAInfoList();
        request.completeSignal.add(getIaListSuccessHandler);
        request.send();

    }

    private function getIaListSuccessHandler( requestResult:ProgressEvent ):Void {
        QuickLogger.info('iaList complete');
        var req:XMLHttpRequest = cast requestResult.target;
        var result:Array<IAInfo> = cast Json.parse(req.response);
        getIAListComplete.dispatch(result);
    }
}
