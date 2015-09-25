(function (console) { "use strict";
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.indexOf = function(a,obj,i) {
	var len = a.length;
	if(i < 0) {
		i += len;
		if(i < 0) i = 0;
	}
	while(i < len) {
		if(a[i] === obj) return i;
		i++;
	}
	return -1;
};
HxOverrides.remove = function(a,obj) {
	var i = HxOverrides.indexOf(a,obj,0);
	if(i == -1) return false;
	a.splice(i,1);
	return true;
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.isFunction = function(f) {
	return typeof(f) == "function" && !(f.__name__ || f.__ename__);
};
Reflect.compareMethods = function(f1,f2) {
	if(f1 == f2) return true;
	if(!Reflect.isFunction(f1) || !Reflect.isFunction(f2)) return false;
	return f1.scope == f2.scope && f1.method == f2.method && f1.method != null;
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var com_tamina_cow4_IADemoApp = function() {
	this._mode = com_tamina_cow4_ia_Mode.GET_A_TRAP;
	this._socket = new (require('net').Socket)();
	this._socket.connect(8127,"localhost",$bind(this,this.connectionHandler));
	this._currentDirection = 1;
};
com_tamina_cow4_IADemoApp.__name__ = true;
com_tamina_cow4_IADemoApp.main = function() {
	com_tamina_cow4_IADemoApp._app = new com_tamina_cow4_IADemoApp();
};
com_tamina_cow4_IADemoApp.prototype = {
	connectionHandler: function() {
		console.log("CONNECTED <br/> Sending Auth message...");
		this._proxy = new com_tamina_cow4_socket_GameServerProxy(this._socket);
		this._proxy.messageSignal.add($bind(this,this.serverMessageHandler));
		this._proxy.closeSignal.add($bind(this,this.quit));
		this._proxy.sendMessage(new com_tamina_cow4_socket_message_Authenticate("DemoIA " + new Date().getTime(),"http://3.bp.blogspot.com/_XMH6qEyqIPU/S9YSkGiuZyI/AAAAAAAAB4g/8PoYjbZcNfY/s400/sakura2.jpg","tokendemo",1));
		haxe_Timer.delay($bind(this,this.quit),600000);
	}
	,serverMessageHandler: function(message) {
		console.info("[TestIA] Data recevied ");
		if(message.type != null) {
			var _g = message.type;
			switch(_g) {
			case "id":
				var idMessage = message;
				console.info("[TestIA] identification " + Std.string(idMessage));
				this._id = idMessage.id;
				break;
			case "error":
				var errorMessage = message;
				console.info("[TestIA] ERROR " + errorMessage.message);
				break;
			case "getTurnOrder":
				console.info("demande de tour");
				var getTurnOrder = message;
				this.processTurn(getTurnOrder);
				break;
			default:
				console.warn("[TestIA] type de message inconnu ");
			}
		} else console.warn("[TestIA]  MESSAGE inconnu ");
	}
	,processTurn: function(data) {
		var result = new com_tamina_cow4_socket_message_TurnResult();
		try {
			var gameData = com_tamina_cow4_model_GameMap.fromGameMapVO(data.data);
			console.log("turn : " + gameData.currentTurn);
			if(gameData.currentTurn <= 1) this._mode = com_tamina_cow4_ia_Mode.GET_A_POTION;
			var myIa = gameData.getIAById(this._id);
			console.log("pm : " + myIa.pm);
			var currentCell = gameData.getCellByIA(this._id);
			var targetCell;
			if(this._mode != com_tamina_cow4_ia_Mode.CATCH_THE_CHICKEN) {
				console.log("mode get an item");
				var c1 = null;
				var c2 = null;
				var _g = this._mode;
				switch(_g[1]) {
				case 0:
					console.log("mode get a potion");
					c1 = gameData.getCellAt(com_tamina_cow4_model_ItemPosition.POTION_TOP.x,com_tamina_cow4_model_ItemPosition.POTION_TOP.y);
					c2 = gameData.getCellAt(com_tamina_cow4_model_ItemPosition.POTION_BOTTOM.x,com_tamina_cow4_model_ItemPosition.POTION_BOTTOM.y);
					break;
				case 1:
					console.log("mode get a TRAP");
					c1 = gameData.getCellAt(com_tamina_cow4_model_ItemPosition.TRAP_TOP.x,com_tamina_cow4_model_ItemPosition.TRAP_TOP.y);
					c2 = gameData.getCellAt(com_tamina_cow4_model_ItemPosition.TRAP_BOTTOM.x,com_tamina_cow4_model_ItemPosition.TRAP_BOTTOM.y);
					break;
				case 2:
					c1 = gameData.getCellAt(com_tamina_cow4_model_ItemPosition.PARFUM_TOP.x,com_tamina_cow4_model_ItemPosition.PARFUM_TOP.y);
					c2 = gameData.getCellAt(com_tamina_cow4_model_ItemPosition.PARFUM_BOTTOM.x,com_tamina_cow4_model_ItemPosition.PARFUM_BOTTOM.y);
					break;
				default:
					console.log("unkown mode");
					c1 = gameData.getCellAt(com_tamina_cow4_model_ItemPosition.POTION_TOP.x,com_tamina_cow4_model_ItemPosition.POTION_TOP.y);
					c2 = gameData.getCellAt(com_tamina_cow4_model_ItemPosition.POTION_BOTTOM.x,com_tamina_cow4_model_ItemPosition.POTION_BOTTOM.y);
				}
				if(currentCell.id == c1.id || currentCell.id == c2.id) {
					console.log("item found");
					this._mode = com_tamina_cow4_ia_Mode.CATCH_THE_CHICKEN;
					var order = new com_tamina_cow4_socket_message_order_GetItemOrder();
					result.actions.push(order);
					targetCell = gameData.getCellByIA(gameData.iaList[2].id);
				} else {
					var p1 = com_tamina_cow4_utils_GameUtils.getPath(currentCell,c1,gameData);
					var p2 = com_tamina_cow4_utils_GameUtils.getPath(currentCell,c2,gameData);
					targetCell = c1;
					if(p1 != null && p2 != null && p1.get_length() > p2.get_length()) targetCell = c2;
				}
			} else {
				console.log("---------------------------> " + myIa.items.length);
				if(myIa.items.length > 0) {
					console.log("---------------------------> POTION USED");
					var useItemOrder = new com_tamina_cow4_socket_message_order_UseItemOrder(myIa.items[0]);
					result.actions.push(useItemOrder);
				}
				targetCell = gameData.getCellByIA(gameData.iaList[2].id);
			}
			var path = com_tamina_cow4_utils_GameUtils.getPath(currentCell,targetCell,gameData);
			if(path != null) {
				var _g1 = 0;
				var _g2 = myIa.pm;
				while(_g1 < _g2) {
					var i = _g1++;
					console.log(currentCell.id + " -> " + path.getItemAt(i + 1).id);
					var order1 = new com_tamina_cow4_socket_message_order_MoveOrder(path.getItemAt(i + 1));
					result.actions.push(order1);
				}
			} else console.log("path null : " + currentCell.id + "//" + targetCell.id);
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				console.log("error : " + e.message);
			} else throw(e);
		}
		var timeout = Math.round(Math.random()) == 0;
		this._proxy.sendMessage(result);
	}
	,quit: function() {
		this._socket.destroy();
		nodejs_NodeJS.get_process().exit(0);
	}
	,__class__: com_tamina_cow4_IADemoApp
};
var com_tamina_cow4_config_Config = function() {
};
com_tamina_cow4_config_Config.__name__ = true;
com_tamina_cow4_config_Config.prototype = {
	__class__: com_tamina_cow4_config_Config
};
var com_tamina_cow4_core_PathFinder = function() {
	this._inc = 0;
	this._paths = [];
};
com_tamina_cow4_core_PathFinder.__name__ = true;
com_tamina_cow4_core_PathFinder.prototype = {
	getPath: function(fromCell,toCell,map) {
		this._map = map;
		this._source = fromCell;
		this._target = toCell;
		var p = new com_tamina_cow4_model_Path();
		p.push(this._source);
		this._paths.push(p);
		var startDate = new Date();
		this.find();
		return this._result;
	}
	,find: function() {
		var result = false;
		this._inc++;
		var paths = this._paths.slice();
		var _g1 = 0;
		var _g = paths.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.checkPath(paths[i])) {
				result = true;
				break;
			}
		}
		if(!result && this._inc < 500) this.find();
	}
	,checkPath: function(target) {
		var result = false;
		var currentCell = target.getLastItem();
		var _g1 = 0;
		var _g = currentCell.getNeighboors().length;
		while(_g1 < _g) {
			var i = _g1++;
			var nextCell = currentCell.getNeighboors()[i];
			if(nextCell.id == this._target.id) {
				result = true;
				var p = target.copy();
				p.push(nextCell);
				this._result = p;
				break;
			} else if(!com_tamina_cow4_model_Path.contains(nextCell,this._paths)) {
				var p1 = target.copy();
				p1.push(nextCell);
				this._paths.push(p1);
			}
		}
		HxOverrides.remove(this._paths,target);
		return result;
	}
	,__class__: com_tamina_cow4_core_PathFinder
};
var com_tamina_cow4_ia_Mode = { __ename__ : true, __constructs__ : ["GET_A_POTION","GET_A_TRAP","GET_A_PARFUM","CATCH_THE_CHICKEN"] };
com_tamina_cow4_ia_Mode.GET_A_POTION = ["GET_A_POTION",0];
com_tamina_cow4_ia_Mode.GET_A_POTION.__enum__ = com_tamina_cow4_ia_Mode;
com_tamina_cow4_ia_Mode.GET_A_TRAP = ["GET_A_TRAP",1];
com_tamina_cow4_ia_Mode.GET_A_TRAP.__enum__ = com_tamina_cow4_ia_Mode;
com_tamina_cow4_ia_Mode.GET_A_PARFUM = ["GET_A_PARFUM",2];
com_tamina_cow4_ia_Mode.GET_A_PARFUM.__enum__ = com_tamina_cow4_ia_Mode;
com_tamina_cow4_ia_Mode.CATCH_THE_CHICKEN = ["CATCH_THE_CHICKEN",3];
com_tamina_cow4_ia_Mode.CATCH_THE_CHICKEN.__enum__ = com_tamina_cow4_ia_Mode;
var com_tamina_cow4_model_Cell = function() {
	this.hasTrap = false;
	this.id = org_tamina_utils_UID.getUID();
	this.changeSignal = new msignal_Signal0();
};
com_tamina_cow4_model_Cell.__name__ = true;
com_tamina_cow4_model_Cell.fromCellVO = function(value) {
	var result = new com_tamina_cow4_model_Cell();
	result.id = value.id;
	result.set_occupant(value.occupant);
	result.item = value.item;
	return result;
};
com_tamina_cow4_model_Cell.prototype = {
	get_occupant: function() {
		return this._occupant;
	}
	,set_occupant: function(value) {
		this._occupant = value;
		return this._occupant;
	}
	,toCellVO: function() {
		var result = new com_tamina_cow4_model_vo_CellVO(this.id,this.get_occupant());
		if(null != result.top) result.top = this.get_top().id;
		if(null != result.bottom) result.bottom = this.get_bottom().id;
		if(null != result.left) result.left = this.get_left().id;
		if(null != result.right) result.right = this.get_right().id;
		result.item = this.item;
		return result;
	}
	,getNeighboors: function() {
		var result = [];
		if(this.get_top() != null) result.push(this.get_top());
		if(this.get_bottom() != null) result.push(this.get_bottom());
		if(this.get_left() != null) result.push(this.get_left());
		if(this.get_right() != null) result.push(this.get_right());
		return result;
	}
	,getNeighboorById: function(cellId) {
		var result = null;
		if(this.get_top() != null && this.get_top().id == cellId) result = this.get_top(); else if(this.get_bottom() != null && this.get_bottom().id == cellId) result = this.get_bottom(); else if(this.get_left() != null && this.get_left().id == cellId) result = this.get_left(); else if(this.get_right() != null && this.get_right().id == cellId) result = this.get_right();
		return result;
	}
	,get_top: function() {
		return this._top;
	}
	,set_top: function(value) {
		if(value != this._top) {
			this._top = value;
			this.changeSignal.dispatch();
		}
		return this._top;
	}
	,get_bottom: function() {
		return this._bottom;
	}
	,set_bottom: function(value) {
		if(value != this._bottom) {
			this._bottom = value;
			this.changeSignal.dispatch();
		}
		return this._bottom;
	}
	,get_left: function() {
		return this._left;
	}
	,set_left: function(value) {
		if(value != this._left) {
			this._left = value;
			this.changeSignal.dispatch();
		}
		return this._left;
	}
	,get_right: function() {
		return this._right;
	}
	,set_right: function(value) {
		if(value != this._right) {
			this._right = value;
			this.changeSignal.dispatch();
		}
		return this._right;
	}
	,__class__: com_tamina_cow4_model_Cell
};
var com_tamina_cow4_model_GameMap = function() {
	this.currentTurn = 0;
	this.cells = [];
	this.iaList = [];
};
com_tamina_cow4_model_GameMap.__name__ = true;
com_tamina_cow4_model_GameMap.fromGameMapVO = function(value) {
	var result = new com_tamina_cow4_model_GameMap();
	result.id = value.id;
	result.iaList = value.iaList;
	result.currentTurn = value.currentTurn;
	var _g1 = 0;
	var _g = value.cells.length;
	while(_g1 < _g) {
		var i = _g1++;
		result.cells.push([]);
		var _g3 = 0;
		var _g2 = value.cells[i].length;
		while(_g3 < _g2) {
			var j = _g3++;
			result.cells[i].push(com_tamina_cow4_model_Cell.fromCellVO(value.cells[i][j]));
		}
	}
	var _g11 = 0;
	var _g4 = result.cells.length;
	while(_g11 < _g4) {
		var i1 = _g11++;
		var _g31 = 0;
		var _g21 = result.cells[i1].length;
		while(_g31 < _g21) {
			var j1 = _g31++;
			var cell = result.cells[i1][j1];
			var cellVO = value.cells[i1][j1];
			if(cellVO.top != null) cell.set_top(result.cells[i1 - 1][j1]);
			if(cellVO.bottom != null) cell.set_bottom(result.cells[i1 + 1][j1]);
			if(cellVO.left != null) cell.set_left(result.cells[i1][j1 - 1]);
			if(cellVO.right != null) cell.set_right(result.cells[i1][j1 + 1]);
		}
	}
	return result;
};
com_tamina_cow4_model_GameMap.prototype = {
	getCellPosition: function(cell) {
		var result = null;
		var _g1 = 0;
		var _g = this.cells.length;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0;
			var _g2 = this.cells[i].length;
			while(_g3 < _g2) {
				var j = _g3++;
				if(this.cells[i][j].id == cell.id) {
					result = new org_tamina_geom_Point(j,i);
					break;
				}
			}
		}
		return result;
	}
	,getCellById: function(cellId) {
		var result = null;
		var _g1 = 0;
		var _g = this.cells.length;
		while(_g1 < _g) {
			var i = _g1++;
			var _g3 = 0;
			var _g2 = this.cells[i].length;
			while(_g3 < _g2) {
				var j = _g3++;
				if(this.cells[i][j].id == cellId) {
					result = this.cells[i][j];
					break;
				}
			}
		}
		return result;
	}
	,getCellAt: function(column,row) {
		return this.cells[row][column];
	}
	,getIAById: function(id) {
		var result = null;
		var _g1 = 0;
		var _g = this.iaList.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.iaList[i].id == id) {
				result = this.iaList[i];
				break;
			}
		}
		return result;
	}
	,getCellByIA: function(id) {
		var result = null;
		var _g1 = 0;
		var _g = this.cells.length;
		while(_g1 < _g) {
			var i = _g1++;
			var columns = this.cells[i];
			var _g3 = 0;
			var _g2 = columns.length;
			while(_g3 < _g2) {
				var j = _g3++;
				var cell = columns[j];
				if(cell.get_occupant() != null && cell.get_occupant().id == id) {
					result = cell;
					break;
				}
			}
		}
		return result;
	}
	,toGameMapVO: function() {
		var result = new com_tamina_cow4_model_vo_GameMapVO();
		result.id = this.id;
		result.iaList = this.iaList;
		result.currentTurn = this.currentTurn;
		var _g1 = 0;
		var _g = this.cells.length;
		while(_g1 < _g) {
			var i = _g1++;
			result.cells.push([]);
			var _g3 = 0;
			var _g2 = this.cells[i].length;
			while(_g3 < _g2) {
				var j = _g3++;
				result.cells[i].push(this.cells[i][j].toCellVO());
			}
		}
		var _g11 = 0;
		var _g4 = this.cells.length;
		while(_g11 < _g4) {
			var i1 = _g11++;
			var _g31 = 0;
			var _g21 = this.cells[i1].length;
			while(_g31 < _g21) {
				var j1 = _g31++;
				var cell = this.cells[i1][j1];
				var cellVO = result.cells[i1][j1];
				if(cell.get_top() != null) cellVO.top = result.cells[i1 - 1][j1].id;
				if(cell.get_bottom() != null) cellVO.bottom = result.cells[i1 + 1][j1].id;
				if(cell.get_left() != null) cellVO.left = result.cells[i1][j1 - 1].id;
				if(cell.get_right() != null) cellVO.right = result.cells[i1][j1 + 1].id;
			}
		}
		return result;
	}
	,clone: function() {
		var vo = this.toGameMapVO();
		return com_tamina_cow4_model_GameMap.fromGameMapVO(vo);
	}
	,__class__: com_tamina_cow4_model_GameMap
};
var com_tamina_cow4_model_IAInfo = function(id,name,avatar,pm,items,invisibilityDuration,profil) {
	this.invisibilityDuration = 0;
	this.pm = 1;
	this.id = id;
	this.name = name;
	this.avatar = avatar;
	this.pm = pm;
	this.items = [];
	this.invisibilityDuration = invisibilityDuration;
	this.profil = profil;
	var _g1 = 0;
	var _g = items.length;
	while(_g1 < _g) {
		var i = _g1++;
		this.items.push(items[i]);
	}
};
com_tamina_cow4_model_IAInfo.__name__ = true;
com_tamina_cow4_model_IAInfo.prototype = {
	__class__: com_tamina_cow4_model_IAInfo
};
var com_tamina_cow4_model_Item = function(type) {
	this.type = type;
};
com_tamina_cow4_model_Item.__name__ = true;
com_tamina_cow4_model_Item.prototype = {
	__class__: com_tamina_cow4_model_Item
};
var org_tamina_geom_Point = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
org_tamina_geom_Point.__name__ = true;
org_tamina_geom_Point.prototype = {
	__class__: org_tamina_geom_Point
};
var com_tamina_cow4_model_ItemPosition = function() { };
com_tamina_cow4_model_ItemPosition.__name__ = true;
var com_tamina_cow4_model_Path = function(content) {
	if(content == null) this._content = []; else this._content = content;
};
com_tamina_cow4_model_Path.__name__ = true;
com_tamina_cow4_model_Path.contains = function(item,list) {
	var result = false;
	var _g1 = 0;
	var _g = list.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(list[i].hasItem(item)) {
			result = true;
			break;
		}
	}
	return result;
};
com_tamina_cow4_model_Path.prototype = {
	getLastItem: function() {
		return this._content[this._content.length - 1];
	}
	,hasItem: function(item) {
		var result = false;
		var _g1 = 0;
		var _g = this._content.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(item.id == this._content[i].id) {
				result = true;
				break;
			}
		}
		return result;
	}
	,getItemAt: function(index) {
		return this._content[index];
	}
	,push: function(item) {
		this._content.push(item);
	}
	,remove: function(item) {
		return HxOverrides.remove(this._content,item);
	}
	,copy: function() {
		return new com_tamina_cow4_model_Path(this._content.slice());
	}
	,get_length: function() {
		return this._content.length;
	}
	,__class__: com_tamina_cow4_model_Path
};
var com_tamina_cow4_model_TurnAction = function(type) {
	this.type = type;
};
com_tamina_cow4_model_TurnAction.__name__ = true;
com_tamina_cow4_model_TurnAction.prototype = {
	__class__: com_tamina_cow4_model_TurnAction
};
var com_tamina_cow4_model_vo_CellVO = function(id,occupant) {
	this.id = id;
	this.occupant = occupant;
};
com_tamina_cow4_model_vo_CellVO.__name__ = true;
com_tamina_cow4_model_vo_CellVO.prototype = {
	__class__: com_tamina_cow4_model_vo_CellVO
};
var com_tamina_cow4_model_vo_GameMapVO = function() {
	this.currentTurn = 0;
	this.cells = [];
	this.iaList = [];
};
com_tamina_cow4_model_vo_GameMapVO.__name__ = true;
com_tamina_cow4_model_vo_GameMapVO.prototype = {
	__class__: com_tamina_cow4_model_vo_GameMapVO
};
var com_tamina_cow4_socket_Proxy = function(type) {
	this._type = "proxy";
	this._data = "";
	this._type = type;
	this.errorSignal = new msignal_Signal0();
	this.closeSignal = new msignal_Signal0();
	this.messageSignal = new msignal_Signal1();
};
com_tamina_cow4_socket_Proxy.__name__ = true;
com_tamina_cow4_socket_Proxy.prototype = {
	sendError: function(error) {
	}
	,socketServer_openHandler: function(c) {
		console.log("[" + this._type + "] new connection");
	}
	,socketServer_errorHandler: function(c) {
		console.log("[" + this._type + "] ERROR " + Std.string(c));
		this.errorSignal.dispatch();
	}
	,socketServer_closeHandler: function(c) {
		console.log("[" + this._type + "] connection close");
		this.closeSignal.dispatch();
	}
	,socketServer_dataHandler: function(data) {
		this._data += data.toString();
		if(this._data.indexOf("#end#") >= 0) {
			this._data = this._data.split("#end#").join("");
			if(this._data.length > 0) this.socketServer_endHandler(); else console.log("message vide: " + data);
		}
	}
	,socketServer_endHandler: function() {
		var message = null;
		try {
			message = JSON.parse(this._data);
			this._data = "";
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				console.log("[" + this._type + "] impossible de parser le message json : " + e.message);
				this.sendError(new com_tamina_cow4_socket_message_Error(2,"message inconnu"));
			} else throw(e);
		}
		if(message != null && message.type != null) this.messageSignal.dispatch(message); else this.sendError(new com_tamina_cow4_socket_message_Error(2,"message inconnu"));
	}
	,__class__: com_tamina_cow4_socket_Proxy
};
var com_tamina_cow4_socket_GameServerProxy = function(c) {
	com_tamina_cow4_socket_Proxy.call(this,"game server proxy");
	this._socket = c;
	this._socket.on(nodejs_net_TCPSocketEventType.Connect,$bind(this,this.socketServer_openHandler));
	this._socket.on(nodejs_net_TCPSocketEventType.Close,$bind(this,this.socketServer_closeHandler));
	this._socket.on(nodejs_net_TCPSocketEventType.Error,$bind(this,this.socketServer_errorHandler));
	this._socket.on(nodejs_net_TCPSocketEventType.Data,$bind(this,this.socketServer_dataHandler));
};
com_tamina_cow4_socket_GameServerProxy.__name__ = true;
com_tamina_cow4_socket_GameServerProxy.__super__ = com_tamina_cow4_socket_Proxy;
com_tamina_cow4_socket_GameServerProxy.prototype = $extend(com_tamina_cow4_socket_Proxy.prototype,{
	sendMessage: function(message) {
		try {
			this._socket.write(message.serialize());
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				console.log("ERROR : " + e.message);
			} else throw(e);
		}
	}
	,sendError: function(error) {
	}
	,__class__: com_tamina_cow4_socket_GameServerProxy
});
var com_tamina_cow4_socket_message_SocketMessage = function(type) {
	this.type = "";
	this.type = type;
};
com_tamina_cow4_socket_message_SocketMessage.__name__ = true;
com_tamina_cow4_socket_message_SocketMessage.prototype = {
	serialize: function() {
		return JSON.stringify(this) + "#end#";
	}
	,__class__: com_tamina_cow4_socket_message_SocketMessage
};
var com_tamina_cow4_socket_message_ClientMessage = function(type) {
	com_tamina_cow4_socket_message_SocketMessage.call(this,type);
};
com_tamina_cow4_socket_message_ClientMessage.__name__ = true;
com_tamina_cow4_socket_message_ClientMessage.__super__ = com_tamina_cow4_socket_message_SocketMessage;
com_tamina_cow4_socket_message_ClientMessage.prototype = $extend(com_tamina_cow4_socket_message_SocketMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_ClientMessage
});
var com_tamina_cow4_socket_message_Authenticate = function(name,avatar,token,profil) {
	if(profil == null) profil = 0;
	if(token == null) token = "";
	if(avatar == null) avatar = "";
	com_tamina_cow4_socket_message_ClientMessage.call(this,"authenticate");
	this.name = name;
	this.avatar = avatar;
	this.token = token;
	this.profil = profil;
};
com_tamina_cow4_socket_message_Authenticate.__name__ = true;
com_tamina_cow4_socket_message_Authenticate.__super__ = com_tamina_cow4_socket_message_ClientMessage;
com_tamina_cow4_socket_message_Authenticate.prototype = $extend(com_tamina_cow4_socket_message_ClientMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_Authenticate
});
var com_tamina_cow4_socket_message_Error = function(code,message) {
	com_tamina_cow4_socket_message_SocketMessage.call(this,"error");
	this.code = code;
	this.message = message;
};
com_tamina_cow4_socket_message_Error.__name__ = true;
com_tamina_cow4_socket_message_Error.__super__ = com_tamina_cow4_socket_message_SocketMessage;
com_tamina_cow4_socket_message_Error.prototype = $extend(com_tamina_cow4_socket_message_SocketMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_Error
});
var com_tamina_cow4_socket_message_GameServerMessage = function(type) {
	com_tamina_cow4_socket_message_SocketMessage.call(this,type);
};
com_tamina_cow4_socket_message_GameServerMessage.__name__ = true;
com_tamina_cow4_socket_message_GameServerMessage.__super__ = com_tamina_cow4_socket_message_SocketMessage;
com_tamina_cow4_socket_message_GameServerMessage.prototype = $extend(com_tamina_cow4_socket_message_SocketMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_GameServerMessage
});
var com_tamina_cow4_socket_message_GetTurnOrder = function(data) {
	com_tamina_cow4_socket_message_GameServerMessage.call(this,"getTurnOrder");
	this.data = data;
};
com_tamina_cow4_socket_message_GetTurnOrder.__name__ = true;
com_tamina_cow4_socket_message_GetTurnOrder.__super__ = com_tamina_cow4_socket_message_GameServerMessage;
com_tamina_cow4_socket_message_GetTurnOrder.prototype = $extend(com_tamina_cow4_socket_message_GameServerMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_GetTurnOrder
});
var com_tamina_cow4_socket_message_ID = function(id) {
	com_tamina_cow4_socket_message_GameServerMessage.call(this,"id");
	this.id = id;
};
com_tamina_cow4_socket_message_ID.__name__ = true;
com_tamina_cow4_socket_message_ID.__super__ = com_tamina_cow4_socket_message_GameServerMessage;
com_tamina_cow4_socket_message_ID.prototype = $extend(com_tamina_cow4_socket_message_GameServerMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_ID
});
var com_tamina_cow4_socket_message_TurnResult = function() {
	com_tamina_cow4_socket_message_ClientMessage.call(this,"turnResult");
	this.actions = [];
};
com_tamina_cow4_socket_message_TurnResult.__name__ = true;
com_tamina_cow4_socket_message_TurnResult.__super__ = com_tamina_cow4_socket_message_ClientMessage;
com_tamina_cow4_socket_message_TurnResult.prototype = $extend(com_tamina_cow4_socket_message_ClientMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_TurnResult
});
var com_tamina_cow4_socket_message_order_GetItemOrder = function() {
	com_tamina_cow4_model_TurnAction.call(this,"getItem");
};
com_tamina_cow4_socket_message_order_GetItemOrder.__name__ = true;
com_tamina_cow4_socket_message_order_GetItemOrder.__super__ = com_tamina_cow4_model_TurnAction;
com_tamina_cow4_socket_message_order_GetItemOrder.prototype = $extend(com_tamina_cow4_model_TurnAction.prototype,{
	__class__: com_tamina_cow4_socket_message_order_GetItemOrder
});
var com_tamina_cow4_socket_message_order_MoveOrder = function(targetCell) {
	com_tamina_cow4_model_TurnAction.call(this,"move");
	this.target = targetCell.id;
};
com_tamina_cow4_socket_message_order_MoveOrder.__name__ = true;
com_tamina_cow4_socket_message_order_MoveOrder.__super__ = com_tamina_cow4_model_TurnAction;
com_tamina_cow4_socket_message_order_MoveOrder.prototype = $extend(com_tamina_cow4_model_TurnAction.prototype,{
	__class__: com_tamina_cow4_socket_message_order_MoveOrder
});
var com_tamina_cow4_socket_message_order_UseItemOrder = function(item) {
	com_tamina_cow4_model_TurnAction.call(this,"useItem");
	this.item = item;
};
com_tamina_cow4_socket_message_order_UseItemOrder.__name__ = true;
com_tamina_cow4_socket_message_order_UseItemOrder.__super__ = com_tamina_cow4_model_TurnAction;
com_tamina_cow4_socket_message_order_UseItemOrder.prototype = $extend(com_tamina_cow4_model_TurnAction.prototype,{
	__class__: com_tamina_cow4_socket_message_order_UseItemOrder
});
var com_tamina_cow4_utils_GameUtils = function() {
};
com_tamina_cow4_utils_GameUtils.__name__ = true;
com_tamina_cow4_utils_GameUtils.getPath = function(fromCell,toCell,map) {
	var p = new com_tamina_cow4_core_PathFinder();
	return p.getPath(fromCell,toCell,map);
};
com_tamina_cow4_utils_GameUtils.prototype = {
	__class__: com_tamina_cow4_utils_GameUtils
};
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = true;
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
haxe_Timer.delay = function(f,time_ms) {
	var t = new haxe_Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe_Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe_Timer
};
var haxe_io_Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; return $x; };
var haxe_io_FPHelper = function() { };
haxe_io_FPHelper.__name__ = true;
haxe_io_FPHelper.i32ToFloat = function(i) {
	var sign = 1 - (i >>> 31 << 1);
	var exp = i >>> 23 & 255;
	var sig = i & 8388607;
	if(sig == 0 && exp == 0) return 0.0;
	return sign * (1 + Math.pow(2,-23) * sig) * Math.pow(2,exp - 127);
};
haxe_io_FPHelper.floatToI32 = function(f) {
	if(f == 0) return 0;
	var af;
	if(f < 0) af = -f; else af = f;
	var exp = Math.floor(Math.log(af) / 0.6931471805599453);
	if(exp < -127) exp = -127; else if(exp > 128) exp = 128;
	var sig = Math.round((af / Math.pow(2,exp) - 1) * 8388608) & 8388607;
	return (f < 0?-2147483648:0) | exp + 127 << 23 | sig;
};
haxe_io_FPHelper.i64ToDouble = function(low,high) {
	var sign = 1 - (high >>> 31 << 1);
	var exp = (high >> 20 & 2047) - 1023;
	var sig = (high & 1048575) * 4294967296. + (low >>> 31) * 2147483648. + (low & 2147483647);
	if(sig == 0 && exp == -1023) return 0.0;
	return sign * (1.0 + Math.pow(2,-52) * sig) * Math.pow(2,exp);
};
haxe_io_FPHelper.doubleToI64 = function(v) {
	var i64 = haxe_io_FPHelper.i64tmp;
	if(v == 0) {
		i64.low = 0;
		i64.high = 0;
	} else {
		var av;
		if(v < 0) av = -v; else av = v;
		var exp = Math.floor(Math.log(av) / 0.6931471805599453);
		var sig;
		var v1 = (av / Math.pow(2,exp) - 1) * 4503599627370496.;
		sig = Math.round(v1);
		var sig_l = sig | 0;
		var sig_h = sig / 4294967296.0 | 0;
		i64.low = sig_l;
		i64.high = (v < 0?-2147483648:0) | exp + 1023 << 20 | sig_h;
	}
	return i64;
};
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else {
		var cl = o.__class__;
		if(cl != null) return cl;
		var name = js_Boot.__nativeClassName(o);
		if(name != null) return js_Boot.__resolveNativeClass(name);
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str2 = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i1 = _g1++;
					if(i1 != 2) str2 += "," + js_Boot.__string_rec(o[i1],s); else str2 += js_Boot.__string_rec(o[i1],s);
				}
				return str2 + ")";
			}
			var l = o.length;
			var i;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str.length != 2) str += ", \n";
		str += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str += "\n" + s + "}";
		return str;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js_Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js_Boot.__interfLoop(cc.__super__,cl);
};
js_Boot.__instanceof = function(o,cl) {
	if(cl == null) return false;
	switch(cl) {
	case Int:
		return (o|0) === o;
	case Float:
		return typeof(o) == "number";
	case Bool:
		return typeof(o) == "boolean";
	case String:
		return typeof(o) == "string";
	case Array:
		return (o instanceof Array) && o.__enum__ == null;
	case Dynamic:
		return true;
	default:
		if(o != null) {
			if(typeof(cl) == "function") {
				if(o instanceof cl) return true;
				if(js_Boot.__interfLoop(js_Boot.getClass(o),cl)) return true;
			} else if(typeof(cl) == "object" && js_Boot.__isNativeObj(cl)) {
				if(o instanceof cl) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") return null;
	return name;
};
js_Boot.__isNativeObj = function(o) {
	return js_Boot.__nativeClassName(o) != null;
};
js_Boot.__resolveNativeClass = function(name) {
	return (Function("return typeof " + name + " != \"undefined\" ? " + name + " : null"))();
};
var js_html_compat_ArrayBuffer = function(a) {
	if((a instanceof Array) && a.__enum__ == null) {
		this.a = a;
		this.byteLength = a.length;
	} else {
		var len = a;
		this.a = [];
		var _g = 0;
		while(_g < len) {
			var i = _g++;
			this.a[i] = 0;
		}
		this.byteLength = len;
	}
};
js_html_compat_ArrayBuffer.__name__ = true;
js_html_compat_ArrayBuffer.sliceImpl = function(begin,end) {
	var u = new Uint8Array(this,begin,end == null?null:end - begin);
	var result = new ArrayBuffer(u.byteLength);
	var resultArray = new Uint8Array(result);
	resultArray.set(u);
	return result;
};
js_html_compat_ArrayBuffer.prototype = {
	slice: function(begin,end) {
		return new js_html_compat_ArrayBuffer(this.a.slice(begin,end));
	}
	,__class__: js_html_compat_ArrayBuffer
};
var js_html_compat_DataView = function(buffer,byteOffset,byteLength) {
	this.buf = buffer;
	if(byteOffset == null) this.offset = 0; else this.offset = byteOffset;
	if(byteLength == null) this.length = buffer.byteLength - this.offset; else this.length = byteLength;
	if(this.offset < 0 || this.length < 0 || this.offset + this.length > buffer.byteLength) throw haxe_io_Error.OutsideBounds;
};
js_html_compat_DataView.__name__ = true;
js_html_compat_DataView.prototype = {
	getInt8: function(byteOffset) {
		var v = this.buf.a[this.offset + byteOffset];
		if(v >= 128) return v - 256; else return v;
	}
	,getUint8: function(byteOffset) {
		return this.buf.a[this.offset + byteOffset];
	}
	,getInt16: function(byteOffset,littleEndian) {
		var v = this.getUint16(byteOffset,littleEndian);
		if(v >= 32768) return v - 65536; else return v;
	}
	,getUint16: function(byteOffset,littleEndian) {
		if(littleEndian) return this.buf.a[this.offset + byteOffset] | this.buf.a[this.offset + byteOffset + 1] << 8; else return this.buf.a[this.offset + byteOffset] << 8 | this.buf.a[this.offset + byteOffset + 1];
	}
	,getInt32: function(byteOffset,littleEndian) {
		var p = this.offset + byteOffset;
		var a = this.buf.a[p++];
		var b = this.buf.a[p++];
		var c = this.buf.a[p++];
		var d = this.buf.a[p++];
		if(littleEndian) return a | b << 8 | c << 16 | d << 24; else return d | c << 8 | b << 16 | a << 24;
	}
	,getUint32: function(byteOffset,littleEndian) {
		var v = this.getInt32(byteOffset,littleEndian);
		if(v < 0) return v + 4294967296.; else return v;
	}
	,getFloat32: function(byteOffset,littleEndian) {
		return haxe_io_FPHelper.i32ToFloat(this.getInt32(byteOffset,littleEndian));
	}
	,getFloat64: function(byteOffset,littleEndian) {
		var a = this.getInt32(byteOffset,littleEndian);
		var b = this.getInt32(byteOffset + 4,littleEndian);
		return haxe_io_FPHelper.i64ToDouble(littleEndian?a:b,littleEndian?b:a);
	}
	,setInt8: function(byteOffset,value) {
		if(value < 0) this.buf.a[byteOffset + this.offset] = value + 128 & 255; else this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setUint8: function(byteOffset,value) {
		this.buf.a[byteOffset + this.offset] = value & 255;
	}
	,setInt16: function(byteOffset,value,littleEndian) {
		this.setUint16(byteOffset,value < 0?value + 65536:value,littleEndian);
	}
	,setUint16: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
		} else {
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p] = value & 255;
		}
	}
	,setInt32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,value,littleEndian);
	}
	,setUint32: function(byteOffset,value,littleEndian) {
		var p = byteOffset + this.offset;
		if(littleEndian) {
			this.buf.a[p++] = value & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >>> 24;
		} else {
			this.buf.a[p++] = value >>> 24;
			this.buf.a[p++] = value >> 16 & 255;
			this.buf.a[p++] = value >> 8 & 255;
			this.buf.a[p++] = value & 255;
		}
	}
	,setFloat32: function(byteOffset,value,littleEndian) {
		this.setUint32(byteOffset,haxe_io_FPHelper.floatToI32(value),littleEndian);
	}
	,setFloat64: function(byteOffset,value,littleEndian) {
		var i64 = haxe_io_FPHelper.doubleToI64(value);
		if(littleEndian) {
			this.setUint32(byteOffset,i64.low);
			this.setUint32(byteOffset,i64.high);
		} else {
			this.setUint32(byteOffset,i64.high);
			this.setUint32(byteOffset,i64.low);
		}
	}
	,__class__: js_html_compat_DataView
};
var js_html_compat_Uint8Array = function() { };
js_html_compat_Uint8Array.__name__ = true;
js_html_compat_Uint8Array._new = function(arg1,offset,length) {
	var arr;
	if(typeof(arg1) == "number") {
		arr = [];
		var _g = 0;
		while(_g < arg1) {
			var i = _g++;
			arr[i] = 0;
		}
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else if(js_Boot.__instanceof(arg1,js_html_compat_ArrayBuffer)) {
		var buffer = arg1;
		if(offset == null) offset = 0;
		if(length == null) length = buffer.byteLength - offset;
		if(offset == 0) arr = buffer.a; else arr = buffer.a.slice(offset,offset + length);
		arr.byteLength = arr.length;
		arr.byteOffset = offset;
		arr.buffer = buffer;
	} else if((arg1 instanceof Array) && arg1.__enum__ == null) {
		arr = arg1.slice();
		arr.byteLength = arr.length;
		arr.byteOffset = 0;
		arr.buffer = new js_html_compat_ArrayBuffer(arr);
	} else throw "TODO " + Std.string(arg1);
	arr.subarray = js_html_compat_Uint8Array._subarray;
	arr.set = js_html_compat_Uint8Array._set;
	return arr;
};
js_html_compat_Uint8Array._set = function(arg,offset) {
	var t = this;
	if(js_Boot.__instanceof(arg.buffer,js_html_compat_ArrayBuffer)) {
		var a = arg;
		if(arg.byteLength + offset > t.byteLength) throw "set() outside of range";
		var _g1 = 0;
		var _g = arg.byteLength;
		while(_g1 < _g) {
			var i = _g1++;
			t[i + offset] = a[i];
		}
	} else if((arg instanceof Array) && arg.__enum__ == null) {
		var a1 = arg;
		if(a1.length + offset > t.byteLength) throw "set() outside of range";
		var _g11 = 0;
		var _g2 = a1.length;
		while(_g11 < _g2) {
			var i1 = _g11++;
			t[i1 + offset] = a1[i1];
		}
	} else throw "TODO";
};
js_html_compat_Uint8Array._subarray = function(start,end) {
	var t = this;
	var a = js_html_compat_Uint8Array._new(t.slice(start,end));
	a.byteOffset = start;
	return a;
};
var msignal_Signal = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal_SlotList.NIL;
	this.priorityBased = false;
};
msignal_Signal.__name__ = true;
msignal_Signal.prototype = {
	add: function(listener) {
		return this.registerListener(listener);
	}
	,addOnce: function(listener) {
		return this.registerListener(listener,true);
	}
	,addWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,false,priority);
	}
	,addOnceWithPriority: function(listener,priority) {
		if(priority == null) priority = 0;
		return this.registerListener(listener,true,priority);
	}
	,remove: function(listener) {
		var slot = this.slots.find(listener);
		if(slot == null) return null;
		this.slots = this.slots.filterNot(listener);
		return slot;
	}
	,removeAll: function() {
		this.slots = msignal_SlotList.NIL;
	}
	,registerListener: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		if(this.registrationPossible(listener,once)) {
			var newSlot = this.createSlot(listener,once,priority);
			if(!this.priorityBased && priority != 0) this.priorityBased = true;
			if(!this.priorityBased && priority == 0) this.slots = this.slots.prepend(newSlot); else this.slots = this.slots.insertWithPriority(newSlot);
			return newSlot;
		}
		return this.slots.find(listener);
	}
	,registrationPossible: function(listener,once) {
		if(!this.slots.nonEmpty) return true;
		var existingSlot = this.slots.find(listener);
		if(existingSlot == null) return true;
		return false;
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return null;
	}
	,get_numListeners: function() {
		return this.slots.get_length();
	}
	,__class__: msignal_Signal
};
var msignal_Signal0 = function() {
	msignal_Signal.call(this);
};
msignal_Signal0.__name__ = true;
msignal_Signal0.__super__ = msignal_Signal;
msignal_Signal0.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function() {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute();
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot0(this,listener,once,priority);
	}
	,__class__: msignal_Signal0
});
var msignal_Signal1 = function(type) {
	msignal_Signal.call(this,[type]);
};
msignal_Signal1.__name__ = true;
msignal_Signal1.__super__ = msignal_Signal;
msignal_Signal1.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot1(this,listener,once,priority);
	}
	,__class__: msignal_Signal1
});
var msignal_Signal2 = function(type1,type2) {
	msignal_Signal.call(this,[type1,type2]);
};
msignal_Signal2.__name__ = true;
msignal_Signal2.__super__ = msignal_Signal;
msignal_Signal2.prototype = $extend(msignal_Signal.prototype,{
	dispatch: function(value1,value2) {
		var slotsToProcess = this.slots;
		while(slotsToProcess.nonEmpty) {
			slotsToProcess.head.execute(value1,value2);
			slotsToProcess = slotsToProcess.tail;
		}
	}
	,createSlot: function(listener,once,priority) {
		if(priority == null) priority = 0;
		if(once == null) once = false;
		return new msignal_Slot2(this,listener,once,priority);
	}
	,__class__: msignal_Signal2
});
var msignal_Slot = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
msignal_Slot.__name__ = true;
msignal_Slot.prototype = {
	remove: function() {
		this.signal.remove(this.listener);
	}
	,set_listener: function(value) {
		return this.listener = value;
	}
	,__class__: msignal_Slot
};
var msignal_Slot0 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot0.__name__ = true;
msignal_Slot0.__super__ = msignal_Slot;
msignal_Slot0.prototype = $extend(msignal_Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
	,__class__: msignal_Slot0
});
var msignal_Slot1 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot1.__name__ = true;
msignal_Slot1.__super__ = msignal_Slot;
msignal_Slot1.prototype = $extend(msignal_Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
	,__class__: msignal_Slot1
});
var msignal_Slot2 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal_Slot.call(this,signal,listener,once,priority);
};
msignal_Slot2.__name__ = true;
msignal_Slot2.__super__ = msignal_Slot;
msignal_Slot2.prototype = $extend(msignal_Slot.prototype,{
	execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
	}
	,__class__: msignal_Slot2
});
var msignal_SlotList = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) this.nonEmpty = false; else if(head == null) {
	} else {
		this.head = head;
		if(tail == null) this.tail = msignal_SlotList.NIL; else this.tail = tail;
		this.nonEmpty = true;
	}
};
msignal_SlotList.__name__ = true;
msignal_SlotList.prototype = {
	get_length: function() {
		if(!this.nonEmpty) return 0;
		if(this.tail == msignal_SlotList.NIL) return 1;
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,prepend: function(slot) {
		return new msignal_SlotList(slot,this);
	}
	,append: function(slot) {
		if(slot == null) return this;
		if(!this.nonEmpty) return new msignal_SlotList(slot);
		if(this.tail == msignal_SlotList.NIL) return new msignal_SlotList(slot).prepend(this.head);
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal_SlotList(slot);
		return wholeClone;
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new msignal_SlotList(slot);
		var priority = slot.priority;
		if(priority >= this.head.priority) return this.prepend(slot);
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal_SlotList(slot);
		return wholeClone;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new msignal_SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal_SlotList(current.head);
			current = current.tail;
		}
		return this;
	}
	,contains: function(listener) {
		if(!this.nonEmpty) return false;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return true;
			p = p.tail;
		}
		return false;
	}
	,find: function(listener) {
		if(!this.nonEmpty) return null;
		var p = this;
		while(p.nonEmpty) {
			if(Reflect.compareMethods(p.head.listener,listener)) return p.head;
			p = p.tail;
		}
		return null;
	}
	,__class__: msignal_SlotList
};
var nodejs_NodeJS = function() { };
nodejs_NodeJS.__name__ = true;
nodejs_NodeJS.get_dirname = function() {
	return __dirname;
};
nodejs_NodeJS.get_filename = function() {
	return __filename;
};
nodejs_NodeJS.require = function(p_lib) {
	return require(p_lib);
};
nodejs_NodeJS.get_process = function() {
	return process;
};
nodejs_NodeJS.setTimeout = function(cb,ms) {
	return setTimeout(cb,ms);
};
nodejs_NodeJS.clearTimeout = function(t) {
	clearTimeout(t);
	return;
};
nodejs_NodeJS.setInterval = function(cb,ms) {
	return setInterval(cb,ms);
};
nodejs_NodeJS.clearInterval = function(t) {
	clearInterval(t);
	return;
};
nodejs_NodeJS.assert = function(value,message) {
	require('assert')(value,message);
};
nodejs_NodeJS.get_global = function() {
	return global;
};
nodejs_NodeJS.resolve = function() {
	return require.resolve();
};
nodejs_NodeJS.get_cache = function() {
	return require.cache;
};
nodejs_NodeJS.get_extensions = function() {
	return require.extensions;
};
nodejs_NodeJS.get_module = function() {
	return module;
};
nodejs_NodeJS.get_exports = function() {
	return exports;
};
nodejs_NodeJS.get_domain = function() {
	return domain.create();
};
nodejs_NodeJS.get_repl = function() {
	return require('repl');
};
var nodejs_ProcessEventType = function() { };
nodejs_ProcessEventType.__name__ = true;
var nodejs_REPLEventType = function() { };
nodejs_REPLEventType.__name__ = true;
var nodejs_events_EventEmitterEventType = function() { };
nodejs_events_EventEmitterEventType.__name__ = true;
var nodejs_fs_ReadStreamEventType = function() { };
nodejs_fs_ReadStreamEventType.__name__ = true;
var nodejs_fs_WriteStreamEventType = function() { };
nodejs_fs_WriteStreamEventType.__name__ = true;
var nodejs_http_HTTPMethod = function() { };
nodejs_http_HTTPMethod.__name__ = true;
var nodejs_http_HTTPClientRequestEventType = function() { };
nodejs_http_HTTPClientRequestEventType.__name__ = true;
var nodejs_http_HTTPServerEventType = function() { };
nodejs_http_HTTPServerEventType.__name__ = true;
var nodejs_stream_ReadableEventType = function() { };
nodejs_stream_ReadableEventType.__name__ = true;
var nodejs_http_IncomingMessageEventType = function() { };
nodejs_http_IncomingMessageEventType.__name__ = true;
nodejs_http_IncomingMessageEventType.__super__ = nodejs_stream_ReadableEventType;
nodejs_http_IncomingMessageEventType.prototype = $extend(nodejs_stream_ReadableEventType.prototype,{
	__class__: nodejs_http_IncomingMessageEventType
});
var nodejs_http_ServerResponseEventType = function() { };
nodejs_http_ServerResponseEventType.__name__ = true;
var nodejs_net_TCPServerEventType = function() { };
nodejs_net_TCPServerEventType.__name__ = true;
var nodejs_net_TCPSocketEventType = function() { };
nodejs_net_TCPSocketEventType.__name__ = true;
var nodejs_stream_WritableEventType = function() { };
nodejs_stream_WritableEventType.__name__ = true;
var org_tamina_utils_UID = function() { };
org_tamina_utils_UID.__name__ = true;
org_tamina_utils_UID.getUID = function() {
	var result = new Date().getTime();
	if(result <= org_tamina_utils_UID._lastUID) result = org_tamina_utils_UID._lastUID + 1;
	org_tamina_utils_UID._lastUID = result;
	return result;
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var Int = { __name__ : ["Int"]};
var Dynamic = { __name__ : ["Dynamic"]};
var Float = Number;
Float.__name__ = ["Float"];
var Bool = Boolean;
Bool.__ename__ = ["Bool"];
var Class = { __name__ : ["Class"]};
var Enum = { };
var ArrayBuffer = (Function("return typeof ArrayBuffer != 'undefined' ? ArrayBuffer : null"))() || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = (Function("return typeof DataView != 'undefined' ? DataView : null"))() || js_html_compat_DataView;
var Uint8Array = (Function("return typeof Uint8Array != 'undefined' ? Uint8Array : null"))() || js_html_compat_Uint8Array._new;
msignal_SlotList.NIL = new msignal_SlotList(null,null);
com_tamina_cow4_IADemoApp.ALIVE_DURATION = 600000;
com_tamina_cow4_config_Config.ROOT_PATH = "server/";
com_tamina_cow4_config_Config.APP_PORT = 3000;
com_tamina_cow4_config_Config.SOCKET_PORT = 8127;
com_tamina_cow4_config_Config.WEB_SOCKET_PORT = 8128;
com_tamina_cow4_model_ItemPosition.POTION_TOP = new org_tamina_geom_Point(21,4);
com_tamina_cow4_model_ItemPosition.POTION_BOTTOM = new org_tamina_geom_Point(3,20);
com_tamina_cow4_model_ItemPosition.TRAP_TOP = new org_tamina_geom_Point(7,3);
com_tamina_cow4_model_ItemPosition.TRAP_BOTTOM = new org_tamina_geom_Point(17,21);
com_tamina_cow4_model_ItemPosition.PARFUM_TOP = new org_tamina_geom_Point(7,10);
com_tamina_cow4_model_ItemPosition.PARFUM_BOTTOM = new org_tamina_geom_Point(17,14);
com_tamina_cow4_socket_message_SocketMessage.END_CHAR = "#end#";
com_tamina_cow4_socket_message_Authenticate.MESSAGE_TYPE = "authenticate";
com_tamina_cow4_socket_message_Error.MESSAGE_TYPE = "error";
com_tamina_cow4_socket_message_GetTurnOrder.MESSAGE_TYPE = "getTurnOrder";
com_tamina_cow4_socket_message_ID.MESSAGE_TYPE = "id";
com_tamina_cow4_socket_message_TurnResult.MESSAGE_TYPE = "turnResult";
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
nodejs_ProcessEventType.Exit = "exit";
nodejs_ProcessEventType.Exception = "uncaughtException";
nodejs_REPLEventType.Exit = "exit";
nodejs_events_EventEmitterEventType.NewListener = "newListener";
nodejs_events_EventEmitterEventType.RemoveListener = "removeListener";
nodejs_fs_ReadStreamEventType.Open = "open";
nodejs_fs_WriteStreamEventType.Open = "open";
nodejs_http_HTTPMethod.Get = "GET";
nodejs_http_HTTPMethod.Post = "POST";
nodejs_http_HTTPMethod.Options = "OPTIONS";
nodejs_http_HTTPMethod.Head = "HEAD";
nodejs_http_HTTPMethod.Put = "PUT";
nodejs_http_HTTPMethod.Delete = "DELETE";
nodejs_http_HTTPMethod.Trace = "TRACE";
nodejs_http_HTTPMethod.Connect = "CONNECT";
nodejs_http_HTTPClientRequestEventType.Response = "response";
nodejs_http_HTTPClientRequestEventType.Socket = "socket";
nodejs_http_HTTPClientRequestEventType.Connect = "connect";
nodejs_http_HTTPClientRequestEventType.Upgrade = "upgrade";
nodejs_http_HTTPClientRequestEventType.Continue = "continue";
nodejs_http_HTTPServerEventType.Listening = "listening";
nodejs_http_HTTPServerEventType.Connection = "connection";
nodejs_http_HTTPServerEventType.Close = "close";
nodejs_http_HTTPServerEventType.Error = "error";
nodejs_http_HTTPServerEventType.Request = "request";
nodejs_http_HTTPServerEventType.CheckContinue = "checkContinue";
nodejs_http_HTTPServerEventType.Connect = "connect";
nodejs_http_HTTPServerEventType.Upgrade = "upgrade";
nodejs_http_HTTPServerEventType.ClientError = "clientError";
nodejs_stream_ReadableEventType.Readable = "readable";
nodejs_stream_ReadableEventType.Data = "data";
nodejs_stream_ReadableEventType.End = "end";
nodejs_stream_ReadableEventType.Close = "close";
nodejs_stream_ReadableEventType.Error = "error";
nodejs_http_IncomingMessageEventType.Data = "data";
nodejs_http_IncomingMessageEventType.Close = "close";
nodejs_http_IncomingMessageEventType.End = "end";
nodejs_http_ServerResponseEventType.Close = "close";
nodejs_http_ServerResponseEventType.Finish = "finish";
nodejs_net_TCPServerEventType.Listening = "listening";
nodejs_net_TCPServerEventType.Connection = "connection";
nodejs_net_TCPServerEventType.Close = "close";
nodejs_net_TCPServerEventType.Error = "error";
nodejs_net_TCPSocketEventType.Connect = "connect";
nodejs_net_TCPSocketEventType.Data = "data";
nodejs_net_TCPSocketEventType.End = "end";
nodejs_net_TCPSocketEventType.TimeOut = "timeout";
nodejs_net_TCPSocketEventType.Drain = "drain";
nodejs_net_TCPSocketEventType.Error = "error";
nodejs_net_TCPSocketEventType.Close = "close";
nodejs_stream_WritableEventType.Drain = "drain";
nodejs_stream_WritableEventType.Finish = "finish";
nodejs_stream_WritableEventType.Pipe = "pipe";
nodejs_stream_WritableEventType.Unpipe = "unpipe";
nodejs_stream_WritableEventType.Error = "error";
org_tamina_utils_UID._lastUID = 0;
com_tamina_cow4_IADemoApp.main();
})(typeof console != "undefined" ? console : {log:function(){}});
