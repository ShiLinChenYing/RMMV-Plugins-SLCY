/*:
 @plugindesc 升级恢复 版本1.02
 @author 石林尘影
 
 @param LevelUpRecoverValues
 @text 恢复值
 @desc 升级时恢复的生命值和魔法值。
 @type select
 @option 全部
 @value -1
 @option 新增
 @value -2
 @default -1

 @help
 这个插件用来设置升级时恢复的生命值和魔法值。
 选择全部（值为-1）时，升级时恢复全部生命值和魔法值。
 选择新增（值为-2）时，升级时恢复升级后增加的生命值和魔法值。
 自定义文本参数，升级时会恢复自定义的数值。
 自定义数值可以是负数，但若设为-1或-2，则与相应选项设定相同。
 插件使用mit协议，没有特别的限制。

 插件指令:
 setLevelUpRecoverValues -1       	升级时恢复全部值
 setLevelUpRecoverValues -2       	升级时恢复升级后增加的值
 setLevelUpRecoverValues 其它  		升级时会恢复自定义的值
 “其它”是一个表达式，可以使用公式判断与运算，
 例子: setLevelUpRecoverValues if(this._mapId==1){10}else{0}
 setLevelUpRecoverValues Game_Actor=$gameActors.actor(1); Game_Actor._level>=50?Game_Actor._level*2:0

 参考数据：
 Game_Interpreter: this._mapId,this._eventId等。
 Game_Actor: _level,_exp,_hp,_mp,_actorId,_name,_nickname,_faceName,_classId,_damagePopup,_equips等。
 */

	var Imported = Imported || {};
	Imported.SLCY_SJHF = true;
	var SLCY = SLCY || {};
	SLCY.SJHF = SLCY.SJHF || {};
	SLCY.SJHF.version = 1.02;

(function(){
	//参数设置
	SLCY.parameters = PluginManager.parameters('SLCY_SJHF');//代入参数的命名,与文件名一致。
	SLCY.SJHF_LevelUpRecoverValues = Number(SLCY.parameters['LevelUpRecoverValues']);

	//插件指令
	SLCY.SJHF.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		SLCY.SJHF.Game_Interpreter_pluginCommand.call(this, command, args);
		if(command === 'setLevelUpRecoverValues'){SLCY.SJHF_LevelUpRecoverValues = this.argsCalculate(args)};
	};

	Game_Interpreter.prototype.argsCalculate = function(args){
		var str = '';
		var length = args.length;
		for (var i = 0; i < length; ++i) {
			str += args[i] + ' ';
		}
		var argsString = str.trim(); 
		var result = eval(argsString);
		return Number(result);
	};

	//升级恢复
	SLCY.SJHF.Game_Actor_prototype_levelUp = Game_Actor.prototype.levelUp;
	Game_Actor.prototype.levelUp = function() {
		SLCY.SJHF.Game_Actor_prototype_levelUp.call(this);
		if(SLCY.SJHF_LevelUpRecoverValues === -1){
			this._hp = this.mhp;
			this._mp = this.mmp;
		}else if(SLCY.SJHF_LevelUpRecoverValues === -2){
			this._level--;
			var preMaxhp = this.mhp;
			var preMaxmp = this.mmp;
			this._level++;
			this._hp += this.mhp - preMaxhp;
			this._mp += this.mmp - preMaxmp;
		}else{
			this._hp += SLCY.SJHF_LevelUpRecoverValues;
			this._mp += SLCY.SJHF_LevelUpRecoverValues;
		};
	};
})();
