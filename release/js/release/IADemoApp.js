(function () { "use strict";
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
	return js.Boot.__string_rec(s,"");
};
var com = {};
com.tamina = {};
com.tamina.cow4 = {};
com.tamina.cow4.IADemoApp = function() {
	this._socket = new (require('net').Socket)();
	this._socket.connect(8127,"localhost",$bind(this,this.connectionHandler));
	this._currentDirection = 1;
};
com.tamina.cow4.IADemoApp.__name__ = true;
com.tamina.cow4.IADemoApp.main = function() {
	com.tamina.cow4.IADemoApp._app = new com.tamina.cow4.IADemoApp();
};
com.tamina.cow4.IADemoApp.prototype = {
	connectionHandler: function() {
		console.log("CONNECTED <br/> Sending Auth message...");
		this._proxy = new com.tamina.cow4.socket.GameServerProxy(this._socket);
		this._proxy.messageSignal.add($bind(this,this.serverMessageHandler));
		this._proxy.closeSignal.add($bind(this,this.quit));
		this._proxy.sendMessage(new com.tamina.cow4.socket.message.Authenticate("DemoIA","http://images.groups.adobe.com/1332a08/logo100x100.gif"));
		haxe.Timer.delay($bind(this,this.quit),600000);
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
		var result = new com.tamina.cow4.socket.message.TurnResult();
		try {
			var wait = Math.round(Math.random()) == 0;
			if(wait) console.log("wait"); else {
				var gameData = com.tamina.cow4.model.GameMap.fromGameMapVO(data.data);
				var myIa = gameData.getIAById(this._id);
				console.log("pm : " + myIa.pm);
				var currentCell = gameData.getCellByIA(this._id);
				var sheepCell = gameData.getCellByIA(gameData.iaList[2].id);
				var path = com.tamina.cow4.utils.GameUtils.getPath(currentCell,sheepCell,gameData);
				if(path != null) {
					var _g1 = 0;
					var _g = myIa.pm;
					while(_g1 < _g) {
						var i = _g1++;
						console.log(currentCell.id + " -> " + path.getItemAt(i + 1).id);
						var order = new com.tamina.cow4.socket.message.order.MoveOrder(path.getItemAt(i + 1));
						result.actions.push(order);
					}
				} else console.log("path null : " + currentCell.id + "//" + sheepCell.id);
			}
		} catch( e ) {
			if( js.Boot.__instanceof(e,Error) ) {
				console.log("error : " + e.message);
			} else throw(e);
		}
		var timeout = Math.round(Math.random()) == 0;
		this._proxy.sendMessage(result);
	}
	,quit: function() {
		this._socket.destroy();
		nodejs.NodeJS.get_process().exit(0);
	}
	,__class__: com.tamina.cow4.IADemoApp
};
com.tamina.cow4.config = {};
com.tamina.cow4.config.Config = function() {
};
com.tamina.cow4.config.Config.__name__ = true;
com.tamina.cow4.config.Config.prototype = {
	__class__: com.tamina.cow4.config.Config
};
com.tamina.cow4.core = {};
com.tamina.cow4.core.PathFinder = function() {
	this._inc = 0;
	this._paths = new Array();
};
com.tamina.cow4.core.PathFinder.__name__ = true;
com.tamina.cow4.core.PathFinder.prototype = {
	getPath: function(fromCell,toCell,map) {
		this._map = map;
		this._source = fromCell;
		this._target = toCell;
		var p = new com.tamina.cow4.model.Path();
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
		if(!result && this._inc < 50) this.find();
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
			} else if(!com.tamina.cow4.model.Path.contains(nextCell,this._paths)) {
				var p1 = target.copy();
				p1.push(nextCell);
				this._paths.push(p1);
			}
		}
		HxOverrides.remove(this._paths,target);
		return result;
	}
	,__class__: com.tamina.cow4.core.PathFinder
};
com.tamina.cow4.model = {};
com.tamina.cow4.model._Action = {};
com.tamina.cow4.model._Action.Action_Impl_ = function() { };
com.tamina.cow4.model._Action.Action_Impl_.__name__ = true;
com.tamina.cow4.model.Cell = function() {
	this.id = org.tamina.utils.UID.getUID();
	this.changeSignal = new msignal.Signal0();
};
com.tamina.cow4.model.Cell.__name__ = true;
com.tamina.cow4.model.Cell.fromCellVO = function(value) {
	var result = new com.tamina.cow4.model.Cell();
	result.id = value.id;
	result.occupant = value.occupant;
	result.item = value.item;
	return result;
};
com.tamina.cow4.model.Cell.prototype = {
	toCellVO: function() {
		var result = new com.tamina.cow4.model.vo.CellVO(this.id,this.occupant);
		if(null != result.top) result.top = this.get_top().id;
		if(null != result.bottom) result.bottom = this.get_bottom().id;
		if(null != result.left) result.left = this.get_left().id;
		if(null != result.right) result.right = this.get_right().id;
		result.item = this.item;
		return result;
	}
	,getNeighboors: function() {
		var result = new Array();
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
	,__class__: com.tamina.cow4.model.Cell
};
com.tamina.cow4.model._Direction = {};
com.tamina.cow4.model._Direction.Direction_Impl_ = function() { };
com.tamina.cow4.model._Direction.Direction_Impl_.__name__ = true;
com.tamina.cow4.model.GameMap = function() {
	this.currentTurn = 0;
	this.cells = new Array();
	this.iaList = new Array();
};
com.tamina.cow4.model.GameMap.__name__ = true;
com.tamina.cow4.model.GameMap.fromGameMapVO = function(value) {
	var result = new com.tamina.cow4.model.GameMap();
	result.id = value.id;
	result.iaList = value.iaList;
	result.currentTurn = value.currentTurn;
	var _g1 = 0;
	var _g = value.cells.length;
	while(_g1 < _g) {
		var i = _g1++;
		result.cells.push(new Array());
		var _g3 = 0;
		var _g2 = value.cells[i].length;
		while(_g3 < _g2) {
			var j = _g3++;
			result.cells[i].push(com.tamina.cow4.model.Cell.fromCellVO(value.cells[i][j]));
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
com.tamina.cow4.model.GameMap.prototype = {
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
					result = new org.tamina.geom.Point(j,i);
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
				if(cell.occupant != null && cell.occupant.id == id) {
					result = cell;
					break;
				}
			}
		}
		return result;
	}
	,toGameMapVO: function() {
		var result = new com.tamina.cow4.model.vo.GameMapVO();
		result.id = this.id;
		result.iaList = this.iaList;
		result.currentTurn = this.currentTurn;
		var _g1 = 0;
		var _g = this.cells.length;
		while(_g1 < _g) {
			var i = _g1++;
			result.cells.push(new Array());
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
	,__class__: com.tamina.cow4.model.GameMap
};
com.tamina.cow4.model.IAInfo = function(id,name,avatar,pm) {
	this.pm = 1;
	this.id = id;
	this.name = name;
	this.avatar = avatar;
	this.pm = pm;
	this.items = new Array();
};
com.tamina.cow4.model.IAInfo.__name__ = true;
com.tamina.cow4.model.IAInfo.prototype = {
	__class__: com.tamina.cow4.model.IAInfo
};
com.tamina.cow4.model.Item = function(type) {
	this.type = type;
};
com.tamina.cow4.model.Item.__name__ = true;
com.tamina.cow4.model.Item.prototype = {
	__class__: com.tamina.cow4.model.Item
};
com.tamina.cow4.model._ItemType = {};
com.tamina.cow4.model._ItemType.ItemType_Impl_ = function() { };
com.tamina.cow4.model._ItemType.ItemType_Impl_.__name__ = true;
com.tamina.cow4.model.Path = function(content) {
	if(content == null) this._content = new Array(); else this._content = content;
};
com.tamina.cow4.model.Path.__name__ = true;
com.tamina.cow4.model.Path.contains = function(item,list) {
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
com.tamina.cow4.model.Path.prototype = {
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
		return new com.tamina.cow4.model.Path(this._content.slice());
	}
	,get_length: function() {
		return this._content.length;
	}
	,__class__: com.tamina.cow4.model.Path
};
com.tamina.cow4.model.TurnAction = function(type) {
	this.type = type;
};
com.tamina.cow4.model.TurnAction.__name__ = true;
com.tamina.cow4.model.TurnAction.prototype = {
	__class__: com.tamina.cow4.model.TurnAction
};
com.tamina.cow4.model.vo = {};
com.tamina.cow4.model.vo.CellVO = function(id,occupant) {
	this.id = id;
	this.occupant = occupant;
};
com.tamina.cow4.model.vo.CellVO.__name__ = true;
com.tamina.cow4.model.vo.CellVO.prototype = {
	__class__: com.tamina.cow4.model.vo.CellVO
};
com.tamina.cow4.model.vo.GameMapVO = function() {
	this.currentTurn = 0;
	this.cells = new Array();
	this.iaList = new Array();
};
com.tamina.cow4.model.vo.GameMapVO.__name__ = true;
com.tamina.cow4.model.vo.GameMapVO.prototype = {
	__class__: com.tamina.cow4.model.vo.GameMapVO
};
com.tamina.cow4.socket = {};
com.tamina.cow4.socket.Proxy = function(type) {
	this._type = "proxy";
	this._data = "";
	this._type = type;
	this.errorSignal = new msignal.Signal0();
	this.closeSignal = new msignal.Signal0();
	this.messageSignal = new msignal.Signal1();
};
com.tamina.cow4.socket.Proxy.__name__ = true;
com.tamina.cow4.socket.Proxy.prototype = {
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
			if( js.Boot.__instanceof(e,Error) ) {
				console.log("[" + this._type + "] impossible de parser le message json : " + e.message);
				this.sendError(new com.tamina.cow4.socket.message.Error(2,"message inconnu"));
			} else throw(e);
		}
		if(message != null && message.type != null) this.messageSignal.dispatch(message); else this.sendError(new com.tamina.cow4.socket.message.Error(2,"message inconnu"));
	}
	,__class__: com.tamina.cow4.socket.Proxy
};
com.tamina.cow4.socket.GameServerProxy = function(c) {
	com.tamina.cow4.socket.Proxy.call(this,"game server proxy");
	this._socket = c;
	this._socket.on(nodejs.net.TCPSocketEventType.Connect,$bind(this,this.socketServer_openHandler));
	this._socket.on(nodejs.net.TCPSocketEventType.Close,$bind(this,this.socketServer_closeHandler));
	this._socket.on(nodejs.net.TCPSocketEventType.Error,$bind(this,this.socketServer_errorHandler));
	this._socket.on(nodejs.net.TCPSocketEventType.Data,$bind(this,this.socketServer_dataHandler));
};
com.tamina.cow4.socket.GameServerProxy.__name__ = true;
com.tamina.cow4.socket.GameServerProxy.__super__ = com.tamina.cow4.socket.Proxy;
com.tamina.cow4.socket.GameServerProxy.prototype = $extend(com.tamina.cow4.socket.Proxy.prototype,{
	sendMessage: function(message) {
		try {
			this._socket.write(message.serialize());
		} catch( e ) {
			if( js.Boot.__instanceof(e,Error) ) {
				console.log("ERROR : " + e.message);
			} else throw(e);
		}
	}
	,sendError: function(error) {
	}
	,__class__: com.tamina.cow4.socket.GameServerProxy
});
com.tamina.cow4.socket.message = {};
com.tamina.cow4.socket.message.SocketMessage = function(type) {
	this.type = "";
	this.type = type;
};
com.tamina.cow4.socket.message.SocketMessage.__name__ = true;
com.tamina.cow4.socket.message.SocketMessage.prototype = {
	serialize: function() {
		return JSON.stringify(this) + "#end#";
	}
	,__class__: com.tamina.cow4.socket.message.SocketMessage
};
com.tamina.cow4.socket.message.ClientMessage = function(type) {
	com.tamina.cow4.socket.message.SocketMessage.call(this,type);
};
com.tamina.cow4.socket.message.ClientMessage.__name__ = true;
com.tamina.cow4.socket.message.ClientMessage.__super__ = com.tamina.cow4.socket.message.SocketMessage;
com.tamina.cow4.socket.message.ClientMessage.prototype = $extend(com.tamina.cow4.socket.message.SocketMessage.prototype,{
	__class__: com.tamina.cow4.socket.message.ClientMessage
});
com.tamina.cow4.socket.message.Authenticate = function(name,avatar) {
	if(avatar == null) avatar = "";
	com.tamina.cow4.socket.message.ClientMessage.call(this,"authenticate");
	this.name = name;
	this.avatar = avatar;
};
com.tamina.cow4.socket.message.Authenticate.__name__ = true;
com.tamina.cow4.socket.message.Authenticate.__super__ = com.tamina.cow4.socket.message.ClientMessage;
com.tamina.cow4.socket.message.Authenticate.prototype = $extend(com.tamina.cow4.socket.message.ClientMessage.prototype,{
	__class__: com.tamina.cow4.socket.message.Authenticate
});
com.tamina.cow4.socket.message.Error = function(code,message) {
	com.tamina.cow4.socket.message.SocketMessage.call(this,"error");
	this.code = code;
	this.message = message;
};
com.tamina.cow4.socket.message.Error.__name__ = true;
com.tamina.cow4.socket.message.Error.__super__ = com.tamina.cow4.socket.message.SocketMessage;
com.tamina.cow4.socket.message.Error.prototype = $extend(com.tamina.cow4.socket.message.SocketMessage.prototype,{
	__class__: com.tamina.cow4.socket.message.Error
});
com.tamina.cow4.socket.message._ErrorCode = {};
com.tamina.cow4.socket.message._ErrorCode.ErrorCode_Impl_ = function() { };
com.tamina.cow4.socket.message._ErrorCode.ErrorCode_Impl_.__name__ = true;
com.tamina.cow4.socket.message.GameServerMessage = function(type) {
	com.tamina.cow4.socket.message.SocketMessage.call(this,type);
};
com.tamina.cow4.socket.message.GameServerMessage.__name__ = true;
com.tamina.cow4.socket.message.GameServerMessage.__super__ = com.tamina.cow4.socket.message.SocketMessage;
com.tamina.cow4.socket.message.GameServerMessage.prototype = $extend(com.tamina.cow4.socket.message.SocketMessage.prototype,{
	__class__: com.tamina.cow4.socket.message.GameServerMessage
});
com.tamina.cow4.socket.message.GetTurnOrder = function(data) {
	com.tamina.cow4.socket.message.GameServerMessage.call(this,"getTurnOrder");
	this.data = data;
};
com.tamina.cow4.socket.message.GetTurnOrder.__name__ = true;
com.tamina.cow4.socket.message.GetTurnOrder.__super__ = com.tamina.cow4.socket.message.GameServerMessage;
com.tamina.cow4.socket.message.GetTurnOrder.prototype = $extend(com.tamina.cow4.socket.message.GameServerMessage.prototype,{
	__class__: com.tamina.cow4.socket.message.GetTurnOrder
});
com.tamina.cow4.socket.message.ID = function(id) {
	com.tamina.cow4.socket.message.GameServerMessage.call(this,"id");
	this.id = id;
};
com.tamina.cow4.socket.message.ID.__name__ = true;
com.tamina.cow4.socket.message.ID.__super__ = com.tamina.cow4.socket.message.GameServerMessage;
com.tamina.cow4.socket.message.ID.prototype = $extend(com.tamina.cow4.socket.message.GameServerMessage.prototype,{
	__class__: com.tamina.cow4.socket.message.ID
});
com.tamina.cow4.socket.message.TurnResult = function() {
	com.tamina.cow4.socket.message.ClientMessage.call(this,"turnResult");
	this.actions = new Array();
};
com.tamina.cow4.socket.message.TurnResult.__name__ = true;
com.tamina.cow4.socket.message.TurnResult.__super__ = com.tamina.cow4.socket.message.ClientMessage;
com.tamina.cow4.socket.message.TurnResult.prototype = $extend(com.tamina.cow4.socket.message.ClientMessage.prototype,{
	__class__: com.tamina.cow4.socket.message.TurnResult
});
com.tamina.cow4.socket.message.order = {};
com.tamina.cow4.socket.message.order.MoveOrder = function(targetCell) {
	com.tamina.cow4.model.TurnAction.call(this,"move");
	this.target = targetCell.id;
};
com.tamina.cow4.socket.message.order.MoveOrder.__name__ = true;
com.tamina.cow4.socket.message.order.MoveOrder.__super__ = com.tamina.cow4.model.TurnAction;
com.tamina.cow4.socket.message.order.MoveOrder.prototype = $extend(com.tamina.cow4.model.TurnAction.prototype,{
	__class__: com.tamina.cow4.socket.message.order.MoveOrder
});
com.tamina.cow4.utils = {};
com.tamina.cow4.utils.GameUtils = function() {
};
com.tamina.cow4.utils.GameUtils.__name__ = true;
com.tamina.cow4.utils.GameUtils.getPath = function(fromCell,toCell,map) {
	var p = new com.tamina.cow4.core.PathFinder();
	return p.getPath(fromCell,toCell,map);
};
com.tamina.cow4.utils.GameUtils.prototype = {
	__class__: com.tamina.cow4.utils.GameUtils
};
var haxe = {};
haxe.Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe.Timer.__name__ = true;
haxe.Timer.delay = function(f,time_ms) {
	var t = new haxe.Timer(time_ms);
	t.run = function() {
		t.stop();
		f();
	};
	return t;
};
haxe.Timer.prototype = {
	stop: function() {
		if(this.id == null) return;
		clearInterval(this.id);
		this.id = null;
	}
	,run: function() {
	}
	,__class__: haxe.Timer
};
var js = {};
js.Boot = function() { };
js.Boot.__name__ = true;
js.Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) return Array; else return o.__class__;
};
js.Boot.__string_rec = function(o,s) {
	if(o == null) return "null";
	if(s.length >= 5) return "<...>";
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) t = "object";
	switch(t) {
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) return o[0];
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) str += "," + js.Boot.__string_rec(o[i],s); else str += js.Boot.__string_rec(o[i],s);
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g2 = 0;
			while(_g2 < l) {
				var i2 = _g2++;
				str1 += (i2 > 0?",":"") + js.Boot.__string_rec(o[i2],s);
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
		if(tostr != null && tostr != Object.toString) {
			var s2 = o.toString();
			if(s2 != "[object Object]") return s2;
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) str2 += ", \n";
		str2 += s + k + " : " + js.Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "function":
		return "<function>";
	case "string":
		return o;
	default:
		return String(o);
	}
};
js.Boot.__interfLoop = function(cc,cl) {
	if(cc == null) return false;
	if(cc == cl) return true;
	var intf = cc.__interfaces__;
	if(intf != null) {
		var _g1 = 0;
		var _g = intf.length;
		while(_g1 < _g) {
			var i = _g1++;
			var i1 = intf[i];
			if(i1 == cl || js.Boot.__interfLoop(i1,cl)) return true;
		}
	}
	return js.Boot.__interfLoop(cc.__super__,cl);
};
js.Boot.__instanceof = function(o,cl) {
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
				if(js.Boot.__interfLoop(js.Boot.getClass(o),cl)) return true;
			}
		} else return false;
		if(cl == Class && o.__name__ != null) return true;
		if(cl == Enum && o.__ename__ != null) return true;
		return o.__enum__ == cl;
	}
};
var msignal = {};
msignal.Signal = function(valueClasses) {
	if(valueClasses == null) valueClasses = [];
	this.valueClasses = valueClasses;
	this.slots = msignal.SlotList.NIL;
	this.priorityBased = false;
};
msignal.Signal.__name__ = true;
msignal.Signal.prototype = {
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
		this.slots = msignal.SlotList.NIL;
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
	,__class__: msignal.Signal
};
msignal.Signal0 = function() {
	msignal.Signal.call(this);
};
msignal.Signal0.__name__ = true;
msignal.Signal0.__super__ = msignal.Signal;
msignal.Signal0.prototype = $extend(msignal.Signal.prototype,{
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
		return new msignal.Slot0(this,listener,once,priority);
	}
	,__class__: msignal.Signal0
});
msignal.Signal1 = function(type) {
	msignal.Signal.call(this,[type]);
};
msignal.Signal1.__name__ = true;
msignal.Signal1.__super__ = msignal.Signal;
msignal.Signal1.prototype = $extend(msignal.Signal.prototype,{
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
		return new msignal.Slot1(this,listener,once,priority);
	}
	,__class__: msignal.Signal1
});
msignal.Signal2 = function(type1,type2) {
	msignal.Signal.call(this,[type1,type2]);
};
msignal.Signal2.__name__ = true;
msignal.Signal2.__super__ = msignal.Signal;
msignal.Signal2.prototype = $extend(msignal.Signal.prototype,{
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
		return new msignal.Slot2(this,listener,once,priority);
	}
	,__class__: msignal.Signal2
});
msignal.Slot = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	this.signal = signal;
	this.set_listener(listener);
	this.once = once;
	this.priority = priority;
	this.enabled = true;
};
msignal.Slot.__name__ = true;
msignal.Slot.prototype = {
	remove: function() {
		this.signal.remove(this.listener);
	}
	,set_listener: function(value) {
		return this.listener = value;
	}
	,__class__: msignal.Slot
};
msignal.Slot0 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot0.__name__ = true;
msignal.Slot0.__super__ = msignal.Slot;
msignal.Slot0.prototype = $extend(msignal.Slot.prototype,{
	execute: function() {
		if(!this.enabled) return;
		if(this.once) this.remove();
		this.listener();
	}
	,__class__: msignal.Slot0
});
msignal.Slot1 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot1.__name__ = true;
msignal.Slot1.__super__ = msignal.Slot;
msignal.Slot1.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param != null) value1 = this.param;
		this.listener(value1);
	}
	,__class__: msignal.Slot1
});
msignal.Slot2 = function(signal,listener,once,priority) {
	if(priority == null) priority = 0;
	if(once == null) once = false;
	msignal.Slot.call(this,signal,listener,once,priority);
};
msignal.Slot2.__name__ = true;
msignal.Slot2.__super__ = msignal.Slot;
msignal.Slot2.prototype = $extend(msignal.Slot.prototype,{
	execute: function(value1,value2) {
		if(!this.enabled) return;
		if(this.once) this.remove();
		if(this.param1 != null) value1 = this.param1;
		if(this.param2 != null) value2 = this.param2;
		this.listener(value1,value2);
	}
	,__class__: msignal.Slot2
});
msignal.SlotList = function(head,tail) {
	this.nonEmpty = false;
	if(head == null && tail == null) this.nonEmpty = false; else if(head == null) {
	} else {
		this.head = head;
		if(tail == null) this.tail = msignal.SlotList.NIL; else this.tail = tail;
		this.nonEmpty = true;
	}
};
msignal.SlotList.__name__ = true;
msignal.SlotList.prototype = {
	get_length: function() {
		if(!this.nonEmpty) return 0;
		if(this.tail == msignal.SlotList.NIL) return 1;
		var result = 0;
		var p = this;
		while(p.nonEmpty) {
			++result;
			p = p.tail;
		}
		return result;
	}
	,prepend: function(slot) {
		return new msignal.SlotList(slot,this);
	}
	,append: function(slot) {
		if(slot == null) return this;
		if(!this.nonEmpty) return new msignal.SlotList(slot);
		if(this.tail == msignal.SlotList.NIL) return new msignal.SlotList(slot).prepend(this.head);
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal.SlotList(slot);
		return wholeClone;
	}
	,insertWithPriority: function(slot) {
		if(!this.nonEmpty) return new msignal.SlotList(slot);
		var priority = slot.priority;
		if(priority >= this.head.priority) return this.prepend(slot);
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(priority > current.head.priority) {
				subClone.tail = current.prepend(slot);
				return wholeClone;
			}
			subClone = subClone.tail = new msignal.SlotList(current.head);
			current = current.tail;
		}
		subClone.tail = new msignal.SlotList(slot);
		return wholeClone;
	}
	,filterNot: function(listener) {
		if(!this.nonEmpty || listener == null) return this;
		if(Reflect.compareMethods(this.head.listener,listener)) return this.tail;
		var wholeClone = new msignal.SlotList(this.head);
		var subClone = wholeClone;
		var current = this.tail;
		while(current.nonEmpty) {
			if(Reflect.compareMethods(current.head.listener,listener)) {
				subClone.tail = current.tail;
				return wholeClone;
			}
			subClone = subClone.tail = new msignal.SlotList(current.head);
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
	,__class__: msignal.SlotList
};
var nodejs = {};
nodejs.NodeJS = function() { };
nodejs.NodeJS.__name__ = true;
nodejs.NodeJS.get_dirname = function() {
	return __dirname;
};
nodejs.NodeJS.get_filename = function() {
	return __filename;
};
nodejs.NodeJS.require = function(p_lib) {
	return require(p_lib);
};
nodejs.NodeJS.get_process = function() {
	return process;
};
nodejs.NodeJS.setTimeout = function(cb,ms) {
	return setTimeout(cb,ms);
};
nodejs.NodeJS.clearTimeout = function(t) {
	return clearTimeout(t);
};
nodejs.NodeJS.setInterval = function(cb,ms) {
	return setInterval(cb,ms);
};
nodejs.NodeJS.clearInterval = function(t) {
	return clearInterval(t);
};
nodejs.NodeJS.assert = function(value,message) {
	require('assert')(value,message);
};
nodejs.NodeJS.get_global = function() {
	return global;
};
nodejs.NodeJS.resolve = function() {
	return require.resolve();
};
nodejs.NodeJS.get_cache = function() {
	return require.cache;
};
nodejs.NodeJS.get_extensions = function() {
	return require.extensions;
};
nodejs.NodeJS.get_module = function() {
	return module;
};
nodejs.NodeJS.get_exports = function() {
	return exports;
};
nodejs.NodeJS.get_domain = function() {
	return domain.create();
};
nodejs.NodeJS.get_repl = function() {
	return require('repl');
};
nodejs.ProcessEventType = function() { };
nodejs.ProcessEventType.__name__ = true;
nodejs.REPLEventType = function() { };
nodejs.REPLEventType.__name__ = true;
nodejs.events = {};
nodejs.events.EventEmitterEventType = function() { };
nodejs.events.EventEmitterEventType.__name__ = true;
nodejs.fs = {};
nodejs.fs.ReadStreamEventType = function() { };
nodejs.fs.ReadStreamEventType.__name__ = true;
nodejs.fs.WriteStreamEventType = function() { };
nodejs.fs.WriteStreamEventType.__name__ = true;
nodejs.http = {};
nodejs.http.HTTPMethod = function() { };
nodejs.http.HTTPMethod.__name__ = true;
nodejs.http.HTTPClientRequestEventType = function() { };
nodejs.http.HTTPClientRequestEventType.__name__ = true;
nodejs.http.HTTPServerEventType = function() { };
nodejs.http.HTTPServerEventType.__name__ = true;
nodejs.stream = {};
nodejs.stream.ReadableEventType = function() { };
nodejs.stream.ReadableEventType.__name__ = true;
nodejs.http.IncomingMessageEventType = function() { };
nodejs.http.IncomingMessageEventType.__name__ = true;
nodejs.http.IncomingMessageEventType.__super__ = nodejs.stream.ReadableEventType;
nodejs.http.IncomingMessageEventType.prototype = $extend(nodejs.stream.ReadableEventType.prototype,{
	__class__: nodejs.http.IncomingMessageEventType
});
nodejs.http.ServerResponseEventType = function() { };
nodejs.http.ServerResponseEventType.__name__ = true;
nodejs.net = {};
nodejs.net.TCPServerEventType = function() { };
nodejs.net.TCPServerEventType.__name__ = true;
nodejs.net.TCPSocketEventType = function() { };
nodejs.net.TCPSocketEventType.__name__ = true;
nodejs.stream.WritableEventType = function() { };
nodejs.stream.WritableEventType.__name__ = true;
var org = {};
org.tamina = {};
org.tamina.geom = {};
org.tamina.geom.Point = function(x,y) {
	if(y == null) y = 0;
	if(x == null) x = 0;
	this.x = x;
	this.y = y;
};
org.tamina.geom.Point.__name__ = true;
org.tamina.geom.Point.prototype = {
	__class__: org.tamina.geom.Point
};
org.tamina.utils = {};
org.tamina.utils.UID = function() { };
org.tamina.utils.UID.__name__ = true;
org.tamina.utils.UID.getUID = function() {
	var result = new Date().getTime();
	if(result <= org.tamina.utils.UID._lastUID) result = org.tamina.utils.UID._lastUID + 1;
	org.tamina.utils.UID._lastUID = result;
	return result;
};
var $_, $fid = 0;
function $bind(o,m) { if( m == null ) return null; if( m.__id__ == null ) m.__id__ = $fid++; var f; if( o.hx__closures__ == null ) o.hx__closures__ = {}; else f = o.hx__closures__[m.__id__]; if( f == null ) { f = function(){ return f.method.apply(f.scope, arguments); }; f.scope = o; f.method = m; o.hx__closures__[m.__id__] = f; } return f; }
if(Array.prototype.indexOf) HxOverrides.indexOf = function(a,o,i) {
	return Array.prototype.indexOf.call(a,o,i);
};
Math.NaN = Number.NaN;
Math.NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY;
Math.POSITIVE_INFINITY = Number.POSITIVE_INFINITY;
Math.isFinite = function(i) {
	return isFinite(i);
};
Math.isNaN = function(i1) {
	return isNaN(i1);
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
msignal.SlotList.NIL = new msignal.SlotList(null,null);
com.tamina.cow4.IADemoApp.ALIVE_DURATION = 600000;
com.tamina.cow4.config.Config.ROOT_PATH = "server/";
com.tamina.cow4.config.Config.APP_PORT = 3000;
com.tamina.cow4.config.Config.SOCKET_PORT = 8127;
com.tamina.cow4.config.Config.WEB_SOCKET_PORT = 8128;
com.tamina.cow4.model._Action.Action_Impl_.MOVE = "move";
com.tamina.cow4.model._Action.Action_Impl_.FAIL = "fail";
com.tamina.cow4.model._Action.Action_Impl_.SUCCESS = "success";
com.tamina.cow4.model._Direction.Direction_Impl_.LEFT = 0;
com.tamina.cow4.model._Direction.Direction_Impl_.RIGHT = 1;
com.tamina.cow4.model._Direction.Direction_Impl_.TOP = 2;
com.tamina.cow4.model._Direction.Direction_Impl_.BOTTOM = 3;
com.tamina.cow4.model._ItemType.ItemType_Impl_.POTION = "potion";
com.tamina.cow4.model._ItemType.ItemType_Impl_.PARFUM = "parfum";
com.tamina.cow4.model._ItemType.ItemType_Impl_.TRAP = "trap";
com.tamina.cow4.socket.message.SocketMessage.END_CHAR = "#end#";
com.tamina.cow4.socket.message.Authenticate.MESSAGE_TYPE = "authenticate";
com.tamina.cow4.socket.message.Error.MESSAGE_TYPE = "error";
com.tamina.cow4.socket.message._ErrorCode.ErrorCode_Impl_.ALREADY_AUTH = 1;
com.tamina.cow4.socket.message._ErrorCode.ErrorCode_Impl_.UNKNOWN_MESSAGE = 2;
com.tamina.cow4.socket.message.GetTurnOrder.MESSAGE_TYPE = "getTurnOrder";
com.tamina.cow4.socket.message.ID.MESSAGE_TYPE = "id";
com.tamina.cow4.socket.message.TurnResult.MESSAGE_TYPE = "turnResult";
nodejs.ProcessEventType.Exit = "exit";
nodejs.ProcessEventType.Exception = "uncaughtException";
nodejs.REPLEventType.Exit = "exit";
nodejs.events.EventEmitterEventType.NewListener = "newListener";
nodejs.events.EventEmitterEventType.RemoveListener = "removeListener";
nodejs.fs.ReadStreamEventType.Open = "open";
nodejs.fs.WriteStreamEventType.Open = "open";
nodejs.http.HTTPMethod.Get = "GET";
nodejs.http.HTTPMethod.Post = "POST";
nodejs.http.HTTPMethod.Options = "OPTIONS";
nodejs.http.HTTPMethod.Head = "HEAD";
nodejs.http.HTTPMethod.Put = "PUT";
nodejs.http.HTTPMethod.Delete = "DELETE";
nodejs.http.HTTPMethod.Trace = "TRACE";
nodejs.http.HTTPMethod.Connect = "CONNECT";
nodejs.http.HTTPClientRequestEventType.Response = "response";
nodejs.http.HTTPClientRequestEventType.Socket = "socket";
nodejs.http.HTTPClientRequestEventType.Connect = "connect";
nodejs.http.HTTPClientRequestEventType.Upgrade = "upgrade";
nodejs.http.HTTPClientRequestEventType.Continue = "continue";
nodejs.http.HTTPServerEventType.Listening = "listening";
nodejs.http.HTTPServerEventType.Connection = "connection";
nodejs.http.HTTPServerEventType.Close = "close";
nodejs.http.HTTPServerEventType.Error = "error";
nodejs.http.HTTPServerEventType.Request = "request";
nodejs.http.HTTPServerEventType.CheckContinue = "checkContinue";
nodejs.http.HTTPServerEventType.Connect = "connect";
nodejs.http.HTTPServerEventType.Upgrade = "upgrade";
nodejs.http.HTTPServerEventType.ClientError = "clientError";
nodejs.stream.ReadableEventType.Readable = "readable";
nodejs.stream.ReadableEventType.Data = "data";
nodejs.stream.ReadableEventType.End = "end";
nodejs.stream.ReadableEventType.Close = "close";
nodejs.stream.ReadableEventType.Error = "error";
nodejs.http.IncomingMessageEventType.Data = "data";
nodejs.http.IncomingMessageEventType.Close = "close";
nodejs.http.IncomingMessageEventType.End = "end";
nodejs.http.ServerResponseEventType.Close = "close";
nodejs.http.ServerResponseEventType.Finish = "finish";
nodejs.net.TCPServerEventType.Listening = "listening";
nodejs.net.TCPServerEventType.Connection = "connection";
nodejs.net.TCPServerEventType.Close = "close";
nodejs.net.TCPServerEventType.Error = "error";
nodejs.net.TCPSocketEventType.Connect = "connect";
nodejs.net.TCPSocketEventType.Data = "data";
nodejs.net.TCPSocketEventType.End = "end";
nodejs.net.TCPSocketEventType.TimeOut = "timeout";
nodejs.net.TCPSocketEventType.Drain = "drain";
nodejs.net.TCPSocketEventType.Error = "error";
nodejs.net.TCPSocketEventType.Close = "close";
nodejs.stream.WritableEventType.Drain = "drain";
nodejs.stream.WritableEventType.Finish = "finish";
nodejs.stream.WritableEventType.Pipe = "pipe";
nodejs.stream.WritableEventType.Unpipe = "unpipe";
nodejs.stream.WritableEventType.Error = "error";
org.tamina.utils.UID._lastUID = 0;
com.tamina.cow4.IADemoApp.main();
})();
