/*:
 @plugindesc 战斗加速 版本1.06
 @author 石林尘影

 @param DefaultMode
 @text 默认
 @desc true - 开启，false - 关闭
 @type boolean
 @on 开启
 @off 关闭
 @default true
 
 @param Speed
 @text 速度
 @desc 用1~4设置。1是默认值，4是最快。设置为3时，不显示动画。
 @default 4

 @param Key
 @text 按键
 @desc 开启或者关闭加速的按键。
 @default shift

 @param OkSound
 @text 确定
 @desc 确定音效。
 @type file 
 @require 1
 @dir audio/se
 @default Electrocardiogram

 @param CancelSound
 @text 取消
 @desc 取消音效。
 @type file
 @require 1
 @dir audio/se
 @default Transceiver

 @help
 这个插件用于调节默认的战斗速度。
 在战斗中按下自己设置的按钮开启或关闭加速。
 听到设置的开启或关闭音效时，加速就会被开启或关闭。
 开启时，会发出一声确定的音效。
 关闭时，会发出一声取消的音效。
 插件使用mit协议，没有特别的限制。
 */

	var Imported = Imported || {};
	Imported.SLCY_ZDJS = true;
	var SLCY = SLCY || {};
	SLCY.ZDJS = SLCY.ZDJS || {};
	SLCY.ZDJS.version = 1.06;

(function(){
	//参数设置
	SLCY.parameters = PluginManager.parameters('SLCY_ZDJS');//代入参数的命名,与文件名一致。
	SLCY.ZDJS_DefaultMode = JSON.parse(SLCY.parameters['DefaultMode'] || true);
	SLCY.ZDJS_Speed = Number(SLCY.parameters['Speed'] || 4);
	SLCY.ZDJS_Key = String(SLCY.parameters['Key'] || 'shift');
	SLCY.ZDJS_OkSound = String(SLCY.parameters['OkSound'] || 'Electrocardiogram');
	SLCY.ZDJS_CancelSound = String(SLCY.parameters['CancelSound'] || 'Transceiver');

	//默认开关
	SLCY.ZDJS.BattleManager_initMembers = BattleManager.initMembers;
	BattleManager.initMembers = function() {
		if(this._speedUp == !SLCY.ZDJS_DefaultMode){
			this._speedUp = !SLCY.ZDJS_DefaultMode;
		}else{
			this._speedUp = SLCY.ZDJS_DefaultMode;
		};
		SLCY.ZDJS.BattleManager_initMembers.call(this);
	};

	//按键响应
	BattleManager.updateSpeedUp = function() {
		if (Input.isTriggered(SLCY.ZDJS_Key)) {
			AudioManager.playSe({"name":this._speedUp?SLCY.ZDJS_CancelSound:SLCY.ZDJS_OkSound,"volume":100,"pitch":90,"pan":0})
			this._speedUp = !this._speedUp;
   		};
	};
	BattleManager.isSpeedUp = function() {
   		return this._speedUp;
	};
	
	SLCY.ZDJS.Scene_Battle_update = Scene_Battle.prototype.update;
	Scene_Battle.prototype.update = function() {
		BattleManager.updateSpeedUp();
		SLCY.ZDJS.Scene_Battle_update.call(this);
	};

	//日志加速
	SLCY.ZDJS.messageSpeed = Window_BattleLog.prototype.messageSpeed;
	Window_BattleLog.prototype.messageSpeed = function() {
		if (BattleManager.isSpeedUp()){
			return SLCY.ZDJS.messageSpeed.call(this) / SLCY.ZDJS_Speed;
		}else{
			return SLCY.ZDJS.messageSpeed.call(this);
		};
	};
	//动画加速
	SLCY.ZDJS.Animation_setupRate = Sprite_Animation.prototype.setupRate;
	Sprite_Animation.prototype.setupRate = function() {
		if (BattleManager.isSpeedUp()){
			this._rate = 4 / SLCY.ZDJS_Speed;
		}else{
			SLCY.ZDJS.Animation_setupRate.call(this);
		};
	};
	//战斗者加速（横板）
	SLCY.ZDJS.startMove = Sprite_Battler.prototype.startMove;
	Sprite_Battler.prototype.startMove = function(x, y, duration) {
		if (BattleManager.isSpeedUp()){
    			duration /= SLCY.ZDJS_Speed;
    		}else{
    			SLCY.ZDJS.startMove.call(this,x,y,duration);
    		};
	};
})();
