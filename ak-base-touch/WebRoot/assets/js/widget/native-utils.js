define(["jquery"], function($){
	return {
		// 是否空
		isEmpty:function(v){
			return !v || v == undefined || v == 'undefined' || $.trim(v) == '';
		},

		// 是否非空
		isNotEmpty:function(v){
			return !this.isEmpty(v);
		},

		// 是否安卓浏览器
		isAndroid:function(){
			var agent = navigator.userAgent.toLowerCase();
			return agent.indexOf("android") != -1 || agent.indexOf("linux") != -1;
		},

		// 是否苹果浏览器
		isIOS:function(){
			var agent = navigator.userAgent.toLowerCase();
			return agent.indexOf("mac") != -1 || agent.indexOf("iphone") != -1 || agent.indexOf("ipad") != -1 || agent.indexOf("safari") != -1;
		},

		// 打开手机原生拨号界面
		// native-event="nativeTel" data-native="{'tel':'{{phone}}'}"
		nativeTel:function(object){
			var tel = object.tel;
			if(this.isNotEmpty(tel)){
				if(this.isAndroid()){
					Android.nativeTel(tel);
				}
				if(this.isIOS()){
				}
			}
		},

		// 打开手机原生浏览器，调用地图定位到指定的地址，city城市，addr地址，二个参数都不能为空
		// native-event="nativeMapByAddr" data-native="{'city':'{{city}}','addr':'{{address}}'}"
		nativeMapByAddr:function(object){
			var addr = object.addr;
			var city = object.city;
			if(this.isNotEmpty(addr) && this.isNotEmpty(city)){
				if(this.isAndroid()){
					Android.nativeMapByAddr(city, addr);
				}
				if(this.isIOS()){
				}
			}
		},

		// 打开手机原生聊天界面, flag为1单聊，2群聊
		// native-event="nativeChat" data-native="{'toId':{{wegoQunId}},'flag':2}"
		nativeChat:function(object){
			var flag = object.flag;
			var toId = object.toId;
			if(this.isNotEmpty(flag) && this.isNotEmpty(toId)){
				if(this.isAndroid()){
					Android.nativeChat(flag, toId);
				}
				if(this.isIOS()){
					var params = "{\"toId\":\"" + toId + "\", \"flag\":\"" + flag + "\"}";
					document.location.href += "protocal(JS-Native)://" + "openGroupChatView" + "?" + params;
				}
			}
		},

		// 打开二维码扫描，扫描成功后，回调callback指定的js方法，传入扫描结果作为参数
		// native-event="nativeQrCode" data-native="{'callback':'onQrScanComplete'}"
		nativeQrCode:function(object){
			var callback = object.callback;
			if(this.isNotEmpty(callback)){
				if(this.isAndroid()){
					Android.nativeQrCode(callback);
				}
				if(this.isIOS()){

				}
			}
		},

		// 让用户选择图片，可从相册或拍照选取，选取成功后，回调callback指定的js方法，传入拍照图片路径作为参数
		// 可选参数：mosaics为1表明拍照完后，该相片需要马赛克处理，默认为不处理
		// 可选参数：compress为800表明拍照完后，等比例压缩该图片到最大边800像素，默认为不压缩，现在手机相机像素高，建议压缩图片
		// 可选参数：multi为1，可多选，0为单选，用户必需选择从相册选取图片时才可以多选
		// 可选参数：crop为长宽比，可按比例截剪图片，值为截剪后的大小，单选图片才可以截剪
		// mosaics 与 crop不能同时使用
		// native-event="nativeSelectPhoto" data-native="{'callback':'nativeSelectPhoto', 'mosaics':1, 'compress':800, multi:1, crop:'160*90'}"
		nativeSelectPhoto:function(object){
			var callback = object.callback;
			if(this.isNotEmpty(callback)){
				var mosaics = object.mosaics;
				if(this.isEmpty(mosaics)){
					mosaics = 0;
				}
				var compress = object.compress;
				if(this.isEmpty(compress)){
					compress = 0;
				}
				var multi = object.multi;
				if(this.isEmpty(multi)){
					multi = 0;
				}
				var crop = object.crop;
				if(this.isEmpty(crop)){
					crop = 0;
				}
				if(this.isAndroid()){
					Android.nativeSelectPhoto(callback, mosaics, compress, multi, crop);
				}
				if(this.isIOS()){

				}
			}
		},

		// 本地调用GPS定位，可能需要几秒钟才能返回结果
		// native-event="nativeGpsLocation" data-native="{'callback':'onGpsLocationComplete'}"
		nativeGpsLocation:function(callback){
			if(this.isNotEmpty(callback)){
				if(this.isAndroid()){
					Android.nativeGpsLocation(callback);
				}
				if(this.isIOS()){

				}
			}
		},

		// 本地调用选择日历与时间
		// 参数：type 类型，date 只选日期，datetime 日期与时间，time只选时间
		// native-event="nativeSelectDateTime" data-native="{'callback':'onSelectDateTimeComplete', 'type':'date'}"
		nativeSelectDateTime:function(object){
			var callback = object.callback;
			var type = object.type;
			if(this.isNotEmpty(callback) && this.isNotEmpty(type)){
				if(this.isAndroid()){
					Android.nativeSelectDateTime(callback, type);
				}
				if(this.isIOS()){

				}
			}
		},

		/**
		 * 初始化所有本地事件
		 */
		initNativeEvent:function(){
			var _self = this;
			$("*[native-event]").unbind('click').bind('click', function(){
				var event = $(this).attr('native-event');
				var param = $(this).data('native');
				if(typeof (param) == 'string'){
					param = eval("(" + param + ")");
				}
				_self[event](param);
			})
		}
	}

});