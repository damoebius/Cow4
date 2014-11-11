package com.tamina.cow4.net.request;
import org.tamina.net.HTTPMethode;
import com.tamina.cow4.routes.Routes;
import org.tamina.net.BaseRequest;
class GetIAInfoList extends BaseRequest {


    public function new( ) {
        super(Routes.IAList, HTTPMethode.GET);
    }
}
