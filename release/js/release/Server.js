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
var com_tamina_cow4_Server = function() {
	this._express = nodejs_express_Express.GetApplication();
	this._express.listen(3000);
	this._express["use"](nodejs_express_Express.Static("server/"));
	var mainRoute = new com_tamina_cow4_routes_MainRoute();
	this._express.get("/",mainRoute.succesHandler);
	var testSocketServerRoute = new com_tamina_cow4_routes_TestSocketServerRoute();
	this._express.get("/" + "SOCKET/TEST",testSocketServerRoute.succesHandler);
	var iaListRoute = new com_tamina_cow4_routes_IAListRoute();
	this._express.get("/" + "IAList",iaListRoute.succesHandler);
	var playRoute = new com_tamina_cow4_routes_PlayRoute();
	this._express.get("/" + "Play",playRoute.succesHandler);
	haxe_Log.trace("server listening on " + 3000,{ fileName : "Server.hx", lineNumber : 48, className : "com.tamina.cow4.Server", methodName : "new"});
	this._socketServer = new com_tamina_cow4_socket_SocketServer(8127);
	this._websocketServer = new com_tamina_cow4_socket_WSocketServer();
	this._gameManager = new com_tamina_cow4_core_GameManager();
};
com_tamina_cow4_Server.__name__ = true;
com_tamina_cow4_Server.main = function() {
	haxe_Log.trace = com_tamina_cow4_Server.myTrace;
	com_tamina_cow4_Server._server = new com_tamina_cow4_Server();
};
com_tamina_cow4_Server.myTrace = function(v,inf) {
	console.info(v);
};
com_tamina_cow4_Server.prototype = {
	__class__: com_tamina_cow4_Server
};
var com_tamina_cow4_config_Config = function() {
};
com_tamina_cow4_config_Config.__name__ = true;
com_tamina_cow4_config_Config.prototype = {
	__class__: com_tamina_cow4_config_Config
};
var com_tamina_cow4_core_Game = function(iaList,gameId,player) {
	this._iaTurnIndex = 0;
	this._timeoutWatcher = new haxe_Timer(com_tamina_cow4_model_GameConstants.TIMEOUT_DURATION);
	this._player = player;
	this._IAList = iaList;
	this._sheep = new com_tamina_cow4_socket_SheepIA();
	this._IAList.push(this._sheep);
	this._data = com_tamina_cow4_data_Mock.get_instance().getDefaultMap();
	this._data.iaList.push(this._IAList[0].toInfo());
	this._data.iaList.push(this._IAList[1].toInfo());
	this._data.iaList.push(this._IAList[2].toInfo());
	this._data.id = gameId;
	this._data.getCellAt(0,0).set_occupant(this._IAList[0].toInfo());
	this._data.getCellAt(24,24).set_occupant(this._IAList[1].toInfo());
	this._data.getCellAt(12,12).set_occupant(this._sheep.toInfo());
};
com_tamina_cow4_core_Game.__name__ = true;
com_tamina_cow4_core_Game.prototype = {
	start: function() {
		this._currentTurn = 0;
		this._isComputing = false;
		this._maxNumTurn = com_tamina_cow4_model_GameConstants.GAME_MAX_NUM_TURN;
		this._startBattleDate = new Date();
		this.initPlayer();
		this.performTurn();
	}
	,initPlayer: function() {
		this._player.render(this._data);
	}
	,performTurn: function() {
		console.info("performTurn");
		this._data.currentTurn = this._currentTurn;
		this.retrieveIAOrders(this._IAList[this._iaTurnIndex]);
	}
	,updatePlayer: function(turn) {
		this._player.updateRender(turn);
	}
	,timeoutHandler: function() {
		this._timeoutWatcher.stop();
		var currentIA = this._IAList[this._iaTurnIndex];
		currentIA.turnComplete.remove($bind(this,this.turnCompleteHandler));
		console.warn(currentIA.id + " : TIMEOUT : next ia turn");
		this._iaTurnIndex++;
		if(this._iaTurnIndex >= this._IAList.length) {
			this._iaTurnIndex = 0;
			this._currentTurn++;
		}
		this.performTurn();
	}
	,retrieveIAOrders: function(targetIA) {
		console.info(targetIA.id + " : retrieveIAOrders");
		targetIA.turnComplete.addOnce($bind(this,this.turnCompleteHandler));
		this._timeoutWatcher.stop();
		this._timeoutWatcher = new haxe_Timer(com_tamina_cow4_model_GameConstants.TIMEOUT_DURATION);
		this._timeoutWatcher.run = $bind(this,this.timeoutHandler);
		this._data.iaList = [];
		this._data.iaList.push(this._IAList[0].toInfo());
		this._data.iaList.push(this._IAList[1].toInfo());
		this._data.iaList.push(this._IAList[2].toInfo());
		this._data.getCellByIA(this._data.iaList[0].id).set_occupant(this._data.iaList[0]);
		this._data.getCellByIA(this._data.iaList[1].id).set_occupant(this._data.iaList[1]);
		this._data.getCellByIA(this._data.iaList[2].id).set_occupant(this._data.iaList[2]);
		var _g1 = 0;
		var _g = this._data.cells.length;
		while(_g1 < _g) {
			var i = _g1++;
			var columns = this._data.cells[i];
			var _g3 = 0;
			var _g2 = columns.length;
			while(_g3 < _g2) {
				var j = _g3++;
				var cell = columns[j];
				if(cell.get_occupant() != null && cell.get_occupant().invisibilityDuration > 0) haxe_Log.trace("INVISIBLE !!!",{ fileName : "Game.hx", lineNumber : 114, className : "com.tamina.cow4.core.Game", methodName : "retrieveIAOrders"});
			}
		}
		var cloneData = this._data.clone();
		var _g11 = 0;
		var _g4 = cloneData.cells.length;
		while(_g11 < _g4) {
			var i1 = _g11++;
			var columns1 = cloneData.cells[i1];
			var _g31 = 0;
			var _g21 = columns1.length;
			while(_g31 < _g21) {
				var j1 = _g31++;
				var cell1 = columns1[j1];
				if(cell1.get_occupant() != null) haxe_Log.trace("cell occupée",{ fileName : "Game.hx", lineNumber : 125, className : "com.tamina.cow4.core.Game", methodName : "retrieveIAOrders"});
				if(cell1.get_occupant() != null && cell1.get_occupant().invisibilityDuration > 0) haxe_Log.trace("INVISIBLE !!!",{ fileName : "Game.hx", lineNumber : 128, className : "com.tamina.cow4.core.Game", methodName : "retrieveIAOrders"});
				if(cell1.get_occupant() != null && cell1.get_occupant().id != targetIA.id && cell1.get_occupant().invisibilityDuration > 0 && targetIA.profil != 0) cell1.set_occupant(null);
			}
		}
		targetIA.getTurnOrder(cloneData);
	}
	,parseTurnResult: function(value) {
		var result = new com_tamina_cow4_core_ParseResult();
		var currentIA = this._IAList[this._iaTurnIndex];
		if(currentIA.trappedDuration <= 0) {
			var _g1 = 0;
			var _g = value.actions.length;
			try {
				while(_g1 < _g) {
					var i = _g1++;
					var _g2 = value.actions[i].type;
					switch(_g2) {
					case "move":
						result = this.parseMoveOrder(value.actions[i]);
						if(result.type != 0) throw "__break__";
						break;
					case "getItem":
						result = this.parseGetItemOrder(value.actions[i]);
						if(result.type != 0) throw "__break__";
						break;
					case "useItem":
						result = this.parseUseItemOrder(value.actions[i]);
						if(result.type != 0) throw "__break__";
						break;
					case "fail":
						break;
					case "success":
						result.type = 1;
						result.message = "action interdite";
						this.end("fail",result.message);
						throw "__break__";
						break;
					}
				}
			} catch( e ) { if( e != "__break__" ) throw e; }
		} else {
			console.info("TRAPPED for " + currentIA.trappedDuration);
			currentIA.trappedDuration--;
			value.actions = [];
		}
		return result;
	}
	,parseGetItemOrder: function(order) {
		var result = new com_tamina_cow4_core_ParseResult();
		var currentIA = this._IAList[this._iaTurnIndex];
		var currentCell = this._data.getCellByIA(currentIA.id);
		if(currentCell.item != null) {
			currentIA.items.push(currentCell.item);
			currentCell.item = null;
		} else {
			result.type = 1;
			result.message = "rien à ramasser";
			console.info(result.message);
		}
		return result;
	}
	,parseUseItemOrder: function(order) {
		var result = new com_tamina_cow4_core_ParseResult();
		var currentIA = this._IAList[this._iaTurnIndex];
		if(currentIA.items.length == 0) {
			result.type = 1;
			result.message = "pas de items à utiliser";
			console.info(result.message);
		} else {
			var item = currentIA.getItemByType(order.item.type);
			if(item == null) {
				result.type = 1;
				result.message = "pas de items de ce type";
				console.info(result.message);
			} else {
				HxOverrides.remove(currentIA.items,item);
				var _g = item.type;
				switch(_g) {
				case "potion":
					console.info("potion utilisée");
					currentIA.invisibilityDuration = com_tamina_cow4_model_GameConstants.INVISIBILITY_DURATION;
					break;
				case "parfum":
					console.info("parfum utilisé");
					var opponent = this.getOpponent(currentIA);
					if(opponent.profil != 2) this._sheep.pm += com_tamina_cow4_model_GameConstants.PARFUM_PM_BOOST; else console.info("opposant immunisé");
					break;
				case "trap":
					console.info("trap utilisé");
					var currentCell = this._data.getCellByIA(currentIA.id);
					currentCell.hasTrap = true;
					break;
				}
			}
		}
		return result;
	}
	,getOpponent: function(target) {
		var result = this._IAList[0];
		if(target.id == result.id) result = this._IAList[1];
		return result;
	}
	,parseMoveOrder: function(order) {
		var result = new com_tamina_cow4_core_ParseResult();
		var currentIA = this._IAList[this._iaTurnIndex];
		var currentCell = this._data.getCellByIA(currentIA.id);
		var targetCell = currentCell.getNeighboorById(order.target);
		if(targetCell != null) {
			if(targetCell.get_occupant() != null) {
				if(targetCell.get_occupant().id == this._sheep.id) {
					result.type = 2;
					result.message = "cible attrapée";
					console.info(result.message);
				} else {
					result.type = 1;
					result.message = "la case ciblée est deja occupée";
					console.info(result.message);
				}
			} else {
				targetCell.set_occupant(currentCell.get_occupant());
				currentCell.set_occupant(null);
				currentIA.pm--;
				if(currentIA.pm < 0) {
					result.type = 1;
					result.message = "pas assez de mouvement";
					console.info(result.message);
				}
				if(targetCell.hasTrap && currentIA.profil != 1) currentIA.trappedDuration = com_tamina_cow4_model_GameConstants.TRAPED_DURATION; else console.info("immunisé trap");
			}
		} else {
			result.type = 1;
			result.message = "la case ciblée nest pas voisine de la courante";
			console.info(result.message);
		}
		return result;
	}
	,turnCompleteHandler: function(result) {
		console.info("fin de tour");
		this._timeoutWatcher.stop();
		var parseResult = this.parseTurnResult(result);
		if(parseResult.type == 0) {
			var currentIA = this._IAList[this._iaTurnIndex];
			if(currentIA.pm < com_tamina_cow4_model_GameConstants.MAX_PM) currentIA.pm++;
			if(currentIA.id == this._sheep.id) currentIA.pm = 1;
			if(currentIA.invisibilityDuration > 0) currentIA.invisibilityDuration--;
			result.ia = currentIA.toInfo();
			this._data.getIAById(currentIA.id).pm = currentIA.pm;
			this.updatePlayer(result);
			this._iaTurnIndex++;
			if(this._iaTurnIndex >= this._IAList.length) {
				this._iaTurnIndex = 0;
				this._currentTurn++;
			}
			if(this._currentTurn < this._maxNumTurn) this.performTurn(); else this.end("fail","nombre de tour max");
		} else if(parseResult.type == 2) this.end("success",parseResult.message); else this.end("fail",parseResult.message);
	}
	,end: function(action,message) {
		var result = new com_tamina_cow4_socket_message_TurnResult();
		result.actions.push(new com_tamina_cow4_socket_message_order_EndOrder(action,message));
		result.ia = this._IAList[this._iaTurnIndex].toInfo();
		this._IAList[0].pm = 1;
		this._IAList[1].pm = 1;
		this._IAList[2].pm = 1;
		this.updatePlayer(result);
		console.info(message);
	}
	,__class__: com_tamina_cow4_core_Game
};
var com_tamina_cow4_core_GameManager = function() {
	this._games = [];
	com_tamina_cow4_events_NotificationBus.get_instance().startBattle.add($bind(this,this.startBattleHandler));
};
com_tamina_cow4_core_GameManager.__name__ = true;
com_tamina_cow4_core_GameManager.prototype = {
	startBattleHandler: function(battle) {
		var list = [];
		var _g1 = 0;
		var _g = battle.IAList.length;
		while(_g1 < _g) {
			var i = _g1++;
			list.push(battle.IAList[i]);
		}
		var game = new com_tamina_cow4_core_Game(list,battle.gameId,battle.player);
		this._games.push(game);
		game.start();
	}
	,__class__: com_tamina_cow4_core_GameManager
};
var com_tamina_cow4_core_ParseResult = function() {
	this.type = 0;
	this.message = "";
};
com_tamina_cow4_core_ParseResult.__name__ = true;
com_tamina_cow4_core_ParseResult.prototype = {
	__class__: com_tamina_cow4_core_ParseResult
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
var com_tamina_cow4_data_Mock = function() {
};
com_tamina_cow4_data_Mock.__name__ = true;
com_tamina_cow4_data_Mock.get_instance = function() {
	if(com_tamina_cow4_data_Mock._instance == null) com_tamina_cow4_data_Mock._instance = new com_tamina_cow4_data_Mock();
	return com_tamina_cow4_data_Mock._instance;
};
com_tamina_cow4_data_Mock.prototype = {
	getDefaultMap: function() {
		var importedModel = JSON.parse("{\"currentTurn\":0,\"cells\":[[{\"id\":1424090482209,\"bottom\":1424090482258,\"right\":1424090482210},{\"id\":1424090482210,\"left\":1424090482209,\"right\":1424090482211},{\"id\":1424090482211,\"left\":1424090482210,\"right\":1424090482212},{\"id\":1424090482212,\"left\":1424090482211,\"right\":1424090482213},{\"id\":1424090482213,\"left\":1424090482212,\"right\":1424090482214},{\"id\":1424090482214,\"left\":1424090482213,\"right\":1424090482215},{\"id\":1424090482215,\"left\":1424090482214,\"right\":1424090482216},{\"id\":1424090482216,\"bottom\":1424090482251,\"left\":1424090482215,\"right\":1424090482217},{\"id\":1424090482217,\"left\":1424090482216,\"right\":1424090482218},{\"id\":1424090482218,\"left\":1424090482217,\"right\":1424090482219},{\"id\":1424090482219,\"bottom\":1424090482248,\"left\":1424090482218,\"right\":1424090482220},{\"id\":1424090482220,\"left\":1424090482219,\"right\":1424090482221},{\"id\":1424090482221,\"left\":1424090482220,\"right\":1424090482222},{\"id\":1424090482222,\"bottom\":1424090482245,\"left\":1424090482221},{\"id\":1424090482223},{\"id\":1424090482224,\"bottom\":1424090482243,\"right\":1424090482225},{\"id\":1424090482225,\"left\":1424090482224,\"right\":1424090482226},{\"id\":1424090482226,\"left\":1424090482225,\"right\":1424090482227},{\"id\":1424090482227,\"left\":1424090482226,\"right\":1424090482228},{\"id\":1424090482228,\"left\":1424090482227,\"right\":1424090482229},{\"id\":1424090482229,\"left\":1424090482228,\"right\":1424090482230},{\"id\":1424090482230,\"left\":1424090482229,\"right\":1424090482231},{\"id\":1424090482231,\"left\":1424090482230,\"right\":1424090482232},{\"id\":1424090482232,\"left\":1424090482231,\"right\":1424090482233},{\"id\":1424090482233,\"bottom\":1424090482234,\"left\":1424090482232}],[{\"id\":1424090482258,\"top\":1424090482209,\"bottom\":1424090482259},{\"id\":1424090482257,\"bottom\":1424090482260,\"right\":1424090482256},{\"id\":1424090482256,\"left\":1424090482257,\"right\":1424090482255},{\"id\":1424090482255,\"bottom\":1424090482262,\"left\":1424090482256},{\"id\":1424090482254,\"bottom\":1424090482263,\"right\":1424090482253},{\"id\":1424090482253,\"left\":1424090482254,\"right\":1424090482252},{\"id\":1424090482252,\"bottom\":1424090482265,\"left\":1424090482253},{\"id\":1424090482251,\"top\":1424090482216,\"right\":1424090482250},{\"id\":1424090482250,\"left\":1424090482251,\"right\":1424090482249},{\"id\":1424090482249,\"bottom\":1424090482268,\"left\":1424090482250},{\"id\":1424090482248,\"top\":1424090482219,\"right\":1424090482247},{\"id\":1424090482247,\"left\":1424090482248,\"right\":1424090482246},{\"id\":1424090482246,\"bottom\":1424090482271,\"left\":1424090482247},{\"id\":1424090482245,\"top\":1424090482222,\"right\":1424090482244},{\"id\":1424090482244,\"left\":1424090482245,\"right\":1424090482243},{\"id\":1424090482243,\"top\":1424090482224,\"left\":1424090482244},{\"id\":1424090482242,\"bottom\":1424090482275,\"right\":1424090482241},{\"id\":1424090482241,\"left\":1424090482242,\"right\":1424090482240},{\"id\":1424090482240,\"left\":1424090482241,\"right\":1424090482239},{\"id\":1424090482239,\"left\":1424090482240,\"right\":1424090482238},{\"id\":1424090482238,\"left\":1424090482239,\"right\":1424090482237},{\"id\":1424090482237,\"left\":1424090482238,\"right\":1424090482236},{\"id\":1424090482236,\"left\":1424090482237,\"right\":1424090482235},{\"id\":1424090482235,\"left\":1424090482236,\"right\":1424090482234},{\"id\":1424090482234,\"top\":1424090482233,\"left\":1424090482235}],[{\"id\":1424090482259,\"top\":1424090482258,\"right\":1424090482260},{\"id\":1424090482260,\"top\":1424090482257,\"left\":1424090482259},{\"id\":1424090482261,\"right\":1424090482262},{\"id\":1424090482262,\"top\":1424090482255,\"left\":1424090482261,\"right\":1424090482263},{\"id\":1424090482263,\"top\":1424090482254,\"left\":1424090482262},{\"id\":1424090482264,\"bottom\":1424090482303,\"right\":1424090482265},{\"id\":1424090482265,\"top\":1424090482252,\"left\":1424090482264,\"right\":1424090482266},{\"id\":1424090482266,\"left\":1424090482265,\"right\":1424090482267},{\"id\":1424090482267,\"bottom\":1424090482300,\"left\":1424090482266},{\"id\":1424090482268,\"top\":1424090482249,\"right\":1424090482269},{\"id\":1424090482269,\"left\":1424090482268,\"right\":1424090482270},{\"id\":1424090482270,\"bottom\":1424090482297,\"left\":1424090482269},{\"id\":1424090482271,\"top\":1424090482246,\"right\":1424090482272},{\"id\":1424090482272,\"left\":1424090482271,\"right\":1424090482273},{\"id\":1424090482273,\"left\":1424090482272,\"right\":1424090482274},{\"id\":1424090482274,\"left\":1424090482273,\"right\":1424090482275},{\"id\":1424090482275,\"top\":1424090482242,\"bottom\":1424090482292,\"left\":1424090482274},{\"id\":1424090482276,\"bottom\":1424090482291,\"right\":1424090482277},{\"id\":1424090482277,\"left\":1424090482276,\"right\":1424090482278},{\"id\":1424090482278,\"left\":1424090482277,\"right\":1424090482279},{\"id\":1424090482279,\"left\":1424090482278,\"right\":1424090482280},{\"id\":1424090482280,\"left\":1424090482279,\"right\":1424090482281},{\"id\":1424090482281,\"left\":1424090482280,\"right\":1424090482282},{\"id\":1424090482282,\"left\":1424090482281,\"right\":1424090482283},{\"id\":1424090482283,\"bottom\":1424090482284,\"left\":1424090482282}],[{\"id\":1424090482308,\"bottom\":1424090482309,\"right\":1424090482307},{\"id\":1424090482307,\"left\":1424090482308,\"right\":1424090482306},{\"id\":1424090482306,\"left\":1424090482307,\"right\":1424090482305},{\"id\":1424090482305,\"left\":1424090482306,\"right\":1424090482304},{\"id\":1424090482304,\"left\":1424090482305,\"right\":1424090482303},{\"id\":1424090482303,\"top\":1424090482264,\"bottom\":1424090482314,\"left\":1424090482304},{\"id\":1424090482302,\"bottom\":1424090482315,\"right\":1424090482301},{\"id\":1424090482301,\"item\":{\"type\":\"trap\"},\"bottom\":1424090482316,\"left\":1424090482302},{\"id\":1424090482300,\"top\":1424090482267,\"right\":1424090482299},{\"id\":1424090482299,\"left\":1424090482300,\"right\":1424090482298},{\"id\":1424090482298,\"bottom\":1424090482319,\"left\":1424090482299},{\"id\":1424090482297,\"top\":1424090482270,\"right\":1424090482296},{\"id\":1424090482296,\"left\":1424090482297,\"right\":1424090482295},{\"id\":1424090482295,\"left\":1424090482296,\"right\":1424090482294},{\"id\":1424090482294,\"left\":1424090482295,\"right\":1424090482293},{\"id\":1424090482293,\"bottom\":1424090482324,\"left\":1424090482294},{\"id\":1424090482292,\"top\":1424090482275,\"right\":1424090482291},{\"id\":1424090482291,\"top\":1424090482276,\"left\":1424090482292},{\"id\":1424090482290,\"bottom\":1424090482327,\"right\":1424090482289},{\"id\":1424090482289,\"left\":1424090482290,\"right\":1424090482288},{\"id\":1424090482288,\"bottom\":1424090482329,\"left\":1424090482289,\"right\":1424090482287},{\"id\":1424090482287,\"left\":1424090482288,\"right\":1424090482286},{\"id\":1424090482286,\"left\":1424090482287,\"right\":1424090482285},{\"id\":1424090482285,\"left\":1424090482286,\"right\":1424090482284},{\"id\":1424090482284,\"top\":1424090482283,\"left\":1424090482285}],[{\"id\":1424090482309,\"top\":1424090482308,\"bottom\":1424090482358},{\"id\":1424090482310,\"bottom\":1424090482357,\"right\":1424090482311},{\"id\":1424090482311,\"left\":1424090482310,\"right\":1424090482312},{\"id\":1424090482312,\"left\":1424090482311,\"right\":1424090482313},{\"id\":1424090482313,\"left\":1424090482312,\"right\":1424090482314},{\"id\":1424090482314,\"top\":1424090482303,\"left\":1424090482313},{\"id\":1424090482315,\"top\":1424090482302,\"bottom\":1424090482352},{\"id\":1424090482316,\"top\":1424090482301,\"bottom\":1424090482351},{\"id\":1424090482317,\"right\":1424090482318},{\"id\":1424090482318,\"left\":1424090482317,\"right\":1424090482319},{\"id\":1424090482319,\"top\":1424090482298,\"left\":1424090482318,\"right\":1424090482320},{\"id\":1424090482320,\"left\":1424090482319,\"right\":1424090482321},{\"id\":1424090482321,\"left\":1424090482320,\"right\":1424090482322},{\"id\":1424090482322,\"bottom\":1424090482345,\"left\":1424090482321,\"right\":1424090482323},{\"id\":1424090482323,\"left\":1424090482322,\"right\":1424090482324},{\"id\":1424090482324,\"top\":1424090482293,\"left\":1424090482323,\"right\":1424090482325},{\"id\":1424090482325,\"left\":1424090482324,\"right\":1424090482326},{\"id\":1424090482326,\"left\":1424090482325,\"right\":1424090482327},{\"id\":1424090482327,\"top\":1424090482290,\"bottom\":1424090482340,\"left\":1424090482326,\"right\":1424090482328},{\"id\":1424090482328,\"left\":1424090482327,\"right\":1424090482329},{\"id\":1424090482329,\"top\":1424090482288,\"bottom\":1424090482338,\"left\":1424090482328},{\"id\":1424090482330,\"item\":{\"type\":\"potion\"},\"right\":1424090482331},{\"id\":1424090482331,\"left\":1424090482330,\"right\":1424090482332},{\"id\":1424090482332,\"left\":1424090482331,\"right\":1424090482333},{\"id\":1424090482333,\"bottom\":1424090482334,\"left\":1424090482332}],[{\"id\":1424090482358,\"top\":1424090482309,\"bottom\":1424090482359},{\"id\":1424090482357,\"top\":1424090482310,\"bottom\":1424090482360},{\"id\":1424090482356,\"bottom\":1424090482361,\"right\":1424090482355},{\"id\":1424090482355,\"left\":1424090482356,\"right\":1424090482354},{\"id\":1424090482354,\"left\":1424090482355,\"right\":1424090482353},{\"id\":1424090482353,\"left\":1424090482354,\"right\":1424090482352},{\"id\":1424090482352,\"top\":1424090482315,\"left\":1424090482353},{\"id\":1424090482351,\"top\":1424090482316,\"right\":1424090482350},{\"id\":1424090482350,\"left\":1424090482351,\"right\":1424090482349},{\"id\":1424090482349,\"left\":1424090482350,\"right\":1424090482348},{\"id\":1424090482348,\"bottom\":1424090482369,\"left\":1424090482349},{\"id\":1424090482347,\"bottom\":1424090482370,\"right\":1424090482346},{\"id\":1424090482346,\"bottom\":1424090482371,\"left\":1424090482347},{\"id\":1424090482345,\"top\":1424090482322,\"right\":1424090482344},{\"id\":1424090482344,\"left\":1424090482345,\"right\":1424090482343},{\"id\":1424090482343,\"left\":1424090482344,\"right\":1424090482342},{\"id\":1424090482342,\"left\":1424090482343,\"right\":1424090482341},{\"id\":1424090482341,\"left\":1424090482342,\"right\":1424090482340},{\"id\":1424090482340,\"top\":1424090482327,\"bottom\":1424090482377,\"left\":1424090482341,\"right\":1424090482339},{\"id\":1424090482339,\"left\":1424090482340,\"right\":1424090482338},{\"id\":1424090482338,\"top\":1424090482329,\"left\":1424090482339,\"right\":1424090482337},{\"id\":1424090482337,\"left\":1424090482338,\"right\":1424090482336},{\"id\":1424090482336,\"left\":1424090482337,\"right\":1424090482335},{\"id\":1424090482335,\"left\":1424090482336,\"right\":1424090482334},{\"id\":1424090482334,\"top\":1424090482333,\"left\":1424090482335}],[{\"id\":1424090482359,\"top\":1424090482358,\"bottom\":1424090482408},{\"id\":1424090482360,\"top\":1424090482357,\"bottom\":1424090482407},{\"id\":1424090482361,\"top\":1424090482356,\"right\":1424090482362},{\"id\":1424090482362,\"left\":1424090482361,\"right\":1424090482363},{\"id\":1424090482363,\"left\":1424090482362,\"right\":1424090482364},{\"id\":1424090482364,\"bottom\":1424090482403,\"left\":1424090482363},{\"id\":1424090482365,\"bottom\":1424090482402,\"right\":1424090482366},{\"id\":1424090482366,\"left\":1424090482365,\"right\":1424090482367},{\"id\":1424090482367,\"left\":1424090482366,\"right\":1424090482368},{\"id\":1424090482368,\"bottom\":1424090482399,\"left\":1424090482367},{\"id\":1424090482369,\"top\":1424090482348,\"bottom\":1424090482398},{\"id\":1424090482370,\"top\":1424090482347,\"bottom\":1424090482397},{\"id\":1424090482371,\"top\":1424090482346,\"right\":1424090482372},{\"id\":1424090482372,\"left\":1424090482371,\"right\":1424090482373},{\"id\":1424090482373,\"left\":1424090482372,\"right\":1424090482374},{\"id\":1424090482374,\"left\":1424090482373,\"right\":1424090482375},{\"id\":1424090482375,\"left\":1424090482374,\"right\":1424090482376},{\"id\":1424090482376,\"bottom\":1424090482391,\"left\":1424090482375},{\"id\":1424090482377,\"top\":1424090482340,\"right\":1424090482378},{\"id\":1424090482378,\"left\":1424090482377,\"right\":1424090482379},{\"id\":1424090482379,\"left\":1424090482378,\"right\":1424090482380},{\"id\":1424090482380,\"left\":1424090482379,\"right\":1424090482381},{\"id\":1424090482381,\"left\":1424090482380,\"right\":1424090482382},{\"id\":1424090482382,\"left\":1424090482381,\"right\":1424090482383},{\"id\":1424090482383,\"bottom\":1424090482384,\"left\":1424090482382}],[{\"id\":1424090482408,\"top\":1424090482359,\"bottom\":1424090482409},{\"id\":1424090482407,\"top\":1424090482360,\"right\":1424090482406},{\"id\":1424090482406,\"left\":1424090482407,\"right\":1424090482405},{\"id\":1424090482405,\"left\":1424090482406,\"right\":1424090482404},{\"id\":1424090482404,\"left\":1424090482405,\"right\":1424090482403},{\"id\":1424090482403,\"top\":1424090482364,\"left\":1424090482404},{\"id\":1424090482402,\"top\":1424090482365,\"right\":1424090482401},{\"id\":1424090482401,\"left\":1424090482402,\"right\":1424090482400},{\"id\":1424090482400,\"bottom\":1424090482417,\"left\":1424090482401},{\"id\":1424090482399,\"top\":1424090482368,\"right\":1424090482398},{\"id\":1424090482398,\"top\":1424090482369,\"left\":1424090482399},{\"id\":1424090482397,\"top\":1424090482370,\"right\":1424090482396},{\"id\":1424090482396,\"left\":1424090482397,\"right\":1424090482395},{\"id\":1424090482395,\"left\":1424090482396,\"right\":1424090482394},{\"id\":1424090482394,\"left\":1424090482395,\"right\":1424090482393},{\"id\":1424090482393,\"left\":1424090482394,\"right\":1424090482392},{\"id\":1424090482392,\"bottom\":1424090482425,\"left\":1424090482393},{\"id\":1424090482391,\"top\":1424090482376,\"bottom\":1424090482426,\"right\":1424090482390},{\"id\":1424090482390,\"bottom\":1424090482427,\"left\":1424090482391},{\"id\":1424090482389,\"bottom\":1424090482428,\"right\":1424090482388},{\"id\":1424090482388,\"bottom\":1424090482429,\"left\":1424090482389,\"right\":1424090482387},{\"id\":1424090482387,\"left\":1424090482388,\"right\":1424090482386},{\"id\":1424090482386,\"left\":1424090482387,\"right\":1424090482385},{\"id\":1424090482385,\"left\":1424090482386,\"right\":1424090482384},{\"id\":1424090482384,\"top\":1424090482383,\"bottom\":1424090482433,\"left\":1424090482385}],[{\"id\":1424090482409,\"top\":1424090482408,\"right\":1424090482410},{\"id\":1424090482410,\"left\":1424090482409,\"right\":1424090482411},{\"id\":1424090482411,\"left\":1424090482410,\"right\":1424090482412},{\"id\":1424090482412,\"bottom\":1424090482455,\"left\":1424090482411,\"right\":1424090482413},{\"id\":1424090482413,\"left\":1424090482412,\"right\":1424090482414},{\"id\":1424090482414,\"left\":1424090482413,\"right\":1424090482415},{\"id\":1424090482415,\"left\":1424090482414,\"right\":1424090482416},{\"id\":1424090482416,\"left\":1424090482415},{\"id\":1424090482417,\"top\":1424090482400,\"right\":1424090482418},{\"id\":1424090482418,\"left\":1424090482417,\"right\":1424090482419},{\"id\":1424090482419,\"left\":1424090482418,\"right\":1424090482420},{\"id\":1424090482420,\"left\":1424090482419,\"right\":1424090482421},{\"id\":1424090482421,\"bottom\":1424090482446,\"left\":1424090482420,\"right\":1424090482422},{\"id\":1424090482422,\"left\":1424090482421,\"right\":1424090482423},{\"id\":1424090482423,\"left\":1424090482422,\"right\":1424090482424},{\"id\":1424090482424,\"left\":1424090482423,\"right\":1424090482425},{\"id\":1424090482425,\"top\":1424090482392,\"left\":1424090482424},{\"id\":1424090482426,\"top\":1424090482391},{\"id\":1424090482427,\"top\":1424090482390,\"right\":1424090482428},{\"id\":1424090482428,\"top\":1424090482389,\"left\":1424090482427},{\"id\":1424090482429,\"top\":1424090482388,\"bottom\":1424090482438},{\"id\":1424090482430,\"right\":1424090482431},{\"id\":1424090482431,\"left\":1424090482430,\"right\":1424090482432},{\"id\":1424090482432,\"left\":1424090482431,\"right\":1424090482433},{\"id\":1424090482433,\"top\":1424090482384,\"left\":1424090482432}],[{\"id\":1424090482458,\"bottom\":1424090482459,\"right\":1424090482457},{\"id\":1424090482457,\"left\":1424090482458,\"right\":1424090482456},{\"id\":1424090482456,\"left\":1424090482457,\"right\":1424090482455},{\"id\":1424090482455,\"top\":1424090482412,\"left\":1424090482456,\"right\":1424090482454},{\"id\":1424090482454,\"left\":1424090482455,\"right\":1424090482453},{\"id\":1424090482453,\"left\":1424090482454,\"right\":1424090482452},{\"id\":1424090482452,\"left\":1424090482453,\"right\":1424090482451},{\"id\":1424090482451,\"left\":1424090482452},{\"id\":1424090482450,\"bottom\":1424090482467,\"right\":1424090482449},{\"id\":1424090482449,\"left\":1424090482450,\"right\":1424090482448},{\"id\":1424090482448,\"left\":1424090482449,\"right\":1424090482447},{\"id\":1424090482447,\"left\":1424090482448,\"right\":1424090482446},{\"id\":1424090482446,\"top\":1424090482421,\"left\":1424090482447,\"right\":1424090482445},{\"id\":1424090482445,\"left\":1424090482446,\"right\":1424090482444},{\"id\":1424090482444,\"left\":1424090482445,\"right\":1424090482443},{\"id\":1424090482443,\"left\":1424090482444,\"right\":1424090482442},{\"id\":1424090482442,\"left\":1424090482443},{\"id\":1424090482441,\"bottom\":1424090482476,\"right\":1424090482440},{\"id\":1424090482440,\"left\":1424090482441,\"right\":1424090482439},{\"id\":1424090482439,\"left\":1424090482440,\"right\":1424090482438},{\"id\":1424090482438,\"top\":1424090482429,\"left\":1424090482439,\"right\":1424090482437},{\"id\":1424090482437,\"left\":1424090482438,\"right\":1424090482436},{\"id\":1424090482436,\"left\":1424090482437,\"right\":1424090482435},{\"id\":1424090482435,\"left\":1424090482436,\"right\":1424090482434},{\"id\":1424090482434,\"bottom\":1424090482483,\"left\":1424090482435}],[{\"id\":1424090482459,\"top\":1424090482458,\"right\":1424090482460},{\"id\":1424090482460,\"left\":1424090482459,\"right\":1424090482461},{\"id\":1424090482461,\"left\":1424090482460,\"right\":1424090482462},{\"id\":1424090482462,\"left\":1424090482461,\"right\":1424090482463},{\"id\":1424090482463,\"bottom\":1424090482504,\"left\":1424090482462,\"right\":1424090482464},{\"id\":1424090482464,\"bottom\":1424090482503,\"left\":1424090482463,\"right\":1424090482465},{\"id\":1424090482465,\"left\":1424090482464,\"right\":1424090482466},{\"id\":1424090482466,\"item\":{\"type\":\"parfum\"},\"left\":1424090482465},{\"id\":1424090482467,\"top\":1424090482450,\"bottom\":1424090482500,\"right\":1424090482468},{\"id\":1424090482468,\"left\":1424090482467,\"right\":1424090482469},{\"id\":1424090482469,\"left\":1424090482468,\"right\":1424090482470},{\"id\":1424090482470,\"left\":1424090482469,\"right\":1424090482471},{\"id\":1424090482471,\"bottom\":1424090482496,\"left\":1424090482470,\"right\":1424090482472},{\"id\":1424090482472,\"left\":1424090482471,\"right\":1424090482473},{\"id\":1424090482473,\"left\":1424090482472,\"right\":1424090482474},{\"id\":1424090482474,\"left\":1424090482473,\"right\":1424090482475},{\"id\":1424090482475,\"bottom\":1424090482492,\"left\":1424090482474},{\"id\":1424090482476,\"top\":1424090482441,\"right\":1424090482477},{\"id\":1424090482477,\"left\":1424090482476,\"right\":1424090482478},{\"id\":1424090482478,\"left\":1424090482477,\"right\":1424090482479},{\"id\":1424090482479,\"bottom\":1424090482488,\"left\":1424090482478,\"right\":1424090482480},{\"id\":1424090482480,\"bottom\":1424090482487,\"left\":1424090482479,\"right\":1424090482481},{\"id\":1424090482481,\"left\":1424090482480,\"right\":1424090482482},{\"id\":1424090482482,\"left\":1424090482481,\"right\":1424090482483},{\"id\":1424090482483,\"top\":1424090482434,\"left\":1424090482482}],[{\"id\":1424090482508,\"bottom\":1424090482509,\"right\":1424090482507},{\"id\":1424090482507,\"left\":1424090482508,\"right\":1424090482506},{\"id\":1424090482506,\"left\":1424090482507,\"right\":1424090482505},{\"id\":1424090482505,\"left\":1424090482506,\"right\":1424090482504},{\"id\":1424090482504,\"top\":1424090482463,\"left\":1424090482505},{\"id\":1424090482503,\"top\":1424090482464,\"right\":1424090482502},{\"id\":1424090482502,\"left\":1424090482503,\"right\":1424090482501},{\"id\":1424090482501,\"left\":1424090482502,\"right\":1424090482500},{\"id\":1424090482500,\"top\":1424090482467,\"left\":1424090482501,\"right\":1424090482499},{\"id\":1424090482499,\"left\":1424090482500,\"right\":1424090482498},{\"id\":1424090482498,\"left\":1424090482499},{\"id\":1424090482497,\"bottom\":1424090482520,\"right\":1424090482496},{\"id\":1424090482496,\"top\":1424090482471,\"left\":1424090482497,\"right\":1424090482495},{\"id\":1424090482495,\"bottom\":1424090482522,\"left\":1424090482496},{\"id\":1424090482494,\"right\":1424090482493},{\"id\":1424090482493,\"left\":1424090482494,\"right\":1424090482492},{\"id\":1424090482492,\"top\":1424090482475,\"left\":1424090482493,\"right\":1424090482491},{\"id\":1424090482491,\"left\":1424090482492,\"right\":1424090482490},{\"id\":1424090482490,\"left\":1424090482491,\"right\":1424090482489},{\"id\":1424090482489,\"left\":1424090482490,\"right\":1424090482488},{\"id\":1424090482488,\"top\":1424090482479,\"left\":1424090482489},{\"id\":1424090482487,\"top\":1424090482480,\"right\":1424090482486},{\"id\":1424090482486,\"left\":1424090482487,\"right\":1424090482485},{\"id\":1424090482485,\"left\":1424090482486,\"right\":1424090482484},{\"id\":1424090482484,\"bottom\":1424090482533,\"left\":1424090482485}],[{\"id\":1424090482509,\"top\":1424090482508,\"bottom\":1424090482558,\"right\":1424090482510},{\"id\":1424090482510,\"left\":1424090482509,\"right\":1424090482511},{\"id\":1424090482511,\"left\":1424090482510,\"right\":1424090482512},{\"id\":1424090482512,\"left\":1424090482511,\"right\":1424090482513},{\"id\":1424090482513,\"left\":1424090482512,\"right\":1424090482514},{\"id\":1424090482514,\"left\":1424090482513,\"right\":1424090482515},{\"id\":1424090482515,\"left\":1424090482514,\"right\":1424090482516},{\"id\":1424090482516,\"left\":1424090482515,\"right\":1424090482517},{\"id\":1424090482517,\"left\":1424090482516,\"right\":1424090482518},{\"id\":1424090482518,\"left\":1424090482517,\"right\":1424090482519},{\"id\":1424090482519,\"left\":1424090482518,\"right\":1424090482520},{\"id\":1424090482520,\"top\":1424090482497,\"bottom\":1424090482547,\"left\":1424090482519,\"right\":1424090482521},{\"id\":1424090482521,\"left\":1424090482520,\"right\":1424090482522},{\"id\":1424090482522,\"top\":1424090482495,\"bottom\":1424090482545,\"left\":1424090482521,\"right\":1424090482523},{\"id\":1424090482523,\"left\":1424090482522,\"right\":1424090482524},{\"id\":1424090482524,\"left\":1424090482523,\"right\":1424090482525},{\"id\":1424090482525,\"left\":1424090482524,\"right\":1424090482526},{\"id\":1424090482526,\"left\":1424090482525,\"right\":1424090482527},{\"id\":1424090482527,\"left\":1424090482526,\"right\":1424090482528},{\"id\":1424090482528,\"left\":1424090482527,\"right\":1424090482529},{\"id\":1424090482529,\"left\":1424090482528,\"right\":1424090482530},{\"id\":1424090482530,\"left\":1424090482529,\"right\":1424090482531},{\"id\":1424090482531,\"left\":1424090482530,\"right\":1424090482532},{\"id\":1424090482532,\"left\":1424090482531,\"right\":1424090482533},{\"id\":1424090482533,\"top\":1424090482484,\"bottom\":1424090482534,\"left\":1424090482532}],[{\"id\":1424090482558,\"top\":1424090482509,\"right\":1424090482557},{\"id\":1424090482557,\"left\":1424090482558,\"right\":1424090482556},{\"id\":1424090482556,\"left\":1424090482557,\"right\":1424090482555},{\"id\":1424090482555,\"bottom\":1424090482562,\"left\":1424090482556},{\"id\":1424090482554,\"bottom\":1424090482563,\"right\":1424090482553},{\"id\":1424090482553,\"left\":1424090482554,\"right\":1424090482552},{\"id\":1424090482552,\"left\":1424090482553,\"right\":1424090482551},{\"id\":1424090482551,\"left\":1424090482552,\"right\":1424090482550},{\"id\":1424090482550,\"bottom\":1424090482567,\"left\":1424090482551,\"right\":1424090482549},{\"id\":1424090482549,\"left\":1424090482550,\"right\":1424090482548},{\"id\":1424090482548,\"left\":1424090482549},{\"id\":1424090482547,\"top\":1424090482520,\"right\":1424090482546},{\"id\":1424090482546,\"bottom\":1424090482571,\"left\":1424090482547,\"right\":1424090482545},{\"id\":1424090482545,\"top\":1424090482522,\"left\":1424090482546},{\"id\":1424090482544,\"right\":1424090482543},{\"id\":1424090482543,\"left\":1424090482544,\"right\":1424090482542},{\"id\":1424090482542,\"bottom\":1424090482575,\"left\":1424090482543,\"right\":1424090482541},{\"id\":1424090482541,\"left\":1424090482542,\"right\":1424090482540},{\"id\":1424090482540,\"left\":1424090482541,\"right\":1424090482539},{\"id\":1424090482539,\"bottom\":1424090482578,\"left\":1424090482540},{\"id\":1424090482538,\"bottom\":1424090482579,\"right\":1424090482537},{\"id\":1424090482537,\"left\":1424090482538,\"right\":1424090482536},{\"id\":1424090482536,\"left\":1424090482537,\"right\":1424090482535},{\"id\":1424090482535,\"left\":1424090482536,\"right\":1424090482534},{\"id\":1424090482534,\"top\":1424090482533,\"left\":1424090482535}],[{\"id\":1424090482559,\"bottom\":1424090482608,\"right\":1424090482560},{\"id\":1424090482560,\"left\":1424090482559,\"right\":1424090482561},{\"id\":1424090482561,\"left\":1424090482560,\"right\":1424090482562},{\"id\":1424090482562,\"top\":1424090482555,\"left\":1424090482561,\"right\":1424090482563},{\"id\":1424090482563,\"top\":1424090482554,\"left\":1424090482562,\"right\":1424090482564},{\"id\":1424090482564,\"left\":1424090482563,\"right\":1424090482565},{\"id\":1424090482565,\"left\":1424090482564,\"right\":1424090482566},{\"id\":1424090482566,\"bottom\":1424090482601,\"left\":1424090482565},{\"id\":1424090482567,\"top\":1424090482550,\"right\":1424090482568},{\"id\":1424090482568,\"left\":1424090482567,\"right\":1424090482569},{\"id\":1424090482569,\"left\":1424090482568,\"right\":1424090482570},{\"id\":1424090482570,\"left\":1424090482569,\"right\":1424090482571},{\"id\":1424090482571,\"top\":1424090482546,\"left\":1424090482570,\"right\":1424090482572},{\"id\":1424090482572,\"left\":1424090482571,\"right\":1424090482573},{\"id\":1424090482573,\"left\":1424090482572,\"right\":1424090482574},{\"id\":1424090482574,\"left\":1424090482573,\"right\":1424090482575},{\"id\":1424090482575,\"top\":1424090482542,\"bottom\":1424090482592,\"left\":1424090482574},{\"id\":1424090482576,\"item\":{\"type\":\"parfum\"},\"right\":1424090482577},{\"id\":1424090482577,\"left\":1424090482576,\"right\":1424090482578},{\"id\":1424090482578,\"top\":1424090482539,\"left\":1424090482577,\"right\":1424090482579},{\"id\":1424090482579,\"top\":1424090482538,\"left\":1424090482578,\"right\":1424090482580},{\"id\":1424090482580,\"left\":1424090482579,\"right\":1424090482581},{\"id\":1424090482581,\"left\":1424090482580,\"right\":1424090482582},{\"id\":1424090482582,\"left\":1424090482581,\"right\":1424090482583},{\"id\":1424090482583,\"bottom\":1424090482584,\"left\":1424090482582}],[{\"id\":1424090482608,\"top\":1424090482559,\"right\":1424090482607},{\"id\":1424090482607,\"left\":1424090482608,\"right\":1424090482606},{\"id\":1424090482606,\"left\":1424090482607,\"right\":1424090482605},{\"id\":1424090482605,\"left\":1424090482606,\"right\":1424090482604},{\"id\":1424090482604,\"bottom\":1424090482613,\"left\":1424090482605,\"right\":1424090482603},{\"id\":1424090482603,\"left\":1424090482604,\"right\":1424090482602},{\"id\":1424090482602,\"left\":1424090482603,\"right\":1424090482601},{\"id\":1424090482601,\"top\":1424090482566,\"left\":1424090482602},{\"id\":1424090482600,\"right\":1424090482599},{\"id\":1424090482599,\"left\":1424090482600,\"right\":1424090482598},{\"id\":1424090482598,\"left\":1424090482599,\"right\":1424090482597},{\"id\":1424090482597,\"left\":1424090482598,\"right\":1424090482596},{\"id\":1424090482596,\"bottom\":1424090482621,\"left\":1424090482597,\"right\":1424090482595},{\"id\":1424090482595,\"left\":1424090482596,\"right\":1424090482594},{\"id\":1424090482594,\"left\":1424090482595,\"right\":1424090482593},{\"id\":1424090482593,\"left\":1424090482594,\"right\":1424090482592},{\"id\":1424090482592,\"top\":1424090482575,\"left\":1424090482593},{\"id\":1424090482591,\"right\":1424090482590},{\"id\":1424090482590,\"left\":1424090482591,\"right\":1424090482589},{\"id\":1424090482589,\"left\":1424090482590,\"right\":1424090482588},{\"id\":1424090482588,\"left\":1424090482589,\"right\":1424090482587},{\"id\":1424090482587,\"bottom\":1424090482630,\"left\":1424090482588,\"right\":1424090482586},{\"id\":1424090482586,\"left\":1424090482587,\"right\":1424090482585},{\"id\":1424090482585,\"left\":1424090482586,\"right\":1424090482584},{\"id\":1424090482584,\"top\":1424090482583,\"left\":1424090482585}],[{\"id\":1424090482609,\"bottom\":1424090482658,\"right\":1424090482610},{\"id\":1424090482610,\"left\":1424090482609,\"right\":1424090482611},{\"id\":1424090482611,\"left\":1424090482610,\"right\":1424090482612},{\"id\":1424090482612,\"left\":1424090482611},{\"id\":1424090482613,\"top\":1424090482604,\"bottom\":1424090482654},{\"id\":1424090482614,\"bottom\":1424090482653,\"right\":1424090482615},{\"id\":1424090482615,\"bottom\":1424090482652,\"left\":1424090482614},{\"id\":1424090482616,\"bottom\":1424090482651},{\"id\":1424090482617,\"bottom\":1424090482650,\"right\":1424090482618},{\"id\":1424090482618,\"left\":1424090482617,\"right\":1424090482619},{\"id\":1424090482619,\"left\":1424090482618,\"right\":1424090482620},{\"id\":1424090482620,\"left\":1424090482619,\"right\":1424090482621},{\"id\":1424090482621,\"top\":1424090482596,\"left\":1424090482620,\"right\":1424090482622},{\"id\":1424090482622,\"left\":1424090482621,\"right\":1424090482623},{\"id\":1424090482623,\"left\":1424090482622,\"right\":1424090482624},{\"id\":1424090482624,\"left\":1424090482623,\"right\":1424090482625},{\"id\":1424090482625,\"bottom\":1424090482642,\"left\":1424090482624},{\"id\":1424090482626,\"right\":1424090482627},{\"id\":1424090482627,\"left\":1424090482626,\"right\":1424090482628},{\"id\":1424090482628,\"left\":1424090482627,\"right\":1424090482629},{\"id\":1424090482629,\"left\":1424090482628,\"right\":1424090482630},{\"id\":1424090482630,\"top\":1424090482587,\"left\":1424090482629,\"right\":1424090482631},{\"id\":1424090482631,\"left\":1424090482630,\"right\":1424090482632},{\"id\":1424090482632,\"left\":1424090482631,\"right\":1424090482633},{\"id\":1424090482633,\"bottom\":1424090482634,\"left\":1424090482632}],[{\"id\":1424090482658,\"top\":1424090482609,\"bottom\":1424090482659,\"right\":1424090482657},{\"id\":1424090482657,\"left\":1424090482658,\"right\":1424090482656},{\"id\":1424090482656,\"left\":1424090482657,\"right\":1424090482655},{\"id\":1424090482655,\"left\":1424090482656,\"right\":1424090482654},{\"id\":1424090482654,\"top\":1424090482613,\"left\":1424090482655,\"right\":1424090482653},{\"id\":1424090482653,\"top\":1424090482614,\"left\":1424090482654},{\"id\":1424090482652,\"top\":1424090482615,\"right\":1424090482651},{\"id\":1424090482651,\"top\":1424090482616,\"bottom\":1424090482666,\"left\":1424090482652},{\"id\":1424090482650,\"top\":1424090482617,\"right\":1424090482649},{\"id\":1424090482649,\"left\":1424090482650,\"right\":1424090482648},{\"id\":1424090482648,\"left\":1424090482649,\"right\":1424090482647},{\"id\":1424090482647,\"left\":1424090482648,\"right\":1424090482646},{\"id\":1424090482646,\"left\":1424090482647,\"right\":1424090482645},{\"id\":1424090482645,\"bottom\":1424090482672,\"left\":1424090482646},{\"id\":1424090482644,\"bottom\":1424090482673,\"right\":1424090482643},{\"id\":1424090482643,\"bottom\":1424090482674,\"left\":1424090482644},{\"id\":1424090482642,\"top\":1424090482625,\"right\":1424090482641},{\"id\":1424090482641,\"left\":1424090482642,\"right\":1424090482640},{\"id\":1424090482640,\"bottom\":1424090482677,\"left\":1424090482641},{\"id\":1424090482639,\"bottom\":1424090482678,\"right\":1424090482638},{\"id\":1424090482638,\"left\":1424090482639,\"right\":1424090482637},{\"id\":1424090482637,\"left\":1424090482638,\"right\":1424090482636},{\"id\":1424090482636,\"left\":1424090482637,\"right\":1424090482635},{\"id\":1424090482635,\"bottom\":1424090482682,\"left\":1424090482636},{\"id\":1424090482634,\"top\":1424090482633,\"bottom\":1424090482683}],[{\"id\":1424090482659,\"top\":1424090482658,\"right\":1424090482660},{\"id\":1424090482660,\"left\":1424090482659,\"right\":1424090482661},{\"id\":1424090482661,\"left\":1424090482660,\"right\":1424090482662},{\"id\":1424090482662,\"left\":1424090482661,\"right\":1424090482663},{\"id\":1424090482663,\"left\":1424090482662,\"right\":1424090482664},{\"id\":1424090482664,\"left\":1424090482663,\"right\":1424090482665},{\"id\":1424090482665,\"bottom\":1424090482702,\"left\":1424090482664},{\"id\":1424090482666,\"top\":1424090482651,\"right\":1424090482667},{\"id\":1424090482667,\"left\":1424090482666,\"right\":1424090482668},{\"id\":1424090482668,\"left\":1424090482667,\"right\":1424090482669},{\"id\":1424090482669,\"left\":1424090482668,\"right\":1424090482670},{\"id\":1424090482670,\"left\":1424090482669,\"right\":1424090482671},{\"id\":1424090482671,\"bottom\":1424090482696,\"left\":1424090482670},{\"id\":1424090482672,\"top\":1424090482645,\"bottom\":1424090482695},{\"id\":1424090482673,\"top\":1424090482644,\"bottom\":1424090482694},{\"id\":1424090482674,\"top\":1424090482643,\"right\":1424090482675},{\"id\":1424090482675,\"left\":1424090482674,\"right\":1424090482676},{\"id\":1424090482676,\"left\":1424090482675,\"right\":1424090482677},{\"id\":1424090482677,\"top\":1424090482640,\"left\":1424090482676},{\"id\":1424090482678,\"top\":1424090482639,\"right\":1424090482679},{\"id\":1424090482679,\"left\":1424090482678,\"right\":1424090482680},{\"id\":1424090482680,\"left\":1424090482679,\"right\":1424090482681},{\"id\":1424090482681,\"bottom\":1424090482686,\"left\":1424090482680},{\"id\":1424090482682,\"top\":1424090482635,\"bottom\":1424090482685},{\"id\":1424090482683,\"top\":1424090482634,\"bottom\":1424090482684}],[{\"id\":1424090482708,\"bottom\":1424090482709,\"right\":1424090482707},{\"id\":1424090482707,\"left\":1424090482708,\"right\":1424090482706},{\"id\":1424090482706,\"left\":1424090482707,\"right\":1424090482705},{\"id\":1424090482705,\"left\":1424090482706,\"right\":1424090482704},{\"id\":1424090482704,\"bottom\":1424090482713,\"left\":1424090482705,\"right\":1424090482703},{\"id\":1424090482703,\"left\":1424090482704,\"right\":1424090482702},{\"id\":1424090482702,\"top\":1424090482665,\"bottom\":1424090482715,\"left\":1424090482703,\"right\":1424090482701},{\"id\":1424090482701,\"left\":1424090482702,\"right\":1424090482700},{\"id\":1424090482700,\"left\":1424090482701,\"right\":1424090482699},{\"id\":1424090482699,\"left\":1424090482700,\"right\":1424090482698},{\"id\":1424090482698,\"left\":1424090482699,\"right\":1424090482697},{\"id\":1424090482697,\"bottom\":1424090482720,\"left\":1424090482698},{\"id\":1424090482696,\"top\":1424090482671,\"right\":1424090482695},{\"id\":1424090482695,\"top\":1424090482672,\"left\":1424090482696},{\"id\":1424090482694,\"top\":1424090482673,\"right\":1424090482693},{\"id\":1424090482693,\"left\":1424090482694,\"right\":1424090482692},{\"id\":1424090482692,\"left\":1424090482693,\"right\":1424090482691},{\"id\":1424090482691,\"bottom\":1424090482726,\"left\":1424090482692},{\"id\":1424090482690,\"bottom\":1424090482727,\"right\":1424090482689},{\"id\":1424090482689,\"left\":1424090482690,\"right\":1424090482688},{\"id\":1424090482688,\"left\":1424090482689,\"right\":1424090482687},{\"id\":1424090482687,\"left\":1424090482688,\"right\":1424090482686},{\"id\":1424090482686,\"top\":1424090482681,\"left\":1424090482687},{\"id\":1424090482685,\"top\":1424090482682,\"bottom\":1424090482732},{\"id\":1424090482684,\"top\":1424090482683,\"bottom\":1424090482733}],[{\"id\":1424090482709,\"top\":1424090482708,\"right\":1424090482710},{\"id\":1424090482710,\"left\":1424090482709,\"right\":1424090482711},{\"id\":1424090482711,\"left\":1424090482710,\"right\":1424090482712},{\"id\":1424090482712,\"item\":{\"type\":\"potion\"},\"left\":1424090482711},{\"id\":1424090482713,\"top\":1424090482704,\"bottom\":1424090482754,\"right\":1424090482714},{\"id\":1424090482714,\"left\":1424090482713,\"right\":1424090482715},{\"id\":1424090482715,\"top\":1424090482702,\"bottom\":1424090482752,\"left\":1424090482714,\"right\":1424090482716},{\"id\":1424090482716,\"left\":1424090482715,\"right\":1424090482717},{\"id\":1424090482717,\"left\":1424090482716,\"right\":1424090482718},{\"id\":1424090482718,\"bottom\":1424090482749,\"left\":1424090482717,\"right\":1424090482719},{\"id\":1424090482719,\"left\":1424090482718,\"right\":1424090482720},{\"id\":1424090482720,\"top\":1424090482697,\"left\":1424090482719,\"right\":1424090482721},{\"id\":1424090482721,\"left\":1424090482720,\"right\":1424090482722},{\"id\":1424090482722,\"left\":1424090482721,\"right\":1424090482723},{\"id\":1424090482723,\"bottom\":1424090482744,\"left\":1424090482722,\"right\":1424090482724},{\"id\":1424090482724,\"left\":1424090482723,\"right\":1424090482725},{\"id\":1424090482725,\"left\":1424090482724},{\"id\":1424090482726,\"top\":1424090482691,\"bottom\":1424090482741},{\"id\":1424090482727,\"top\":1424090482690,\"bottom\":1424090482740},{\"id\":1424090482728,\"bottom\":1424090482739,\"right\":1424090482729},{\"id\":1424090482729,\"left\":1424090482728,\"right\":1424090482730},{\"id\":1424090482730,\"left\":1424090482729,\"right\":1424090482731},{\"id\":1424090482731,\"left\":1424090482730,\"right\":1424090482732},{\"id\":1424090482732,\"top\":1424090482685,\"left\":1424090482731},{\"id\":1424090482733,\"top\":1424090482684,\"bottom\":1424090482734}],[{\"id\":1424090482758,\"bottom\":1424090482759,\"right\":1424090482757},{\"id\":1424090482757,\"left\":1424090482758,\"right\":1424090482756},{\"id\":1424090482756,\"left\":1424090482757,\"right\":1424090482755},{\"id\":1424090482755,\"left\":1424090482756,\"right\":1424090482754},{\"id\":1424090482754,\"top\":1424090482713,\"left\":1424090482755,\"right\":1424090482753},{\"id\":1424090482753,\"left\":1424090482754,\"right\":1424090482752},{\"id\":1424090482752,\"top\":1424090482715,\"left\":1424090482753},{\"id\":1424090482751,\"bottom\":1424090482766,\"right\":1424090482750},{\"id\":1424090482750,\"bottom\":1424090482767,\"left\":1424090482751},{\"id\":1424090482749,\"top\":1424090482718,\"right\":1424090482748},{\"id\":1424090482748,\"left\":1424090482749,\"right\":1424090482747},{\"id\":1424090482747,\"left\":1424090482748,\"right\":1424090482746},{\"id\":1424090482746,\"left\":1424090482747,\"right\":1424090482745},{\"id\":1424090482745,\"bottom\":1424090482772,\"left\":1424090482746},{\"id\":1424090482744,\"top\":1424090482723,\"right\":1424090482743},{\"id\":1424090482743,\"left\":1424090482744,\"right\":1424090482742},{\"id\":1424090482742,\"bottom\":1424090482775,\"left\":1424090482743},{\"id\":1424090482741,\"item\":{\"type\":\"trap\"},\"top\":1424090482726,\"right\":1424090482740},{\"id\":1424090482740,\"top\":1424090482727,\"left\":1424090482741},{\"id\":1424090482739,\"top\":1424090482728,\"bottom\":1424090482778,\"right\":1424090482738},{\"id\":1424090482738,\"left\":1424090482739,\"right\":1424090482737},{\"id\":1424090482737,\"left\":1424090482738,\"right\":1424090482736},{\"id\":1424090482736,\"left\":1424090482737,\"right\":1424090482735},{\"id\":1424090482735,\"left\":1424090482736,\"right\":1424090482734},{\"id\":1424090482734,\"top\":1424090482733,\"left\":1424090482735}],[{\"id\":1424090482759,\"top\":1424090482758,\"right\":1424090482760},{\"id\":1424090482760,\"left\":1424090482759,\"right\":1424090482761},{\"id\":1424090482761,\"left\":1424090482760,\"right\":1424090482762},{\"id\":1424090482762,\"left\":1424090482761,\"right\":1424090482763},{\"id\":1424090482763,\"left\":1424090482762,\"right\":1424090482764},{\"id\":1424090482764,\"left\":1424090482763,\"right\":1424090482765},{\"id\":1424090482765,\"left\":1424090482764,\"right\":1424090482766},{\"id\":1424090482766,\"top\":1424090482751,\"left\":1424090482765},{\"id\":1424090482767,\"top\":1424090482750,\"bottom\":1424090482800,\"right\":1424090482768},{\"id\":1424090482768,\"left\":1424090482767,\"right\":1424090482769},{\"id\":1424090482769,\"left\":1424090482768,\"right\":1424090482770},{\"id\":1424090482770,\"left\":1424090482769,\"right\":1424090482771},{\"id\":1424090482771,\"bottom\":1424090482796,\"left\":1424090482770},{\"id\":1424090482772,\"top\":1424090482745,\"right\":1424090482773},{\"id\":1424090482773,\"left\":1424090482772,\"right\":1424090482774},{\"id\":1424090482774,\"bottom\":1424090482793,\"left\":1424090482773},{\"id\":1424090482775,\"top\":1424090482742,\"right\":1424090482776},{\"id\":1424090482776,\"left\":1424090482775,\"right\":1424090482777},{\"id\":1424090482777,\"bottom\":1424090482790,\"left\":1424090482776,\"right\":1424090482778},{\"id\":1424090482778,\"top\":1424090482739,\"left\":1424090482777},{\"id\":1424090482779,\"bottom\":1424090482788,\"right\":1424090482780},{\"id\":1424090482780,\"bottom\":1424090482787,\"left\":1424090482779,\"right\":1424090482781},{\"id\":1424090482781,\"left\":1424090482780},{\"id\":1424090482782,\"bottom\":1424090482785,\"right\":1424090482783},{\"id\":1424090482783,\"bottom\":1424090482784,\"left\":1424090482782}],[{\"id\":1424090482808,\"bottom\":1424090482809,\"right\":1424090482807},{\"id\":1424090482807,\"left\":1424090482808,\"right\":1424090482806},{\"id\":1424090482806,\"left\":1424090482807,\"right\":1424090482805},{\"id\":1424090482805,\"left\":1424090482806,\"right\":1424090482804},{\"id\":1424090482804,\"left\":1424090482805,\"right\":1424090482803},{\"id\":1424090482803,\"left\":1424090482804,\"right\":1424090482802},{\"id\":1424090482802,\"left\":1424090482803,\"right\":1424090482801},{\"id\":1424090482801,\"left\":1424090482802,\"right\":1424090482800},{\"id\":1424090482800,\"top\":1424090482767,\"left\":1424090482801},{\"id\":1424090482799,\"bottom\":1424090482818,\"right\":1424090482798},{\"id\":1424090482798,\"left\":1424090482799,\"right\":1424090482797},{\"id\":1424090482797,\"bottom\":1424090482820,\"left\":1424090482798},{\"id\":1424090482796,\"top\":1424090482771,\"right\":1424090482795},{\"id\":1424090482795,\"left\":1424090482796,\"right\":1424090482794},{\"id\":1424090482794,\"bottom\":1424090482823,\"left\":1424090482795},{\"id\":1424090482793,\"top\":1424090482774,\"right\":1424090482792},{\"id\":1424090482792,\"left\":1424090482793,\"right\":1424090482791},{\"id\":1424090482791,\"bottom\":1424090482826,\"left\":1424090482792},{\"id\":1424090482790,\"top\":1424090482777,\"right\":1424090482789},{\"id\":1424090482789,\"left\":1424090482790,\"right\":1424090482788},{\"id\":1424090482788,\"top\":1424090482779,\"left\":1424090482789},{\"id\":1424090482787,\"top\":1424090482780,\"right\":1424090482786},{\"id\":1424090482786,\"left\":1424090482787,\"right\":1424090482785},{\"id\":1424090482785,\"top\":1424090482782,\"left\":1424090482786},{\"id\":1424090482784,\"top\":1424090482783,\"bottom\":1424090482833}],[{\"id\":1424090482809,\"top\":1424090482808,\"right\":1424090482810},{\"id\":1424090482810,\"left\":1424090482809,\"right\":1424090482811},{\"id\":1424090482811,\"left\":1424090482810,\"right\":1424090482812},{\"id\":1424090482812,\"left\":1424090482811,\"right\":1424090482813},{\"id\":1424090482813,\"left\":1424090482812,\"right\":1424090482814},{\"id\":1424090482814,\"left\":1424090482813,\"right\":1424090482815},{\"id\":1424090482815,\"left\":1424090482814,\"right\":1424090482816},{\"id\":1424090482816,\"left\":1424090482815,\"right\":1424090482817},{\"id\":1424090482817,\"left\":1424090482816,\"right\":1424090482818},{\"id\":1424090482818,\"top\":1424090482799,\"left\":1424090482817},{\"id\":1424090482819},{\"id\":1424090482820,\"top\":1424090482797,\"right\":1424090482821},{\"id\":1424090482821,\"left\":1424090482820,\"right\":1424090482822},{\"id\":1424090482822,\"left\":1424090482821,\"right\":1424090482823},{\"id\":1424090482823,\"top\":1424090482794,\"left\":1424090482822,\"right\":1424090482824},{\"id\":1424090482824,\"left\":1424090482823,\"right\":1424090482825},{\"id\":1424090482825,\"left\":1424090482824,\"right\":1424090482826},{\"id\":1424090482826,\"top\":1424090482791,\"left\":1424090482825,\"right\":1424090482827},{\"id\":1424090482827,\"left\":1424090482826,\"right\":1424090482828},{\"id\":1424090482828,\"left\":1424090482827,\"right\":1424090482829},{\"id\":1424090482829,\"left\":1424090482828,\"right\":1424090482830},{\"id\":1424090482830,\"left\":1424090482829,\"right\":1424090482831},{\"id\":1424090482831,\"left\":1424090482830,\"right\":1424090482832},{\"id\":1424090482832,\"left\":1424090482831,\"right\":1424090482833},{\"id\":1424090482833,\"top\":1424090482784,\"left\":1424090482832}]],\"iaList\":[]}");
		return com_tamina_cow4_model_GameMap.fromGameMapVO(importedModel);
	}
	,getTestMap: function(row,col) {
		this._goRight = true;
		this._columnNumber = col;
		this._rowNumber = row;
		var result = new com_tamina_cow4_model_GameMap();
		var previousCell = null;
		var currentCell = null;
		var _g1 = 0;
		var _g = this._rowNumber;
		while(_g1 < _g) {
			var rowIndex = _g1++;
			result.cells.push([]);
			if(this._goRight) {
				currentCell = new com_tamina_cow4_model_Cell();
				currentCell.set_top(previousCell);
				if(previousCell != null) previousCell.set_bottom(currentCell);
				result.cells[rowIndex].push(currentCell);
				previousCell = currentCell;
				var _g3 = 1;
				var _g2 = this._columnNumber;
				while(_g3 < _g2) {
					var columnIndex = _g3++;
					currentCell = new com_tamina_cow4_model_Cell();
					currentCell.set_left(previousCell);
					if(previousCell != null) previousCell.set_right(currentCell);
					result.cells[rowIndex].push(currentCell);
					previousCell = currentCell;
				}
				this._goRight = false;
			} else {
				var columnIndex1 = this._columnNumber - 1;
				currentCell = new com_tamina_cow4_model_Cell();
				currentCell.set_top(previousCell);
				if(previousCell != null) previousCell.set_bottom(currentCell);
				result.cells[rowIndex][columnIndex1] = currentCell;
				previousCell = currentCell;
				columnIndex1--;
				while(columnIndex1 >= 0) {
					currentCell = new com_tamina_cow4_model_Cell();
					currentCell.set_right(previousCell);
					if(previousCell != null) previousCell.set_left(currentCell);
					result.cells[rowIndex][columnIndex1] = currentCell;
					previousCell = currentCell;
					columnIndex1--;
				}
				this._goRight = true;
			}
		}
		return result;
	}
	,__class__: com_tamina_cow4_data_Mock
};
var com_tamina_cow4_events_NotificationBus = function() {
	this.startUpdateDisplay = new msignal_Signal0();
	this.stopUpdateDisplay = new msignal_Signal0();
	this.startBattle = new msignal_Signal1();
};
com_tamina_cow4_events_NotificationBus.__name__ = true;
com_tamina_cow4_events_NotificationBus.get_instance = function() {
	if(com_tamina_cow4_events_NotificationBus._instance == null) com_tamina_cow4_events_NotificationBus._instance = new com_tamina_cow4_events_NotificationBus();
	return com_tamina_cow4_events_NotificationBus._instance;
};
com_tamina_cow4_events_NotificationBus.prototype = {
	__class__: com_tamina_cow4_events_NotificationBus
};
var com_tamina_cow4_events_StartBattleNotification = function(iaList,player) {
	this.IAList = iaList;
	this.player = player;
};
com_tamina_cow4_events_StartBattleNotification.__name__ = true;
com_tamina_cow4_events_StartBattleNotification.prototype = {
	__class__: com_tamina_cow4_events_StartBattleNotification
};
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
var com_tamina_cow4_model_GameConstants = function() { };
com_tamina_cow4_model_GameConstants.__name__ = true;
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
var com_tamina_cow4_net_request_PlayRequestParam = function() { };
com_tamina_cow4_net_request_PlayRequestParam.__name__ = true;
var com_tamina_cow4_routes_Route = function(successHandler) {
	this.succesHandler = successHandler;
};
com_tamina_cow4_routes_Route.__name__ = true;
com_tamina_cow4_routes_Route.prototype = {
	__class__: com_tamina_cow4_routes_Route
};
var com_tamina_cow4_routes_IAListRoute = function() {
	com_tamina_cow4_routes_Route.call(this,$bind(this,this._sucessHandler));
};
com_tamina_cow4_routes_IAListRoute.__name__ = true;
com_tamina_cow4_routes_IAListRoute.__super__ = com_tamina_cow4_routes_Route;
com_tamina_cow4_routes_IAListRoute.prototype = $extend(com_tamina_cow4_routes_Route.prototype,{
	_sucessHandler: function(request,response) {
		var connecions = com_tamina_cow4_socket_SocketServer.connections;
		var result = [];
		var _g1 = 0;
		var _g = connecions.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(connecions[i].isLoggued) result.push(connecions[i].toInfo());
		}
		response.send(JSON.stringify(result));
	}
	,__class__: com_tamina_cow4_routes_IAListRoute
});
var com_tamina_cow4_routes_MainRoute = function() {
	com_tamina_cow4_routes_Route.call(this,$bind(this,this._sucessHandler));
};
com_tamina_cow4_routes_MainRoute.__name__ = true;
com_tamina_cow4_routes_MainRoute.__super__ = com_tamina_cow4_routes_Route;
com_tamina_cow4_routes_MainRoute.prototype = $extend(com_tamina_cow4_routes_Route.prototype,{
	_sucessHandler: function(request,response) {
		response.sendfile("server/" + "index.html");
	}
	,__class__: com_tamina_cow4_routes_MainRoute
});
var com_tamina_cow4_routes_PlayRoute = function() {
	com_tamina_cow4_routes_Route.call(this,$bind(this,this._sucessHandler));
};
com_tamina_cow4_routes_PlayRoute.__name__ = true;
com_tamina_cow4_routes_PlayRoute.__super__ = com_tamina_cow4_routes_Route;
com_tamina_cow4_routes_PlayRoute.prototype = $extend(com_tamina_cow4_routes_Route.prototype,{
	_sucessHandler: function(request,response) {
		if(request.param("ia1") != null && request.param("ia2") != null && request.param("gameId") != null) response.sendfile("server/" + "play.html"); else console.error("ERROR : url params not found");
	}
	,__class__: com_tamina_cow4_routes_PlayRoute
});
var com_tamina_cow4_routes_Routes = function() { };
com_tamina_cow4_routes_Routes.__name__ = true;
var com_tamina_cow4_routes_TestSocketServerRoute = function() {
	com_tamina_cow4_routes_Route.call(this,$bind(this,this._sucessHandler));
};
com_tamina_cow4_routes_TestSocketServerRoute.__name__ = true;
com_tamina_cow4_routes_TestSocketServerRoute.__super__ = com_tamina_cow4_routes_Route;
com_tamina_cow4_routes_TestSocketServerRoute.prototype = $extend(com_tamina_cow4_routes_Route.prototype,{
	_sucessHandler: function(request,response) {
		response.send("launch new demoia");
		(require('child_process')).exec("node js/release/IADemoApp.js",$bind(this,this.execHandler));
	}
	,execHandler: function(error,stdout,stderr) {
		console.log(error + stdout + stderr);
	}
	,__class__: com_tamina_cow4_routes_TestSocketServerRoute
});
var com_tamina_cow4_socket_Client = function() {
	this.isLoggued = false;
	this.id = org_tamina_utils_UID.getUID();
	this.exitSignal = new msignal_Signal1();
};
com_tamina_cow4_socket_Client.__name__ = true;
com_tamina_cow4_socket_Client.prototype = {
	exitHandler: function() {
		this.exitSignal.dispatch(this.id);
	}
	,__class__: com_tamina_cow4_socket_Client
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
		haxe_Log.trace("[" + this._type + "] new connection",{ fileName : "Proxy.hx", lineNumber : 27, className : "com.tamina.cow4.socket.Proxy", methodName : "socketServer_openHandler"});
	}
	,socketServer_errorHandler: function(c) {
		haxe_Log.trace("[" + this._type + "] ERROR " + Std.string(c),{ fileName : "Proxy.hx", lineNumber : 31, className : "com.tamina.cow4.socket.Proxy", methodName : "socketServer_errorHandler"});
		this.errorSignal.dispatch();
	}
	,socketServer_closeHandler: function(c) {
		haxe_Log.trace("[" + this._type + "] connection close",{ fileName : "Proxy.hx", lineNumber : 36, className : "com.tamina.cow4.socket.Proxy", methodName : "socketServer_closeHandler"});
		this.closeSignal.dispatch();
	}
	,socketServer_dataHandler: function(data) {
		this._data += data.toString();
		if(this._data.indexOf("#end#") >= 0) {
			this._data = this._data.split("#end#").join("");
			if(this._data.length > 0) this.socketServer_endHandler(); else haxe_Log.trace("message vide: " + data,{ fileName : "Proxy.hx", lineNumber : 48, className : "com.tamina.cow4.socket.Proxy", methodName : "socketServer_dataHandler"});
		}
	}
	,socketServer_endHandler: function() {
		var message = null;
		try {
			message = JSON.parse(this._data);
			this._data = "";
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				haxe_Log.trace("[" + this._type + "] impossible de parser le message json : " + e.message,{ fileName : "Proxy.hx", lineNumber : 62, className : "com.tamina.cow4.socket.Proxy", methodName : "socketServer_endHandler"});
				this.sendError(new com_tamina_cow4_socket_message_Error(2,"message inconnu"));
			} else throw(e);
		}
		if(message != null && message.type != null) this.messageSignal.dispatch(message); else this.sendError(new com_tamina_cow4_socket_message_Error(2,"message inconnu"));
	}
	,__class__: com_tamina_cow4_socket_Proxy
};
var com_tamina_cow4_socket_ClientProxy = function(c) {
	com_tamina_cow4_socket_Proxy.call(this,"client proxy");
	this._socket = c;
	this._socket.on(nodejs_net_TCPSocketEventType.Connect,$bind(this,this.socketServer_openHandler));
	this._socket.on(nodejs_net_TCPSocketEventType.Close,$bind(this,this.socketServer_closeHandler));
	this._socket.on(nodejs_net_TCPSocketEventType.Error,$bind(this,this.socketServer_errorHandler));
	this._socket.on(nodejs_net_TCPSocketEventType.Data,$bind(this,this.socketServer_dataHandler));
};
com_tamina_cow4_socket_ClientProxy.__name__ = true;
com_tamina_cow4_socket_ClientProxy.__super__ = com_tamina_cow4_socket_Proxy;
com_tamina_cow4_socket_ClientProxy.prototype = $extend(com_tamina_cow4_socket_Proxy.prototype,{
	sendMessage: function(message) {
		try {
			this._socket.write(message.serialize());
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				haxe_Log.trace("ERROR : " + e.message,{ fileName : "ClientProxy.hx", lineNumber : 24, className : "com.tamina.cow4.socket.ClientProxy", methodName : "sendMessage"});
			} else throw(e);
		}
	}
	,sendError: function(error) {
		try {
			this._socket.write(error.serialize());
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				haxe_Log.trace("ERROR : " + e.message,{ fileName : "ClientProxy.hx", lineNumber : 32, className : "com.tamina.cow4.socket.ClientProxy", methodName : "sendError"});
			} else throw(e);
		}
	}
	,__class__: com_tamina_cow4_socket_ClientProxy
});
var com_tamina_cow4_socket_IIA = function() {
	this.trappedDuration = 0;
};
com_tamina_cow4_socket_IIA.__name__ = true;
com_tamina_cow4_socket_IIA.prototype = {
	__class__: com_tamina_cow4_socket_IIA
};
var com_tamina_cow4_socket_IA = function(c) {
	this.trappedDuration = 0;
	this.invisibilityDuration = 0;
	this.pm = 1;
	com_tamina_cow4_socket_Client.call(this);
	this.items = [];
	this._proxy = new com_tamina_cow4_socket_ClientProxy(c);
	this._proxy.messageSignal.add($bind(this,this.clientMessageHandler));
	this._proxy.closeSignal.add($bind(this,this.exitHandler));
	this._proxy.errorSignal.add($bind(this,this.exitHandler));
	this.turnComplete = new msignal_Signal1();
};
com_tamina_cow4_socket_IA.__name__ = true;
com_tamina_cow4_socket_IA.__interfaces__ = [com_tamina_cow4_socket_IIA];
com_tamina_cow4_socket_IA.__super__ = com_tamina_cow4_socket_Client;
com_tamina_cow4_socket_IA.prototype = $extend(com_tamina_cow4_socket_Client.prototype,{
	toInfo: function() {
		return new com_tamina_cow4_model_IAInfo(this.id,this.name,this.avatar.path,this.pm,this.items,this.invisibilityDuration,this.profil);
	}
	,getTurnOrder: function(data) {
		this._proxy.sendMessage(new com_tamina_cow4_socket_message_GetTurnOrder(data.toGameMapVO()));
	}
	,getItemByType: function(type) {
		var result = null;
		var _g1 = 0;
		var _g = this.items.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.items[i].type == type) result = this.items[i];
		}
		return result;
	}
	,clientMessageHandler: function(message) {
		var _g = message.type;
		switch(_g) {
		case "authenticate":
			console.info("demande dauthentifiction");
			var auth = message;
			if(this.isLoggued) this._proxy.sendError(new com_tamina_cow4_socket_message_Error(1,"deja ahtentifié")); else {
				this.isLoggued = true;
				this.name = auth.name;
				this.avatar = new org_tamina_net_URL(auth.avatar);
				this.profil = auth.profil;
				this._proxy.sendMessage(new com_tamina_cow4_socket_message_ID(this.id));
			}
			break;
		case "turnResult":
			console.info("resultat du tour");
			var result = message;
			this.turnComplete.dispatch(result);
			break;
		default:
			this._proxy.sendError(new com_tamina_cow4_socket_message_Error(2,"type de message inconnu"));
		}
	}
	,__class__: com_tamina_cow4_socket_IA
});
var com_tamina_cow4_socket_Player = function(c) {
	com_tamina_cow4_socket_Client.call(this);
	this._proxy = new com_tamina_cow4_socket_PlayerProxy(c);
	this._proxy.messageSignal.add($bind(this,this.playerMessageHandler));
};
com_tamina_cow4_socket_Player.__name__ = true;
com_tamina_cow4_socket_Player.__super__ = com_tamina_cow4_socket_Client;
com_tamina_cow4_socket_Player.prototype = $extend(com_tamina_cow4_socket_Client.prototype,{
	render: function(data) {
		this._proxy.sendMessage(new com_tamina_cow4_socket_message_Render(data.toGameMapVO()));
	}
	,updateRender: function(turn) {
		var msg = new com_tamina_cow4_socket_message_UpdateRender();
		msg.ia = turn.ia;
		msg.actions = turn.actions;
		this._proxy.sendMessage(msg);
	}
	,playerMessageHandler: function(message) {
		var _g = message.type;
		switch(_g) {
		case "startbattle":
			console.info("StartBattle");
			var startBattle = message;
			var iaList = [];
			var ia = com_tamina_cow4_socket_SocketServer.getIAById(startBattle.IA1);
			if(ia != null) {
				iaList.push(ia);
				var ia1 = com_tamina_cow4_socket_SocketServer.getIAById(startBattle.IA2);
				if(ia1 != null) {
					iaList.push(ia1);
					var notif = new com_tamina_cow4_events_StartBattleNotification(iaList,this);
					com_tamina_cow4_events_NotificationBus.get_instance().startBattle.dispatch(notif);
				} else {
					console.error("ia 2 introuvable");
					this._proxy.sendError(new com_tamina_cow4_socket_message_Error(2,"ia 1 introuvable"));
				}
			} else {
				console.error("ia 1 introuvable");
				this._proxy.sendError(new com_tamina_cow4_socket_message_Error(2,"ia1 introuvable"));
			}
			break;
		default:
			this._proxy.sendError(new com_tamina_cow4_socket_message_Error(2,"type de message inconnu"));
		}
	}
	,__class__: com_tamina_cow4_socket_Player
});
var com_tamina_cow4_socket_PlayerProxy = function(c) {
	com_tamina_cow4_socket_Proxy.call(this,"player proxy");
	this._socket = c;
	this._socket.on(nodejs_ws_WebSocketEventType.Open,$bind(this,this.socketServer_openHandler));
	this._socket.on(nodejs_ws_WebSocketEventType.Close,$bind(this,this.socketServer_closeHandler));
	this._socket.on(nodejs_ws_WebSocketEventType.Error,$bind(this,this.socketServer_errorHandler));
	this._socket.on(nodejs_ws_WebSocketEventType.Message,$bind(this,this.socketServer_dataHandler));
};
com_tamina_cow4_socket_PlayerProxy.__name__ = true;
com_tamina_cow4_socket_PlayerProxy.__super__ = com_tamina_cow4_socket_Proxy;
com_tamina_cow4_socket_PlayerProxy.prototype = $extend(com_tamina_cow4_socket_Proxy.prototype,{
	sendMessage: function(message) {
		try {
			this._socket.send(message.serialize());
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				haxe_Log.trace("ERROR : " + e.message,{ fileName : "PlayerProxy.hx", lineNumber : 25, className : "com.tamina.cow4.socket.PlayerProxy", methodName : "sendMessage"});
			} else throw(e);
		}
	}
	,sendError: function(error) {
	}
	,__class__: com_tamina_cow4_socket_PlayerProxy
});
var com_tamina_cow4_socket_SheepIA = function() {
	this._isFirstTurn = true;
	this.profil = 3;
	this.trappedDuration = 0;
	this.invisibilityDuration = 0;
	this.pm = 1;
	this.name = "SheepIA";
	this.id = org_tamina_utils_UID.getUID();
	this.items = [];
	this.turnComplete = new msignal_Signal1();
	this._isFirstTurn = true;
};
com_tamina_cow4_socket_SheepIA.__name__ = true;
com_tamina_cow4_socket_SheepIA.__interfaces__ = [com_tamina_cow4_socket_IIA];
com_tamina_cow4_socket_SheepIA.prototype = {
	toInfo: function() {
		return new com_tamina_cow4_model_IAInfo(this.id,this.name,"",this.pm,this.items,this.invisibilityDuration,this.profil);
	}
	,getTurnOrder: function(data) {
		var result = new com_tamina_cow4_socket_message_TurnResult();
		this._data = data;
		try {
			var currentCell = data.getCellByIA(this.id);
			var myIa = data.getIAById(this.id);
			if(this._isFirstTurn) this.initFirstTurn(); else {
				if(this._targetCell == null || this._targetCell.id == currentCell.id) this._targetCell = this.getNewDestination();
				if(this._targetCell != null) {
					var path = com_tamina_cow4_utils_GameUtils.getPath(currentCell,this._targetCell,data);
					if(path != null) {
						var _g1 = 0;
						var _g = myIa.pm;
						while(_g1 < _g) {
							var i = _g1++;
							var order = new com_tamina_cow4_socket_message_order_MoveOrder(path.getItemAt(i + 1));
							result.actions.push(order);
						}
					} else {
						haxe_Log.trace("path null : " + currentCell.id + "//" + this._targetCell.id,{ fileName : "SheepIA.hx", lineNumber : 65, className : "com.tamina.cow4.socket.SheepIA", methodName : "getTurnOrder"});
						this._targetCell = null;
					}
				} else haxe_Log.trace("Sheep : targetCell NULL",{ fileName : "SheepIA.hx", lineNumber : 69, className : "com.tamina.cow4.socket.SheepIA", methodName : "getTurnOrder"});
			}
		} catch( e ) {
			if( js_Boot.__instanceof(e,Error) ) {
				haxe_Log.trace("error : " + e.message,{ fileName : "SheepIA.hx", lineNumber : 75, className : "com.tamina.cow4.socket.SheepIA", methodName : "getTurnOrder"});
			} else throw(e);
		}
		this.turnComplete.dispatch(result);
	}
	,initFirstTurn: function() {
		this._targetCell = this._data.getCellAt(0,12);
		this._isFirstTurn = false;
	}
	,getNextIntersection: function(fromCell,byCell) {
		var result = null;
		if(byCell != null) {
			var neighbors = byCell.getNeighboors();
			if(neighbors.length == 1 || neighbors.length > 2) result = byCell; else {
				var nextCell = neighbors[0];
				if(nextCell.id == fromCell.id) nextCell = neighbors[1];
				result = this.getNextIntersection(byCell,nextCell);
			}
		} else haxe_Log.trace("byCell NULL",{ fileName : "SheepIA.hx", lineNumber : 99, className : "com.tamina.cow4.socket.SheepIA", methodName : "getNextIntersection"});
		return result;
	}
	,hasNextIntersection: function(fromCell,byCell) {
		var result = false;
		if(byCell != null) {
			var neighbors = byCell.getNeighboors();
			if(neighbors.length > 2) result = true; else if(neighbors.length == 1) result = false; else {
				var nextCell = neighbors[0];
				if(nextCell.id == fromCell.id) nextCell = neighbors[1];
				result = this.hasNextIntersection(byCell,nextCell);
			}
		} else haxe_Log.trace("byCell NULL",{ fileName : "SheepIA.hx", lineNumber : 120, className : "com.tamina.cow4.socket.SheepIA", methodName : "hasNextIntersection"});
		return result;
	}
	,getNewDestination: function() {
		var currentCell = this._data.getCellByIA(this.id);
		var ia1Cell = this._data.getCellByIA(this._data.iaList[0].id);
		var ia1Path = null;
		if(ia1Cell != null) ia1Path = com_tamina_cow4_utils_GameUtils.getPath(currentCell,ia1Cell,this._data); else haxe_Log.trace("---------------------------------> IA 1 invisible",{ fileName : "SheepIA.hx", lineNumber : 133, className : "com.tamina.cow4.socket.SheepIA", methodName : "getNewDestination"});
		var ia2Cell = this._data.getCellByIA(this._data.iaList[1].id);
		var ia2Path = null;
		if(ia2Cell != null) ia2Path = com_tamina_cow4_utils_GameUtils.getPath(currentCell,ia2Cell,this._data); else haxe_Log.trace("--------------------------------------> IA 2 invisible",{ fileName : "SheepIA.hx", lineNumber : 140, className : "com.tamina.cow4.socket.SheepIA", methodName : "getNewDestination"});
		var neighbors = currentCell.getNeighboors();
		var selectedNeighbor = null;
		var neighborIndex = 0;
		haxe_Log.trace("SHEEP : recherche de sorties : " + neighbors.length,{ fileName : "SheepIA.hx", lineNumber : 147, className : "com.tamina.cow4.socket.SheepIA", methodName : "getNewDestination"});
		while(neighborIndex < neighbors.length) {
			selectedNeighbor = neighbors[neighborIndex];
			if((ia1Path == null || ia1Path != null && neighbors[neighborIndex].id != ia1Path.getItemAt(1).id) && (ia2Path == null || ia2Path != null && neighbors[neighborIndex].id != ia2Path.getItemAt(1).id) && this.hasNextIntersection(currentCell,selectedNeighbor)) {
				haxe_Log.trace("sortie trouvée : " + selectedNeighbor.id,{ fileName : "SheepIA.hx", lineNumber : 155, className : "com.tamina.cow4.socket.SheepIA", methodName : "getNewDestination"});
				break;
			} else neighborIndex++;
		}
		return this.getNextIntersection(currentCell,selectedNeighbor);
	}
	,getItemByType: function(type) {
		var result = null;
		var _g1 = 0;
		var _g = this.items.length;
		while(_g1 < _g) {
			var i = _g1++;
			if(this.items[i].type == type) result = this.items[i];
		}
		return result;
	}
	,__class__: com_tamina_cow4_socket_SheepIA
};
var com_tamina_cow4_socket_SocketServer = function(port) {
	com_tamina_cow4_socket_SocketServer.connections = [];
	this._server = require('net').createServer($bind(this,this.socketServer_connectionHandler));
	this._server.listen(port,$bind(this,this.socketServer_createHandler));
};
com_tamina_cow4_socket_SocketServer.__name__ = true;
com_tamina_cow4_socket_SocketServer.getIAById = function(id) {
	var result = null;
	haxe_Log.trace("search IA : " + id,{ fileName : "SocketServer.hx", lineNumber : 19, className : "com.tamina.cow4.socket.SocketServer", methodName : "getIAById"});
	var _g1 = 0;
	var _g = com_tamina_cow4_socket_SocketServer.connections.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(com_tamina_cow4_socket_SocketServer.connections[i].id == id) {
			result = com_tamina_cow4_socket_SocketServer.connections[i];
			haxe_Log.trace("IA found",{ fileName : "SocketServer.hx", lineNumber : 23, className : "com.tamina.cow4.socket.SocketServer", methodName : "getIAById"});
			break;
		}
	}
	return result;
};
com_tamina_cow4_socket_SocketServer.prototype = {
	socketServer_connectionHandler: function(c) {
		console.info("[socket server] new connection ");
		var ia = new com_tamina_cow4_socket_IA(c);
		ia.exitSignal.addOnce($bind(this,this.iaCloseHandler));
		com_tamina_cow4_socket_SocketServer.connections.push(ia);
	}
	,iaCloseHandler: function(id) {
		var _g1 = 0;
		var _g = com_tamina_cow4_socket_SocketServer.connections.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = com_tamina_cow4_socket_SocketServer.connections[i];
			if(c.id == id) {
				HxOverrides.remove(com_tamina_cow4_socket_SocketServer.connections,c);
				break;
			}
		}
	}
	,socketServer_createHandler: function(c) {
		console.info("[socket server] ready");
	}
	,__class__: com_tamina_cow4_socket_SocketServer
};
var com_tamina_cow4_socket_WSocketServer = function() {
	com_tamina_cow4_socket_WSocketServer.connections = [];
	var opt = { port : 8128};
	this._server = new (require('ws').Server)(opt);
	this._server.on(nodejs_ws_WebSocketServerEventType.Error,$bind(this,this.errorHandler));
	this._server.on(nodejs_ws_WebSocketServerEventType.Connection,$bind(this,this.connectionHandler));
};
com_tamina_cow4_socket_WSocketServer.__name__ = true;
com_tamina_cow4_socket_WSocketServer.getPlayerById = function(id) {
	var result = null;
	haxe_Log.trace("search Player : " + id,{ fileName : "WSocketServer.hx", lineNumber : 23, className : "com.tamina.cow4.socket.WSocketServer", methodName : "getPlayerById"});
	var _g1 = 0;
	var _g = com_tamina_cow4_socket_WSocketServer.connections.length;
	while(_g1 < _g) {
		var i = _g1++;
		if(com_tamina_cow4_socket_WSocketServer.connections[i].id == id) {
			result = com_tamina_cow4_socket_WSocketServer.connections[i];
			haxe_Log.trace("Player found",{ fileName : "WSocketServer.hx", lineNumber : 27, className : "com.tamina.cow4.socket.WSocketServer", methodName : "getPlayerById"});
			break;
		}
	}
	return result;
};
com_tamina_cow4_socket_WSocketServer.prototype = {
	errorHandler: function(evt) {
		haxe_Log.trace("[Socket server] Error",{ fileName : "WSocketServer.hx", lineNumber : 35, className : "com.tamina.cow4.socket.WSocketServer", methodName : "errorHandler"});
	}
	,connectionHandler: function(socket) {
		haxe_Log.trace("[Socket server] : New Connection",{ fileName : "WSocketServer.hx", lineNumber : 39, className : "com.tamina.cow4.socket.WSocketServer", methodName : "connectionHandler"});
		var p = new com_tamina_cow4_socket_Player(socket);
		p.exitSignal.addOnce($bind(this,this.playerCloseHandler));
		com_tamina_cow4_socket_WSocketServer.connections.push(p);
	}
	,playerCloseHandler: function(id) {
		var _g1 = 0;
		var _g = com_tamina_cow4_socket_WSocketServer.connections.length;
		while(_g1 < _g) {
			var i = _g1++;
			var c = com_tamina_cow4_socket_WSocketServer.connections[i];
			if(c.id == id) {
				HxOverrides.remove(com_tamina_cow4_socket_WSocketServer.connections,c);
				break;
			}
		}
	}
	,__class__: com_tamina_cow4_socket_WSocketServer
};
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
var com_tamina_cow4_socket_message_PlayerMessage = function(type) {
	com_tamina_cow4_socket_message_SocketMessage.call(this,type);
};
com_tamina_cow4_socket_message_PlayerMessage.__name__ = true;
com_tamina_cow4_socket_message_PlayerMessage.__super__ = com_tamina_cow4_socket_message_SocketMessage;
com_tamina_cow4_socket_message_PlayerMessage.prototype = $extend(com_tamina_cow4_socket_message_SocketMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_PlayerMessage
});
var com_tamina_cow4_socket_message_Render = function(map) {
	com_tamina_cow4_socket_message_GameServerMessage.call(this,"render");
	this.map = map;
};
com_tamina_cow4_socket_message_Render.__name__ = true;
com_tamina_cow4_socket_message_Render.__super__ = com_tamina_cow4_socket_message_GameServerMessage;
com_tamina_cow4_socket_message_Render.prototype = $extend(com_tamina_cow4_socket_message_GameServerMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_Render
});
var com_tamina_cow4_socket_message_StartBattle = function(gameId,ia1,ia2) {
	com_tamina_cow4_socket_message_PlayerMessage.call(this,"startbattle");
	this.gameId = gameId;
	this.IA1 = ia1;
	this.IA2 = ia2;
};
com_tamina_cow4_socket_message_StartBattle.__name__ = true;
com_tamina_cow4_socket_message_StartBattle.__super__ = com_tamina_cow4_socket_message_PlayerMessage;
com_tamina_cow4_socket_message_StartBattle.prototype = $extend(com_tamina_cow4_socket_message_PlayerMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_StartBattle
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
var com_tamina_cow4_socket_message_UpdateRender = function() {
	com_tamina_cow4_socket_message_GameServerMessage.call(this,"updateRender");
	this.actions = [];
};
com_tamina_cow4_socket_message_UpdateRender.__name__ = true;
com_tamina_cow4_socket_message_UpdateRender.__super__ = com_tamina_cow4_socket_message_GameServerMessage;
com_tamina_cow4_socket_message_UpdateRender.prototype = $extend(com_tamina_cow4_socket_message_GameServerMessage.prototype,{
	__class__: com_tamina_cow4_socket_message_UpdateRender
});
var com_tamina_cow4_socket_message_order_EndOrder = function(action,message) {
	this.message = "";
	com_tamina_cow4_model_TurnAction.call(this,action);
	this.message = message;
};
com_tamina_cow4_socket_message_order_EndOrder.__name__ = true;
com_tamina_cow4_socket_message_order_EndOrder.__super__ = com_tamina_cow4_model_TurnAction;
com_tamina_cow4_socket_message_order_EndOrder.prototype = $extend(com_tamina_cow4_model_TurnAction.prototype,{
	__class__: com_tamina_cow4_socket_message_order_EndOrder
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
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe__$Int64__$_$_$Int64 = function(high,low) {
	this.high = high;
	this.low = low;
};
haxe__$Int64__$_$_$Int64.__name__ = true;
haxe__$Int64__$_$_$Int64.prototype = {
	__class__: haxe__$Int64__$_$_$Int64
};
var haxe_Log = function() { };
haxe_Log.__name__ = true;
haxe_Log.trace = function(v,infos) {
	js_Boot.__trace(v,infos);
};
var haxe_Timer = function(time_ms) {
	var me = this;
	this.id = setInterval(function() {
		me.run();
	},time_ms);
};
haxe_Timer.__name__ = true;
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
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	set: function(key,value) {
		if(__map_reserved[key] != null) this.setReserved(key,value); else this.h[key] = value;
	}
	,setReserved: function(key,value) {
		if(this.rh == null) this.rh = { };
		this.rh["$" + key] = value;
	}
	,__class__: haxe_ds_StringMap
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
js_Boot.__unhtml = function(s) {
	return s.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");
};
js_Boot.__trace = function(v,i) {
	var msg;
	if(i != null) msg = i.fileName + ":" + i.lineNumber + ": "; else msg = "";
	msg += js_Boot.__string_rec(v,"");
	if(i != null && i.customParams != null) {
		var _g = 0;
		var _g1 = i.customParams;
		while(_g < _g1.length) {
			var v1 = _g1[_g];
			++_g;
			msg += "," + js_Boot.__string_rec(v1,"");
		}
	}
	var d;
	if(typeof(document) != "undefined" && (d = document.getElementById("haxe:trace")) != null) d.innerHTML += js_Boot.__unhtml(msg) + "<br/>"; else if(typeof console != "undefined" && console.log != null) console.log(msg);
};
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
var nodejs_ChildProcessEventType = function() { };
nodejs_ChildProcessEventType.__name__ = true;
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
var nodejs_express_Express = function() { };
nodejs_express_Express.__name__ = true;
nodejs_express_Express.GetApplication = function() {
	return require('express')();
};
nodejs_express_Express.GetRouter = function(p_case_sensitive,p_strict) {
	if(p_strict == null) p_strict = false;
	if(p_case_sensitive == null) p_case_sensitive = false;
	var opt = { };
	opt.caseSensitive = p_case_sensitive;
	opt.strict = p_strict;
	return require('express').Router(opt);
};
nodejs_express_Express.Static = function(p_value) {
	return (require('express')).static(p_value);
};
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
var nodejs_ws_WebSocketEventType = function() { };
nodejs_ws_WebSocketEventType.__name__ = true;
var nodejs_ws_WebSocketReadyState = function() { };
nodejs_ws_WebSocketReadyState.__name__ = true;
var nodejs_ws_WebSocketServerEventType = function() { };
nodejs_ws_WebSocketServerEventType.__name__ = true;
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
var org_tamina_net_URL = function(path) {
	if(path == null) path = "";
	this.path = path;
	this._parameters = new haxe_ds_StringMap();
	if(path.lastIndexOf("?") > 0) {
		var params = path.substring(path.lastIndexOf("?") + 1);
		var elements = params.split("&");
		var _g1 = 0;
		var _g = elements.length;
		while(_g1 < _g) {
			var i = _g1++;
			var element = elements[i].split("=");
			this._parameters.set(element[0],element[1]);
		}
	}
};
org_tamina_net_URL.__name__ = true;
org_tamina_net_URL.prototype = {
	get_parameters: function() {
		return this._parameters;
	}
	,get_extension: function() {
		var result = "";
		if(this.path.lastIndexOf(".") == this.path.length - 4) result = this.path.substring(this.path.length - 3);
		return result;
	}
	,get_documentName: function() {
		var result = "";
		if(this.path != null) result = this.path.substring(this.path.lastIndexOf("/") + 1);
		return result;
	}
	,toString: function() {
		return this.path;
	}
	,removeParameter: function(key) {
		var rtn = this.path;
		if(this.path.indexOf("?") != -1) {
			rtn = this.path.split("?")[0];
			var param;
			var params_arr = [];
			var queryString;
			if(this.path.indexOf("?") != -1) queryString = this.path.split("?")[1]; else queryString = "";
			if(queryString != "") {
				params_arr = queryString.split("&");
				var i = params_arr.length - 1;
				while(i >= 0) {
					param = params_arr[i].split("=")[0];
					if(param == key) params_arr.splice(i,1);
					i -= 1;
				}
				rtn = rtn + "?" + params_arr.join("&");
			}
		}
		this.path = rtn;
	}
	,__class__: org_tamina_net_URL
};
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
var __map_reserved = {}
var ArrayBuffer = (Function("return typeof ArrayBuffer != 'undefined' ? ArrayBuffer : null"))() || js_html_compat_ArrayBuffer;
if(ArrayBuffer.prototype.slice == null) ArrayBuffer.prototype.slice = js_html_compat_ArrayBuffer.sliceImpl;
var DataView = (Function("return typeof DataView != 'undefined' ? DataView : null"))() || js_html_compat_DataView;
var Uint8Array = (Function("return typeof Uint8Array != 'undefined' ? Uint8Array : null"))() || js_html_compat_Uint8Array._new;
msignal_SlotList.NIL = new msignal_SlotList(null,null);
com_tamina_cow4_config_Config.ROOT_PATH = "server/";
com_tamina_cow4_config_Config.APP_PORT = 3000;
com_tamina_cow4_config_Config.SOCKET_PORT = 8127;
com_tamina_cow4_config_Config.WEB_SOCKET_PORT = 8128;
com_tamina_cow4_data_Mock.defaultMap = "{\"currentTurn\":0,\"cells\":[[{\"id\":1424090482209,\"bottom\":1424090482258,\"right\":1424090482210},{\"id\":1424090482210,\"left\":1424090482209,\"right\":1424090482211},{\"id\":1424090482211,\"left\":1424090482210,\"right\":1424090482212},{\"id\":1424090482212,\"left\":1424090482211,\"right\":1424090482213},{\"id\":1424090482213,\"left\":1424090482212,\"right\":1424090482214},{\"id\":1424090482214,\"left\":1424090482213,\"right\":1424090482215},{\"id\":1424090482215,\"left\":1424090482214,\"right\":1424090482216},{\"id\":1424090482216,\"bottom\":1424090482251,\"left\":1424090482215,\"right\":1424090482217},{\"id\":1424090482217,\"left\":1424090482216,\"right\":1424090482218},{\"id\":1424090482218,\"left\":1424090482217,\"right\":1424090482219},{\"id\":1424090482219,\"bottom\":1424090482248,\"left\":1424090482218,\"right\":1424090482220},{\"id\":1424090482220,\"left\":1424090482219,\"right\":1424090482221},{\"id\":1424090482221,\"left\":1424090482220,\"right\":1424090482222},{\"id\":1424090482222,\"bottom\":1424090482245,\"left\":1424090482221},{\"id\":1424090482223},{\"id\":1424090482224,\"bottom\":1424090482243,\"right\":1424090482225},{\"id\":1424090482225,\"left\":1424090482224,\"right\":1424090482226},{\"id\":1424090482226,\"left\":1424090482225,\"right\":1424090482227},{\"id\":1424090482227,\"left\":1424090482226,\"right\":1424090482228},{\"id\":1424090482228,\"left\":1424090482227,\"right\":1424090482229},{\"id\":1424090482229,\"left\":1424090482228,\"right\":1424090482230},{\"id\":1424090482230,\"left\":1424090482229,\"right\":1424090482231},{\"id\":1424090482231,\"left\":1424090482230,\"right\":1424090482232},{\"id\":1424090482232,\"left\":1424090482231,\"right\":1424090482233},{\"id\":1424090482233,\"bottom\":1424090482234,\"left\":1424090482232}],[{\"id\":1424090482258,\"top\":1424090482209,\"bottom\":1424090482259},{\"id\":1424090482257,\"bottom\":1424090482260,\"right\":1424090482256},{\"id\":1424090482256,\"left\":1424090482257,\"right\":1424090482255},{\"id\":1424090482255,\"bottom\":1424090482262,\"left\":1424090482256},{\"id\":1424090482254,\"bottom\":1424090482263,\"right\":1424090482253},{\"id\":1424090482253,\"left\":1424090482254,\"right\":1424090482252},{\"id\":1424090482252,\"bottom\":1424090482265,\"left\":1424090482253},{\"id\":1424090482251,\"top\":1424090482216,\"right\":1424090482250},{\"id\":1424090482250,\"left\":1424090482251,\"right\":1424090482249},{\"id\":1424090482249,\"bottom\":1424090482268,\"left\":1424090482250},{\"id\":1424090482248,\"top\":1424090482219,\"right\":1424090482247},{\"id\":1424090482247,\"left\":1424090482248,\"right\":1424090482246},{\"id\":1424090482246,\"bottom\":1424090482271,\"left\":1424090482247},{\"id\":1424090482245,\"top\":1424090482222,\"right\":1424090482244},{\"id\":1424090482244,\"left\":1424090482245,\"right\":1424090482243},{\"id\":1424090482243,\"top\":1424090482224,\"left\":1424090482244},{\"id\":1424090482242,\"bottom\":1424090482275,\"right\":1424090482241},{\"id\":1424090482241,\"left\":1424090482242,\"right\":1424090482240},{\"id\":1424090482240,\"left\":1424090482241,\"right\":1424090482239},{\"id\":1424090482239,\"left\":1424090482240,\"right\":1424090482238},{\"id\":1424090482238,\"left\":1424090482239,\"right\":1424090482237},{\"id\":1424090482237,\"left\":1424090482238,\"right\":1424090482236},{\"id\":1424090482236,\"left\":1424090482237,\"right\":1424090482235},{\"id\":1424090482235,\"left\":1424090482236,\"right\":1424090482234},{\"id\":1424090482234,\"top\":1424090482233,\"left\":1424090482235}],[{\"id\":1424090482259,\"top\":1424090482258,\"right\":1424090482260},{\"id\":1424090482260,\"top\":1424090482257,\"left\":1424090482259},{\"id\":1424090482261,\"right\":1424090482262},{\"id\":1424090482262,\"top\":1424090482255,\"left\":1424090482261,\"right\":1424090482263},{\"id\":1424090482263,\"top\":1424090482254,\"left\":1424090482262},{\"id\":1424090482264,\"bottom\":1424090482303,\"right\":1424090482265},{\"id\":1424090482265,\"top\":1424090482252,\"left\":1424090482264,\"right\":1424090482266},{\"id\":1424090482266,\"left\":1424090482265,\"right\":1424090482267},{\"id\":1424090482267,\"bottom\":1424090482300,\"left\":1424090482266},{\"id\":1424090482268,\"top\":1424090482249,\"right\":1424090482269},{\"id\":1424090482269,\"left\":1424090482268,\"right\":1424090482270},{\"id\":1424090482270,\"bottom\":1424090482297,\"left\":1424090482269},{\"id\":1424090482271,\"top\":1424090482246,\"right\":1424090482272},{\"id\":1424090482272,\"left\":1424090482271,\"right\":1424090482273},{\"id\":1424090482273,\"left\":1424090482272,\"right\":1424090482274},{\"id\":1424090482274,\"left\":1424090482273,\"right\":1424090482275},{\"id\":1424090482275,\"top\":1424090482242,\"bottom\":1424090482292,\"left\":1424090482274},{\"id\":1424090482276,\"bottom\":1424090482291,\"right\":1424090482277},{\"id\":1424090482277,\"left\":1424090482276,\"right\":1424090482278},{\"id\":1424090482278,\"left\":1424090482277,\"right\":1424090482279},{\"id\":1424090482279,\"left\":1424090482278,\"right\":1424090482280},{\"id\":1424090482280,\"left\":1424090482279,\"right\":1424090482281},{\"id\":1424090482281,\"left\":1424090482280,\"right\":1424090482282},{\"id\":1424090482282,\"left\":1424090482281,\"right\":1424090482283},{\"id\":1424090482283,\"bottom\":1424090482284,\"left\":1424090482282}],[{\"id\":1424090482308,\"bottom\":1424090482309,\"right\":1424090482307},{\"id\":1424090482307,\"left\":1424090482308,\"right\":1424090482306},{\"id\":1424090482306,\"left\":1424090482307,\"right\":1424090482305},{\"id\":1424090482305,\"left\":1424090482306,\"right\":1424090482304},{\"id\":1424090482304,\"left\":1424090482305,\"right\":1424090482303},{\"id\":1424090482303,\"top\":1424090482264,\"bottom\":1424090482314,\"left\":1424090482304},{\"id\":1424090482302,\"bottom\":1424090482315,\"right\":1424090482301},{\"id\":1424090482301,\"item\":{\"type\":\"trap\"},\"bottom\":1424090482316,\"left\":1424090482302},{\"id\":1424090482300,\"top\":1424090482267,\"right\":1424090482299},{\"id\":1424090482299,\"left\":1424090482300,\"right\":1424090482298},{\"id\":1424090482298,\"bottom\":1424090482319,\"left\":1424090482299},{\"id\":1424090482297,\"top\":1424090482270,\"right\":1424090482296},{\"id\":1424090482296,\"left\":1424090482297,\"right\":1424090482295},{\"id\":1424090482295,\"left\":1424090482296,\"right\":1424090482294},{\"id\":1424090482294,\"left\":1424090482295,\"right\":1424090482293},{\"id\":1424090482293,\"bottom\":1424090482324,\"left\":1424090482294},{\"id\":1424090482292,\"top\":1424090482275,\"right\":1424090482291},{\"id\":1424090482291,\"top\":1424090482276,\"left\":1424090482292},{\"id\":1424090482290,\"bottom\":1424090482327,\"right\":1424090482289},{\"id\":1424090482289,\"left\":1424090482290,\"right\":1424090482288},{\"id\":1424090482288,\"bottom\":1424090482329,\"left\":1424090482289,\"right\":1424090482287},{\"id\":1424090482287,\"left\":1424090482288,\"right\":1424090482286},{\"id\":1424090482286,\"left\":1424090482287,\"right\":1424090482285},{\"id\":1424090482285,\"left\":1424090482286,\"right\":1424090482284},{\"id\":1424090482284,\"top\":1424090482283,\"left\":1424090482285}],[{\"id\":1424090482309,\"top\":1424090482308,\"bottom\":1424090482358},{\"id\":1424090482310,\"bottom\":1424090482357,\"right\":1424090482311},{\"id\":1424090482311,\"left\":1424090482310,\"right\":1424090482312},{\"id\":1424090482312,\"left\":1424090482311,\"right\":1424090482313},{\"id\":1424090482313,\"left\":1424090482312,\"right\":1424090482314},{\"id\":1424090482314,\"top\":1424090482303,\"left\":1424090482313},{\"id\":1424090482315,\"top\":1424090482302,\"bottom\":1424090482352},{\"id\":1424090482316,\"top\":1424090482301,\"bottom\":1424090482351},{\"id\":1424090482317,\"right\":1424090482318},{\"id\":1424090482318,\"left\":1424090482317,\"right\":1424090482319},{\"id\":1424090482319,\"top\":1424090482298,\"left\":1424090482318,\"right\":1424090482320},{\"id\":1424090482320,\"left\":1424090482319,\"right\":1424090482321},{\"id\":1424090482321,\"left\":1424090482320,\"right\":1424090482322},{\"id\":1424090482322,\"bottom\":1424090482345,\"left\":1424090482321,\"right\":1424090482323},{\"id\":1424090482323,\"left\":1424090482322,\"right\":1424090482324},{\"id\":1424090482324,\"top\":1424090482293,\"left\":1424090482323,\"right\":1424090482325},{\"id\":1424090482325,\"left\":1424090482324,\"right\":1424090482326},{\"id\":1424090482326,\"left\":1424090482325,\"right\":1424090482327},{\"id\":1424090482327,\"top\":1424090482290,\"bottom\":1424090482340,\"left\":1424090482326,\"right\":1424090482328},{\"id\":1424090482328,\"left\":1424090482327,\"right\":1424090482329},{\"id\":1424090482329,\"top\":1424090482288,\"bottom\":1424090482338,\"left\":1424090482328},{\"id\":1424090482330,\"item\":{\"type\":\"potion\"},\"right\":1424090482331},{\"id\":1424090482331,\"left\":1424090482330,\"right\":1424090482332},{\"id\":1424090482332,\"left\":1424090482331,\"right\":1424090482333},{\"id\":1424090482333,\"bottom\":1424090482334,\"left\":1424090482332}],[{\"id\":1424090482358,\"top\":1424090482309,\"bottom\":1424090482359},{\"id\":1424090482357,\"top\":1424090482310,\"bottom\":1424090482360},{\"id\":1424090482356,\"bottom\":1424090482361,\"right\":1424090482355},{\"id\":1424090482355,\"left\":1424090482356,\"right\":1424090482354},{\"id\":1424090482354,\"left\":1424090482355,\"right\":1424090482353},{\"id\":1424090482353,\"left\":1424090482354,\"right\":1424090482352},{\"id\":1424090482352,\"top\":1424090482315,\"left\":1424090482353},{\"id\":1424090482351,\"top\":1424090482316,\"right\":1424090482350},{\"id\":1424090482350,\"left\":1424090482351,\"right\":1424090482349},{\"id\":1424090482349,\"left\":1424090482350,\"right\":1424090482348},{\"id\":1424090482348,\"bottom\":1424090482369,\"left\":1424090482349},{\"id\":1424090482347,\"bottom\":1424090482370,\"right\":1424090482346},{\"id\":1424090482346,\"bottom\":1424090482371,\"left\":1424090482347},{\"id\":1424090482345,\"top\":1424090482322,\"right\":1424090482344},{\"id\":1424090482344,\"left\":1424090482345,\"right\":1424090482343},{\"id\":1424090482343,\"left\":1424090482344,\"right\":1424090482342},{\"id\":1424090482342,\"left\":1424090482343,\"right\":1424090482341},{\"id\":1424090482341,\"left\":1424090482342,\"right\":1424090482340},{\"id\":1424090482340,\"top\":1424090482327,\"bottom\":1424090482377,\"left\":1424090482341,\"right\":1424090482339},{\"id\":1424090482339,\"left\":1424090482340,\"right\":1424090482338},{\"id\":1424090482338,\"top\":1424090482329,\"left\":1424090482339,\"right\":1424090482337},{\"id\":1424090482337,\"left\":1424090482338,\"right\":1424090482336},{\"id\":1424090482336,\"left\":1424090482337,\"right\":1424090482335},{\"id\":1424090482335,\"left\":1424090482336,\"right\":1424090482334},{\"id\":1424090482334,\"top\":1424090482333,\"left\":1424090482335}],[{\"id\":1424090482359,\"top\":1424090482358,\"bottom\":1424090482408},{\"id\":1424090482360,\"top\":1424090482357,\"bottom\":1424090482407},{\"id\":1424090482361,\"top\":1424090482356,\"right\":1424090482362},{\"id\":1424090482362,\"left\":1424090482361,\"right\":1424090482363},{\"id\":1424090482363,\"left\":1424090482362,\"right\":1424090482364},{\"id\":1424090482364,\"bottom\":1424090482403,\"left\":1424090482363},{\"id\":1424090482365,\"bottom\":1424090482402,\"right\":1424090482366},{\"id\":1424090482366,\"left\":1424090482365,\"right\":1424090482367},{\"id\":1424090482367,\"left\":1424090482366,\"right\":1424090482368},{\"id\":1424090482368,\"bottom\":1424090482399,\"left\":1424090482367},{\"id\":1424090482369,\"top\":1424090482348,\"bottom\":1424090482398},{\"id\":1424090482370,\"top\":1424090482347,\"bottom\":1424090482397},{\"id\":1424090482371,\"top\":1424090482346,\"right\":1424090482372},{\"id\":1424090482372,\"left\":1424090482371,\"right\":1424090482373},{\"id\":1424090482373,\"left\":1424090482372,\"right\":1424090482374},{\"id\":1424090482374,\"left\":1424090482373,\"right\":1424090482375},{\"id\":1424090482375,\"left\":1424090482374,\"right\":1424090482376},{\"id\":1424090482376,\"bottom\":1424090482391,\"left\":1424090482375},{\"id\":1424090482377,\"top\":1424090482340,\"right\":1424090482378},{\"id\":1424090482378,\"left\":1424090482377,\"right\":1424090482379},{\"id\":1424090482379,\"left\":1424090482378,\"right\":1424090482380},{\"id\":1424090482380,\"left\":1424090482379,\"right\":1424090482381},{\"id\":1424090482381,\"left\":1424090482380,\"right\":1424090482382},{\"id\":1424090482382,\"left\":1424090482381,\"right\":1424090482383},{\"id\":1424090482383,\"bottom\":1424090482384,\"left\":1424090482382}],[{\"id\":1424090482408,\"top\":1424090482359,\"bottom\":1424090482409},{\"id\":1424090482407,\"top\":1424090482360,\"right\":1424090482406},{\"id\":1424090482406,\"left\":1424090482407,\"right\":1424090482405},{\"id\":1424090482405,\"left\":1424090482406,\"right\":1424090482404},{\"id\":1424090482404,\"left\":1424090482405,\"right\":1424090482403},{\"id\":1424090482403,\"top\":1424090482364,\"left\":1424090482404},{\"id\":1424090482402,\"top\":1424090482365,\"right\":1424090482401},{\"id\":1424090482401,\"left\":1424090482402,\"right\":1424090482400},{\"id\":1424090482400,\"bottom\":1424090482417,\"left\":1424090482401},{\"id\":1424090482399,\"top\":1424090482368,\"right\":1424090482398},{\"id\":1424090482398,\"top\":1424090482369,\"left\":1424090482399},{\"id\":1424090482397,\"top\":1424090482370,\"right\":1424090482396},{\"id\":1424090482396,\"left\":1424090482397,\"right\":1424090482395},{\"id\":1424090482395,\"left\":1424090482396,\"right\":1424090482394},{\"id\":1424090482394,\"left\":1424090482395,\"right\":1424090482393},{\"id\":1424090482393,\"left\":1424090482394,\"right\":1424090482392},{\"id\":1424090482392,\"bottom\":1424090482425,\"left\":1424090482393},{\"id\":1424090482391,\"top\":1424090482376,\"bottom\":1424090482426,\"right\":1424090482390},{\"id\":1424090482390,\"bottom\":1424090482427,\"left\":1424090482391},{\"id\":1424090482389,\"bottom\":1424090482428,\"right\":1424090482388},{\"id\":1424090482388,\"bottom\":1424090482429,\"left\":1424090482389,\"right\":1424090482387},{\"id\":1424090482387,\"left\":1424090482388,\"right\":1424090482386},{\"id\":1424090482386,\"left\":1424090482387,\"right\":1424090482385},{\"id\":1424090482385,\"left\":1424090482386,\"right\":1424090482384},{\"id\":1424090482384,\"top\":1424090482383,\"bottom\":1424090482433,\"left\":1424090482385}],[{\"id\":1424090482409,\"top\":1424090482408,\"right\":1424090482410},{\"id\":1424090482410,\"left\":1424090482409,\"right\":1424090482411},{\"id\":1424090482411,\"left\":1424090482410,\"right\":1424090482412},{\"id\":1424090482412,\"bottom\":1424090482455,\"left\":1424090482411,\"right\":1424090482413},{\"id\":1424090482413,\"left\":1424090482412,\"right\":1424090482414},{\"id\":1424090482414,\"left\":1424090482413,\"right\":1424090482415},{\"id\":1424090482415,\"left\":1424090482414,\"right\":1424090482416},{\"id\":1424090482416,\"left\":1424090482415},{\"id\":1424090482417,\"top\":1424090482400,\"right\":1424090482418},{\"id\":1424090482418,\"left\":1424090482417,\"right\":1424090482419},{\"id\":1424090482419,\"left\":1424090482418,\"right\":1424090482420},{\"id\":1424090482420,\"left\":1424090482419,\"right\":1424090482421},{\"id\":1424090482421,\"bottom\":1424090482446,\"left\":1424090482420,\"right\":1424090482422},{\"id\":1424090482422,\"left\":1424090482421,\"right\":1424090482423},{\"id\":1424090482423,\"left\":1424090482422,\"right\":1424090482424},{\"id\":1424090482424,\"left\":1424090482423,\"right\":1424090482425},{\"id\":1424090482425,\"top\":1424090482392,\"left\":1424090482424},{\"id\":1424090482426,\"top\":1424090482391},{\"id\":1424090482427,\"top\":1424090482390,\"right\":1424090482428},{\"id\":1424090482428,\"top\":1424090482389,\"left\":1424090482427},{\"id\":1424090482429,\"top\":1424090482388,\"bottom\":1424090482438},{\"id\":1424090482430,\"right\":1424090482431},{\"id\":1424090482431,\"left\":1424090482430,\"right\":1424090482432},{\"id\":1424090482432,\"left\":1424090482431,\"right\":1424090482433},{\"id\":1424090482433,\"top\":1424090482384,\"left\":1424090482432}],[{\"id\":1424090482458,\"bottom\":1424090482459,\"right\":1424090482457},{\"id\":1424090482457,\"left\":1424090482458,\"right\":1424090482456},{\"id\":1424090482456,\"left\":1424090482457,\"right\":1424090482455},{\"id\":1424090482455,\"top\":1424090482412,\"left\":1424090482456,\"right\":1424090482454},{\"id\":1424090482454,\"left\":1424090482455,\"right\":1424090482453},{\"id\":1424090482453,\"left\":1424090482454,\"right\":1424090482452},{\"id\":1424090482452,\"left\":1424090482453,\"right\":1424090482451},{\"id\":1424090482451,\"left\":1424090482452},{\"id\":1424090482450,\"bottom\":1424090482467,\"right\":1424090482449},{\"id\":1424090482449,\"left\":1424090482450,\"right\":1424090482448},{\"id\":1424090482448,\"left\":1424090482449,\"right\":1424090482447},{\"id\":1424090482447,\"left\":1424090482448,\"right\":1424090482446},{\"id\":1424090482446,\"top\":1424090482421,\"left\":1424090482447,\"right\":1424090482445},{\"id\":1424090482445,\"left\":1424090482446,\"right\":1424090482444},{\"id\":1424090482444,\"left\":1424090482445,\"right\":1424090482443},{\"id\":1424090482443,\"left\":1424090482444,\"right\":1424090482442},{\"id\":1424090482442,\"left\":1424090482443},{\"id\":1424090482441,\"bottom\":1424090482476,\"right\":1424090482440},{\"id\":1424090482440,\"left\":1424090482441,\"right\":1424090482439},{\"id\":1424090482439,\"left\":1424090482440,\"right\":1424090482438},{\"id\":1424090482438,\"top\":1424090482429,\"left\":1424090482439,\"right\":1424090482437},{\"id\":1424090482437,\"left\":1424090482438,\"right\":1424090482436},{\"id\":1424090482436,\"left\":1424090482437,\"right\":1424090482435},{\"id\":1424090482435,\"left\":1424090482436,\"right\":1424090482434},{\"id\":1424090482434,\"bottom\":1424090482483,\"left\":1424090482435}],[{\"id\":1424090482459,\"top\":1424090482458,\"right\":1424090482460},{\"id\":1424090482460,\"left\":1424090482459,\"right\":1424090482461},{\"id\":1424090482461,\"left\":1424090482460,\"right\":1424090482462},{\"id\":1424090482462,\"left\":1424090482461,\"right\":1424090482463},{\"id\":1424090482463,\"bottom\":1424090482504,\"left\":1424090482462,\"right\":1424090482464},{\"id\":1424090482464,\"bottom\":1424090482503,\"left\":1424090482463,\"right\":1424090482465},{\"id\":1424090482465,\"left\":1424090482464,\"right\":1424090482466},{\"id\":1424090482466,\"item\":{\"type\":\"parfum\"},\"left\":1424090482465},{\"id\":1424090482467,\"top\":1424090482450,\"bottom\":1424090482500,\"right\":1424090482468},{\"id\":1424090482468,\"left\":1424090482467,\"right\":1424090482469},{\"id\":1424090482469,\"left\":1424090482468,\"right\":1424090482470},{\"id\":1424090482470,\"left\":1424090482469,\"right\":1424090482471},{\"id\":1424090482471,\"bottom\":1424090482496,\"left\":1424090482470,\"right\":1424090482472},{\"id\":1424090482472,\"left\":1424090482471,\"right\":1424090482473},{\"id\":1424090482473,\"left\":1424090482472,\"right\":1424090482474},{\"id\":1424090482474,\"left\":1424090482473,\"right\":1424090482475},{\"id\":1424090482475,\"bottom\":1424090482492,\"left\":1424090482474},{\"id\":1424090482476,\"top\":1424090482441,\"right\":1424090482477},{\"id\":1424090482477,\"left\":1424090482476,\"right\":1424090482478},{\"id\":1424090482478,\"left\":1424090482477,\"right\":1424090482479},{\"id\":1424090482479,\"bottom\":1424090482488,\"left\":1424090482478,\"right\":1424090482480},{\"id\":1424090482480,\"bottom\":1424090482487,\"left\":1424090482479,\"right\":1424090482481},{\"id\":1424090482481,\"left\":1424090482480,\"right\":1424090482482},{\"id\":1424090482482,\"left\":1424090482481,\"right\":1424090482483},{\"id\":1424090482483,\"top\":1424090482434,\"left\":1424090482482}],[{\"id\":1424090482508,\"bottom\":1424090482509,\"right\":1424090482507},{\"id\":1424090482507,\"left\":1424090482508,\"right\":1424090482506},{\"id\":1424090482506,\"left\":1424090482507,\"right\":1424090482505},{\"id\":1424090482505,\"left\":1424090482506,\"right\":1424090482504},{\"id\":1424090482504,\"top\":1424090482463,\"left\":1424090482505},{\"id\":1424090482503,\"top\":1424090482464,\"right\":1424090482502},{\"id\":1424090482502,\"left\":1424090482503,\"right\":1424090482501},{\"id\":1424090482501,\"left\":1424090482502,\"right\":1424090482500},{\"id\":1424090482500,\"top\":1424090482467,\"left\":1424090482501,\"right\":1424090482499},{\"id\":1424090482499,\"left\":1424090482500,\"right\":1424090482498},{\"id\":1424090482498,\"left\":1424090482499},{\"id\":1424090482497,\"bottom\":1424090482520,\"right\":1424090482496},{\"id\":1424090482496,\"top\":1424090482471,\"left\":1424090482497,\"right\":1424090482495},{\"id\":1424090482495,\"bottom\":1424090482522,\"left\":1424090482496},{\"id\":1424090482494,\"right\":1424090482493},{\"id\":1424090482493,\"left\":1424090482494,\"right\":1424090482492},{\"id\":1424090482492,\"top\":1424090482475,\"left\":1424090482493,\"right\":1424090482491},{\"id\":1424090482491,\"left\":1424090482492,\"right\":1424090482490},{\"id\":1424090482490,\"left\":1424090482491,\"right\":1424090482489},{\"id\":1424090482489,\"left\":1424090482490,\"right\":1424090482488},{\"id\":1424090482488,\"top\":1424090482479,\"left\":1424090482489},{\"id\":1424090482487,\"top\":1424090482480,\"right\":1424090482486},{\"id\":1424090482486,\"left\":1424090482487,\"right\":1424090482485},{\"id\":1424090482485,\"left\":1424090482486,\"right\":1424090482484},{\"id\":1424090482484,\"bottom\":1424090482533,\"left\":1424090482485}],[{\"id\":1424090482509,\"top\":1424090482508,\"bottom\":1424090482558,\"right\":1424090482510},{\"id\":1424090482510,\"left\":1424090482509,\"right\":1424090482511},{\"id\":1424090482511,\"left\":1424090482510,\"right\":1424090482512},{\"id\":1424090482512,\"left\":1424090482511,\"right\":1424090482513},{\"id\":1424090482513,\"left\":1424090482512,\"right\":1424090482514},{\"id\":1424090482514,\"left\":1424090482513,\"right\":1424090482515},{\"id\":1424090482515,\"left\":1424090482514,\"right\":1424090482516},{\"id\":1424090482516,\"left\":1424090482515,\"right\":1424090482517},{\"id\":1424090482517,\"left\":1424090482516,\"right\":1424090482518},{\"id\":1424090482518,\"left\":1424090482517,\"right\":1424090482519},{\"id\":1424090482519,\"left\":1424090482518,\"right\":1424090482520},{\"id\":1424090482520,\"top\":1424090482497,\"bottom\":1424090482547,\"left\":1424090482519,\"right\":1424090482521},{\"id\":1424090482521,\"left\":1424090482520,\"right\":1424090482522},{\"id\":1424090482522,\"top\":1424090482495,\"bottom\":1424090482545,\"left\":1424090482521,\"right\":1424090482523},{\"id\":1424090482523,\"left\":1424090482522,\"right\":1424090482524},{\"id\":1424090482524,\"left\":1424090482523,\"right\":1424090482525},{\"id\":1424090482525,\"left\":1424090482524,\"right\":1424090482526},{\"id\":1424090482526,\"left\":1424090482525,\"right\":1424090482527},{\"id\":1424090482527,\"left\":1424090482526,\"right\":1424090482528},{\"id\":1424090482528,\"left\":1424090482527,\"right\":1424090482529},{\"id\":1424090482529,\"left\":1424090482528,\"right\":1424090482530},{\"id\":1424090482530,\"left\":1424090482529,\"right\":1424090482531},{\"id\":1424090482531,\"left\":1424090482530,\"right\":1424090482532},{\"id\":1424090482532,\"left\":1424090482531,\"right\":1424090482533},{\"id\":1424090482533,\"top\":1424090482484,\"bottom\":1424090482534,\"left\":1424090482532}],[{\"id\":1424090482558,\"top\":1424090482509,\"right\":1424090482557},{\"id\":1424090482557,\"left\":1424090482558,\"right\":1424090482556},{\"id\":1424090482556,\"left\":1424090482557,\"right\":1424090482555},{\"id\":1424090482555,\"bottom\":1424090482562,\"left\":1424090482556},{\"id\":1424090482554,\"bottom\":1424090482563,\"right\":1424090482553},{\"id\":1424090482553,\"left\":1424090482554,\"right\":1424090482552},{\"id\":1424090482552,\"left\":1424090482553,\"right\":1424090482551},{\"id\":1424090482551,\"left\":1424090482552,\"right\":1424090482550},{\"id\":1424090482550,\"bottom\":1424090482567,\"left\":1424090482551,\"right\":1424090482549},{\"id\":1424090482549,\"left\":1424090482550,\"right\":1424090482548},{\"id\":1424090482548,\"left\":1424090482549},{\"id\":1424090482547,\"top\":1424090482520,\"right\":1424090482546},{\"id\":1424090482546,\"bottom\":1424090482571,\"left\":1424090482547,\"right\":1424090482545},{\"id\":1424090482545,\"top\":1424090482522,\"left\":1424090482546},{\"id\":1424090482544,\"right\":1424090482543},{\"id\":1424090482543,\"left\":1424090482544,\"right\":1424090482542},{\"id\":1424090482542,\"bottom\":1424090482575,\"left\":1424090482543,\"right\":1424090482541},{\"id\":1424090482541,\"left\":1424090482542,\"right\":1424090482540},{\"id\":1424090482540,\"left\":1424090482541,\"right\":1424090482539},{\"id\":1424090482539,\"bottom\":1424090482578,\"left\":1424090482540},{\"id\":1424090482538,\"bottom\":1424090482579,\"right\":1424090482537},{\"id\":1424090482537,\"left\":1424090482538,\"right\":1424090482536},{\"id\":1424090482536,\"left\":1424090482537,\"right\":1424090482535},{\"id\":1424090482535,\"left\":1424090482536,\"right\":1424090482534},{\"id\":1424090482534,\"top\":1424090482533,\"left\":1424090482535}],[{\"id\":1424090482559,\"bottom\":1424090482608,\"right\":1424090482560},{\"id\":1424090482560,\"left\":1424090482559,\"right\":1424090482561},{\"id\":1424090482561,\"left\":1424090482560,\"right\":1424090482562},{\"id\":1424090482562,\"top\":1424090482555,\"left\":1424090482561,\"right\":1424090482563},{\"id\":1424090482563,\"top\":1424090482554,\"left\":1424090482562,\"right\":1424090482564},{\"id\":1424090482564,\"left\":1424090482563,\"right\":1424090482565},{\"id\":1424090482565,\"left\":1424090482564,\"right\":1424090482566},{\"id\":1424090482566,\"bottom\":1424090482601,\"left\":1424090482565},{\"id\":1424090482567,\"top\":1424090482550,\"right\":1424090482568},{\"id\":1424090482568,\"left\":1424090482567,\"right\":1424090482569},{\"id\":1424090482569,\"left\":1424090482568,\"right\":1424090482570},{\"id\":1424090482570,\"left\":1424090482569,\"right\":1424090482571},{\"id\":1424090482571,\"top\":1424090482546,\"left\":1424090482570,\"right\":1424090482572},{\"id\":1424090482572,\"left\":1424090482571,\"right\":1424090482573},{\"id\":1424090482573,\"left\":1424090482572,\"right\":1424090482574},{\"id\":1424090482574,\"left\":1424090482573,\"right\":1424090482575},{\"id\":1424090482575,\"top\":1424090482542,\"bottom\":1424090482592,\"left\":1424090482574},{\"id\":1424090482576,\"item\":{\"type\":\"parfum\"},\"right\":1424090482577},{\"id\":1424090482577,\"left\":1424090482576,\"right\":1424090482578},{\"id\":1424090482578,\"top\":1424090482539,\"left\":1424090482577,\"right\":1424090482579},{\"id\":1424090482579,\"top\":1424090482538,\"left\":1424090482578,\"right\":1424090482580},{\"id\":1424090482580,\"left\":1424090482579,\"right\":1424090482581},{\"id\":1424090482581,\"left\":1424090482580,\"right\":1424090482582},{\"id\":1424090482582,\"left\":1424090482581,\"right\":1424090482583},{\"id\":1424090482583,\"bottom\":1424090482584,\"left\":1424090482582}],[{\"id\":1424090482608,\"top\":1424090482559,\"right\":1424090482607},{\"id\":1424090482607,\"left\":1424090482608,\"right\":1424090482606},{\"id\":1424090482606,\"left\":1424090482607,\"right\":1424090482605},{\"id\":1424090482605,\"left\":1424090482606,\"right\":1424090482604},{\"id\":1424090482604,\"bottom\":1424090482613,\"left\":1424090482605,\"right\":1424090482603},{\"id\":1424090482603,\"left\":1424090482604,\"right\":1424090482602},{\"id\":1424090482602,\"left\":1424090482603,\"right\":1424090482601},{\"id\":1424090482601,\"top\":1424090482566,\"left\":1424090482602},{\"id\":1424090482600,\"right\":1424090482599},{\"id\":1424090482599,\"left\":1424090482600,\"right\":1424090482598},{\"id\":1424090482598,\"left\":1424090482599,\"right\":1424090482597},{\"id\":1424090482597,\"left\":1424090482598,\"right\":1424090482596},{\"id\":1424090482596,\"bottom\":1424090482621,\"left\":1424090482597,\"right\":1424090482595},{\"id\":1424090482595,\"left\":1424090482596,\"right\":1424090482594},{\"id\":1424090482594,\"left\":1424090482595,\"right\":1424090482593},{\"id\":1424090482593,\"left\":1424090482594,\"right\":1424090482592},{\"id\":1424090482592,\"top\":1424090482575,\"left\":1424090482593},{\"id\":1424090482591,\"right\":1424090482590},{\"id\":1424090482590,\"left\":1424090482591,\"right\":1424090482589},{\"id\":1424090482589,\"left\":1424090482590,\"right\":1424090482588},{\"id\":1424090482588,\"left\":1424090482589,\"right\":1424090482587},{\"id\":1424090482587,\"bottom\":1424090482630,\"left\":1424090482588,\"right\":1424090482586},{\"id\":1424090482586,\"left\":1424090482587,\"right\":1424090482585},{\"id\":1424090482585,\"left\":1424090482586,\"right\":1424090482584},{\"id\":1424090482584,\"top\":1424090482583,\"left\":1424090482585}],[{\"id\":1424090482609,\"bottom\":1424090482658,\"right\":1424090482610},{\"id\":1424090482610,\"left\":1424090482609,\"right\":1424090482611},{\"id\":1424090482611,\"left\":1424090482610,\"right\":1424090482612},{\"id\":1424090482612,\"left\":1424090482611},{\"id\":1424090482613,\"top\":1424090482604,\"bottom\":1424090482654},{\"id\":1424090482614,\"bottom\":1424090482653,\"right\":1424090482615},{\"id\":1424090482615,\"bottom\":1424090482652,\"left\":1424090482614},{\"id\":1424090482616,\"bottom\":1424090482651},{\"id\":1424090482617,\"bottom\":1424090482650,\"right\":1424090482618},{\"id\":1424090482618,\"left\":1424090482617,\"right\":1424090482619},{\"id\":1424090482619,\"left\":1424090482618,\"right\":1424090482620},{\"id\":1424090482620,\"left\":1424090482619,\"right\":1424090482621},{\"id\":1424090482621,\"top\":1424090482596,\"left\":1424090482620,\"right\":1424090482622},{\"id\":1424090482622,\"left\":1424090482621,\"right\":1424090482623},{\"id\":1424090482623,\"left\":1424090482622,\"right\":1424090482624},{\"id\":1424090482624,\"left\":1424090482623,\"right\":1424090482625},{\"id\":1424090482625,\"bottom\":1424090482642,\"left\":1424090482624},{\"id\":1424090482626,\"right\":1424090482627},{\"id\":1424090482627,\"left\":1424090482626,\"right\":1424090482628},{\"id\":1424090482628,\"left\":1424090482627,\"right\":1424090482629},{\"id\":1424090482629,\"left\":1424090482628,\"right\":1424090482630},{\"id\":1424090482630,\"top\":1424090482587,\"left\":1424090482629,\"right\":1424090482631},{\"id\":1424090482631,\"left\":1424090482630,\"right\":1424090482632},{\"id\":1424090482632,\"left\":1424090482631,\"right\":1424090482633},{\"id\":1424090482633,\"bottom\":1424090482634,\"left\":1424090482632}],[{\"id\":1424090482658,\"top\":1424090482609,\"bottom\":1424090482659,\"right\":1424090482657},{\"id\":1424090482657,\"left\":1424090482658,\"right\":1424090482656},{\"id\":1424090482656,\"left\":1424090482657,\"right\":1424090482655},{\"id\":1424090482655,\"left\":1424090482656,\"right\":1424090482654},{\"id\":1424090482654,\"top\":1424090482613,\"left\":1424090482655,\"right\":1424090482653},{\"id\":1424090482653,\"top\":1424090482614,\"left\":1424090482654},{\"id\":1424090482652,\"top\":1424090482615,\"right\":1424090482651},{\"id\":1424090482651,\"top\":1424090482616,\"bottom\":1424090482666,\"left\":1424090482652},{\"id\":1424090482650,\"top\":1424090482617,\"right\":1424090482649},{\"id\":1424090482649,\"left\":1424090482650,\"right\":1424090482648},{\"id\":1424090482648,\"left\":1424090482649,\"right\":1424090482647},{\"id\":1424090482647,\"left\":1424090482648,\"right\":1424090482646},{\"id\":1424090482646,\"left\":1424090482647,\"right\":1424090482645},{\"id\":1424090482645,\"bottom\":1424090482672,\"left\":1424090482646},{\"id\":1424090482644,\"bottom\":1424090482673,\"right\":1424090482643},{\"id\":1424090482643,\"bottom\":1424090482674,\"left\":1424090482644},{\"id\":1424090482642,\"top\":1424090482625,\"right\":1424090482641},{\"id\":1424090482641,\"left\":1424090482642,\"right\":1424090482640},{\"id\":1424090482640,\"bottom\":1424090482677,\"left\":1424090482641},{\"id\":1424090482639,\"bottom\":1424090482678,\"right\":1424090482638},{\"id\":1424090482638,\"left\":1424090482639,\"right\":1424090482637},{\"id\":1424090482637,\"left\":1424090482638,\"right\":1424090482636},{\"id\":1424090482636,\"left\":1424090482637,\"right\":1424090482635},{\"id\":1424090482635,\"bottom\":1424090482682,\"left\":1424090482636},{\"id\":1424090482634,\"top\":1424090482633,\"bottom\":1424090482683}],[{\"id\":1424090482659,\"top\":1424090482658,\"right\":1424090482660},{\"id\":1424090482660,\"left\":1424090482659,\"right\":1424090482661},{\"id\":1424090482661,\"left\":1424090482660,\"right\":1424090482662},{\"id\":1424090482662,\"left\":1424090482661,\"right\":1424090482663},{\"id\":1424090482663,\"left\":1424090482662,\"right\":1424090482664},{\"id\":1424090482664,\"left\":1424090482663,\"right\":1424090482665},{\"id\":1424090482665,\"bottom\":1424090482702,\"left\":1424090482664},{\"id\":1424090482666,\"top\":1424090482651,\"right\":1424090482667},{\"id\":1424090482667,\"left\":1424090482666,\"right\":1424090482668},{\"id\":1424090482668,\"left\":1424090482667,\"right\":1424090482669},{\"id\":1424090482669,\"left\":1424090482668,\"right\":1424090482670},{\"id\":1424090482670,\"left\":1424090482669,\"right\":1424090482671},{\"id\":1424090482671,\"bottom\":1424090482696,\"left\":1424090482670},{\"id\":1424090482672,\"top\":1424090482645,\"bottom\":1424090482695},{\"id\":1424090482673,\"top\":1424090482644,\"bottom\":1424090482694},{\"id\":1424090482674,\"top\":1424090482643,\"right\":1424090482675},{\"id\":1424090482675,\"left\":1424090482674,\"right\":1424090482676},{\"id\":1424090482676,\"left\":1424090482675,\"right\":1424090482677},{\"id\":1424090482677,\"top\":1424090482640,\"left\":1424090482676},{\"id\":1424090482678,\"top\":1424090482639,\"right\":1424090482679},{\"id\":1424090482679,\"left\":1424090482678,\"right\":1424090482680},{\"id\":1424090482680,\"left\":1424090482679,\"right\":1424090482681},{\"id\":1424090482681,\"bottom\":1424090482686,\"left\":1424090482680},{\"id\":1424090482682,\"top\":1424090482635,\"bottom\":1424090482685},{\"id\":1424090482683,\"top\":1424090482634,\"bottom\":1424090482684}],[{\"id\":1424090482708,\"bottom\":1424090482709,\"right\":1424090482707},{\"id\":1424090482707,\"left\":1424090482708,\"right\":1424090482706},{\"id\":1424090482706,\"left\":1424090482707,\"right\":1424090482705},{\"id\":1424090482705,\"left\":1424090482706,\"right\":1424090482704},{\"id\":1424090482704,\"bottom\":1424090482713,\"left\":1424090482705,\"right\":1424090482703},{\"id\":1424090482703,\"left\":1424090482704,\"right\":1424090482702},{\"id\":1424090482702,\"top\":1424090482665,\"bottom\":1424090482715,\"left\":1424090482703,\"right\":1424090482701},{\"id\":1424090482701,\"left\":1424090482702,\"right\":1424090482700},{\"id\":1424090482700,\"left\":1424090482701,\"right\":1424090482699},{\"id\":1424090482699,\"left\":1424090482700,\"right\":1424090482698},{\"id\":1424090482698,\"left\":1424090482699,\"right\":1424090482697},{\"id\":1424090482697,\"bottom\":1424090482720,\"left\":1424090482698},{\"id\":1424090482696,\"top\":1424090482671,\"right\":1424090482695},{\"id\":1424090482695,\"top\":1424090482672,\"left\":1424090482696},{\"id\":1424090482694,\"top\":1424090482673,\"right\":1424090482693},{\"id\":1424090482693,\"left\":1424090482694,\"right\":1424090482692},{\"id\":1424090482692,\"left\":1424090482693,\"right\":1424090482691},{\"id\":1424090482691,\"bottom\":1424090482726,\"left\":1424090482692},{\"id\":1424090482690,\"bottom\":1424090482727,\"right\":1424090482689},{\"id\":1424090482689,\"left\":1424090482690,\"right\":1424090482688},{\"id\":1424090482688,\"left\":1424090482689,\"right\":1424090482687},{\"id\":1424090482687,\"left\":1424090482688,\"right\":1424090482686},{\"id\":1424090482686,\"top\":1424090482681,\"left\":1424090482687},{\"id\":1424090482685,\"top\":1424090482682,\"bottom\":1424090482732},{\"id\":1424090482684,\"top\":1424090482683,\"bottom\":1424090482733}],[{\"id\":1424090482709,\"top\":1424090482708,\"right\":1424090482710},{\"id\":1424090482710,\"left\":1424090482709,\"right\":1424090482711},{\"id\":1424090482711,\"left\":1424090482710,\"right\":1424090482712},{\"id\":1424090482712,\"item\":{\"type\":\"potion\"},\"left\":1424090482711},{\"id\":1424090482713,\"top\":1424090482704,\"bottom\":1424090482754,\"right\":1424090482714},{\"id\":1424090482714,\"left\":1424090482713,\"right\":1424090482715},{\"id\":1424090482715,\"top\":1424090482702,\"bottom\":1424090482752,\"left\":1424090482714,\"right\":1424090482716},{\"id\":1424090482716,\"left\":1424090482715,\"right\":1424090482717},{\"id\":1424090482717,\"left\":1424090482716,\"right\":1424090482718},{\"id\":1424090482718,\"bottom\":1424090482749,\"left\":1424090482717,\"right\":1424090482719},{\"id\":1424090482719,\"left\":1424090482718,\"right\":1424090482720},{\"id\":1424090482720,\"top\":1424090482697,\"left\":1424090482719,\"right\":1424090482721},{\"id\":1424090482721,\"left\":1424090482720,\"right\":1424090482722},{\"id\":1424090482722,\"left\":1424090482721,\"right\":1424090482723},{\"id\":1424090482723,\"bottom\":1424090482744,\"left\":1424090482722,\"right\":1424090482724},{\"id\":1424090482724,\"left\":1424090482723,\"right\":1424090482725},{\"id\":1424090482725,\"left\":1424090482724},{\"id\":1424090482726,\"top\":1424090482691,\"bottom\":1424090482741},{\"id\":1424090482727,\"top\":1424090482690,\"bottom\":1424090482740},{\"id\":1424090482728,\"bottom\":1424090482739,\"right\":1424090482729},{\"id\":1424090482729,\"left\":1424090482728,\"right\":1424090482730},{\"id\":1424090482730,\"left\":1424090482729,\"right\":1424090482731},{\"id\":1424090482731,\"left\":1424090482730,\"right\":1424090482732},{\"id\":1424090482732,\"top\":1424090482685,\"left\":1424090482731},{\"id\":1424090482733,\"top\":1424090482684,\"bottom\":1424090482734}],[{\"id\":1424090482758,\"bottom\":1424090482759,\"right\":1424090482757},{\"id\":1424090482757,\"left\":1424090482758,\"right\":1424090482756},{\"id\":1424090482756,\"left\":1424090482757,\"right\":1424090482755},{\"id\":1424090482755,\"left\":1424090482756,\"right\":1424090482754},{\"id\":1424090482754,\"top\":1424090482713,\"left\":1424090482755,\"right\":1424090482753},{\"id\":1424090482753,\"left\":1424090482754,\"right\":1424090482752},{\"id\":1424090482752,\"top\":1424090482715,\"left\":1424090482753},{\"id\":1424090482751,\"bottom\":1424090482766,\"right\":1424090482750},{\"id\":1424090482750,\"bottom\":1424090482767,\"left\":1424090482751},{\"id\":1424090482749,\"top\":1424090482718,\"right\":1424090482748},{\"id\":1424090482748,\"left\":1424090482749,\"right\":1424090482747},{\"id\":1424090482747,\"left\":1424090482748,\"right\":1424090482746},{\"id\":1424090482746,\"left\":1424090482747,\"right\":1424090482745},{\"id\":1424090482745,\"bottom\":1424090482772,\"left\":1424090482746},{\"id\":1424090482744,\"top\":1424090482723,\"right\":1424090482743},{\"id\":1424090482743,\"left\":1424090482744,\"right\":1424090482742},{\"id\":1424090482742,\"bottom\":1424090482775,\"left\":1424090482743},{\"id\":1424090482741,\"item\":{\"type\":\"trap\"},\"top\":1424090482726,\"right\":1424090482740},{\"id\":1424090482740,\"top\":1424090482727,\"left\":1424090482741},{\"id\":1424090482739,\"top\":1424090482728,\"bottom\":1424090482778,\"right\":1424090482738},{\"id\":1424090482738,\"left\":1424090482739,\"right\":1424090482737},{\"id\":1424090482737,\"left\":1424090482738,\"right\":1424090482736},{\"id\":1424090482736,\"left\":1424090482737,\"right\":1424090482735},{\"id\":1424090482735,\"left\":1424090482736,\"right\":1424090482734},{\"id\":1424090482734,\"top\":1424090482733,\"left\":1424090482735}],[{\"id\":1424090482759,\"top\":1424090482758,\"right\":1424090482760},{\"id\":1424090482760,\"left\":1424090482759,\"right\":1424090482761},{\"id\":1424090482761,\"left\":1424090482760,\"right\":1424090482762},{\"id\":1424090482762,\"left\":1424090482761,\"right\":1424090482763},{\"id\":1424090482763,\"left\":1424090482762,\"right\":1424090482764},{\"id\":1424090482764,\"left\":1424090482763,\"right\":1424090482765},{\"id\":1424090482765,\"left\":1424090482764,\"right\":1424090482766},{\"id\":1424090482766,\"top\":1424090482751,\"left\":1424090482765},{\"id\":1424090482767,\"top\":1424090482750,\"bottom\":1424090482800,\"right\":1424090482768},{\"id\":1424090482768,\"left\":1424090482767,\"right\":1424090482769},{\"id\":1424090482769,\"left\":1424090482768,\"right\":1424090482770},{\"id\":1424090482770,\"left\":1424090482769,\"right\":1424090482771},{\"id\":1424090482771,\"bottom\":1424090482796,\"left\":1424090482770},{\"id\":1424090482772,\"top\":1424090482745,\"right\":1424090482773},{\"id\":1424090482773,\"left\":1424090482772,\"right\":1424090482774},{\"id\":1424090482774,\"bottom\":1424090482793,\"left\":1424090482773},{\"id\":1424090482775,\"top\":1424090482742,\"right\":1424090482776},{\"id\":1424090482776,\"left\":1424090482775,\"right\":1424090482777},{\"id\":1424090482777,\"bottom\":1424090482790,\"left\":1424090482776,\"right\":1424090482778},{\"id\":1424090482778,\"top\":1424090482739,\"left\":1424090482777},{\"id\":1424090482779,\"bottom\":1424090482788,\"right\":1424090482780},{\"id\":1424090482780,\"bottom\":1424090482787,\"left\":1424090482779,\"right\":1424090482781},{\"id\":1424090482781,\"left\":1424090482780},{\"id\":1424090482782,\"bottom\":1424090482785,\"right\":1424090482783},{\"id\":1424090482783,\"bottom\":1424090482784,\"left\":1424090482782}],[{\"id\":1424090482808,\"bottom\":1424090482809,\"right\":1424090482807},{\"id\":1424090482807,\"left\":1424090482808,\"right\":1424090482806},{\"id\":1424090482806,\"left\":1424090482807,\"right\":1424090482805},{\"id\":1424090482805,\"left\":1424090482806,\"right\":1424090482804},{\"id\":1424090482804,\"left\":1424090482805,\"right\":1424090482803},{\"id\":1424090482803,\"left\":1424090482804,\"right\":1424090482802},{\"id\":1424090482802,\"left\":1424090482803,\"right\":1424090482801},{\"id\":1424090482801,\"left\":1424090482802,\"right\":1424090482800},{\"id\":1424090482800,\"top\":1424090482767,\"left\":1424090482801},{\"id\":1424090482799,\"bottom\":1424090482818,\"right\":1424090482798},{\"id\":1424090482798,\"left\":1424090482799,\"right\":1424090482797},{\"id\":1424090482797,\"bottom\":1424090482820,\"left\":1424090482798},{\"id\":1424090482796,\"top\":1424090482771,\"right\":1424090482795},{\"id\":1424090482795,\"left\":1424090482796,\"right\":1424090482794},{\"id\":1424090482794,\"bottom\":1424090482823,\"left\":1424090482795},{\"id\":1424090482793,\"top\":1424090482774,\"right\":1424090482792},{\"id\":1424090482792,\"left\":1424090482793,\"right\":1424090482791},{\"id\":1424090482791,\"bottom\":1424090482826,\"left\":1424090482792},{\"id\":1424090482790,\"top\":1424090482777,\"right\":1424090482789},{\"id\":1424090482789,\"left\":1424090482790,\"right\":1424090482788},{\"id\":1424090482788,\"top\":1424090482779,\"left\":1424090482789},{\"id\":1424090482787,\"top\":1424090482780,\"right\":1424090482786},{\"id\":1424090482786,\"left\":1424090482787,\"right\":1424090482785},{\"id\":1424090482785,\"top\":1424090482782,\"left\":1424090482786},{\"id\":1424090482784,\"top\":1424090482783,\"bottom\":1424090482833}],[{\"id\":1424090482809,\"top\":1424090482808,\"right\":1424090482810},{\"id\":1424090482810,\"left\":1424090482809,\"right\":1424090482811},{\"id\":1424090482811,\"left\":1424090482810,\"right\":1424090482812},{\"id\":1424090482812,\"left\":1424090482811,\"right\":1424090482813},{\"id\":1424090482813,\"left\":1424090482812,\"right\":1424090482814},{\"id\":1424090482814,\"left\":1424090482813,\"right\":1424090482815},{\"id\":1424090482815,\"left\":1424090482814,\"right\":1424090482816},{\"id\":1424090482816,\"left\":1424090482815,\"right\":1424090482817},{\"id\":1424090482817,\"left\":1424090482816,\"right\":1424090482818},{\"id\":1424090482818,\"top\":1424090482799,\"left\":1424090482817},{\"id\":1424090482819},{\"id\":1424090482820,\"top\":1424090482797,\"right\":1424090482821},{\"id\":1424090482821,\"left\":1424090482820,\"right\":1424090482822},{\"id\":1424090482822,\"left\":1424090482821,\"right\":1424090482823},{\"id\":1424090482823,\"top\":1424090482794,\"left\":1424090482822,\"right\":1424090482824},{\"id\":1424090482824,\"left\":1424090482823,\"right\":1424090482825},{\"id\":1424090482825,\"left\":1424090482824,\"right\":1424090482826},{\"id\":1424090482826,\"top\":1424090482791,\"left\":1424090482825,\"right\":1424090482827},{\"id\":1424090482827,\"left\":1424090482826,\"right\":1424090482828},{\"id\":1424090482828,\"left\":1424090482827,\"right\":1424090482829},{\"id\":1424090482829,\"left\":1424090482828,\"right\":1424090482830},{\"id\":1424090482830,\"left\":1424090482829,\"right\":1424090482831},{\"id\":1424090482831,\"left\":1424090482830,\"right\":1424090482832},{\"id\":1424090482832,\"left\":1424090482831,\"right\":1424090482833},{\"id\":1424090482833,\"top\":1424090482784,\"left\":1424090482832}]],\"iaList\":[]}";
com_tamina_cow4_model_GameConstants.GAME_MAX_NUM_TURN = 200;
com_tamina_cow4_model_GameConstants.TIMEOUT_DURATION = 2000;
com_tamina_cow4_model_GameConstants.INVISIBILITY_DURATION = 42;
com_tamina_cow4_model_GameConstants.TRAPED_DURATION = 10;
com_tamina_cow4_model_GameConstants.MAX_PM = 5;
com_tamina_cow4_model_GameConstants.PARFUM_PM_BOOST = 10;
com_tamina_cow4_net_request_PlayRequestParam.IA1 = "ia1";
com_tamina_cow4_net_request_PlayRequestParam.IA2 = "ia2";
com_tamina_cow4_net_request_PlayRequestParam.GAME_ID = "gameId";
com_tamina_cow4_routes_Routes.IAList = "IAList";
com_tamina_cow4_routes_Routes.Play = "Play";
com_tamina_cow4_routes_Routes.SOCKET_TEST = "SOCKET/TEST";
com_tamina_cow4_socket_SheepIA.IA_NAME = "SheepIA";
com_tamina_cow4_socket_message_SocketMessage.END_CHAR = "#end#";
com_tamina_cow4_socket_message_Authenticate.MESSAGE_TYPE = "authenticate";
com_tamina_cow4_socket_message_Error.MESSAGE_TYPE = "error";
com_tamina_cow4_socket_message_GetTurnOrder.MESSAGE_TYPE = "getTurnOrder";
com_tamina_cow4_socket_message_ID.MESSAGE_TYPE = "id";
com_tamina_cow4_socket_message_Render.MESSAGE_TYPE = "render";
com_tamina_cow4_socket_message_StartBattle.MESSAGE_TYPE = "startbattle";
com_tamina_cow4_socket_message_TurnResult.MESSAGE_TYPE = "turnResult";
com_tamina_cow4_socket_message_UpdateRender.MESSAGE_TYPE = "updateRender";
haxe_io_FPHelper.i64tmp = (function($this) {
	var $r;
	var x = new haxe__$Int64__$_$_$Int64(0,0);
	$r = x;
	return $r;
}(this));
js_Boot.__toStr = {}.toString;
js_html_compat_Uint8Array.BYTES_PER_ELEMENT = 1;
nodejs_ChildProcessEventType.Disconnect = "disconnect";
nodejs_ChildProcessEventType.Error = "error";
nodejs_ChildProcessEventType.Close = "close";
nodejs_ChildProcessEventType.Message = "message";
nodejs_ChildProcessEventType.Exit = "exit";
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
nodejs_ws_WebSocketEventType.Error = "error";
nodejs_ws_WebSocketEventType.Close = "close";
nodejs_ws_WebSocketEventType.Open = "open";
nodejs_ws_WebSocketEventType.Message = "message";
nodejs_ws_WebSocketEventType.Ping = "ping";
nodejs_ws_WebSocketEventType.Pong = "pong";
nodejs_ws_WebSocketReadyState.Connecting = "CONNECTING";
nodejs_ws_WebSocketReadyState.Open = "OPEN";
nodejs_ws_WebSocketReadyState.Closing = "CLOSING";
nodejs_ws_WebSocketReadyState.Closed = "CLOSED";
nodejs_ws_WebSocketServerEventType.Error = "error";
nodejs_ws_WebSocketServerEventType.Headers = "headers";
nodejs_ws_WebSocketServerEventType.Connection = "connection";
org_tamina_utils_UID._lastUID = 0;
com_tamina_cow4_Server.main();
})(typeof console != "undefined" ? console : {log:function(){}});
