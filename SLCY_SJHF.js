/*:
 @plugindesc 升级恢复 版本1.00
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
 */

	var Imported = Imported || {};
	Imported.SLCY_SJHF = true;
	var SLCY = SLCY || {};
	SLCY.SJHF = SLCY.SJHF || {};
	SLCY.SJHF.version = 1.00;

(function(){
	//参数设置
	SLCY.parameters = PluginManager.parameters('SLCY_SJHF');//代入参数的命名,与文件名一致。
	SLCY.SJHF_LevelUpRecoverValues = JSON.parse(SLCY.parameters['LevelUpRecoverValues']);

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
