

define(["jquery", "handlebars"], function($, handlebars){
	
	
	return {
		
		/**
		 * 缓存
		 */
		mcache : {
			
		    'mcache_data_v_1_0' : {version : 1.0},
			
			put : function(key, value){
				if(!this['mcache_data_v_1_0'] || ''){
					this['mcache_data_v_1_0'] = {};
				}
				this['mcache_data_v_1_0'][key] = value;
			},
			
			get : function(key){
				return this['mcache_data_v_1_0'][key];
			},
			
			remove : function(key){
				this['mcache_data_v_1_0'][key] = null;
				delete this['mcache_data_v_1_0'][key];
			},
			
			size : function(){
				var size = 0;
				for(var f in this['mcache_data_v_1_0']){
					size++;
				}
				return size;
			},
			
			clear : function(){
				this['mcache_data_v_1_0'] = {};
			}
		},
		
		/**
		 * @param   config.data       {Object}   模板数据
		 * @param   config.path       {String}   模板路径
		 * @param   config.helpers    {Array[{name:String, fun : function}]} 注册模板渲染处理函数
		 * @return html
		 */
		template : function(config){
			
			/**
			 * 加载 handlerbars helper
			 */
			if(config.heplers != undefined && config.heplers != null){
				for(var i=0; i < config.heplers.length; i++){
					handlebars.registerHelper(config.heplers[i].name, config.heplers[i].fun);
				}
			}
			
			/**
			 * 从缓存获取模板
			 */
			var tplContext = this.mcache.get(config.path);
			
			/**
			 * 没有模板，则请求服务端
			 */
			if(!tplContext){
				tplContext = this.load(config.path).get(0).innerHTML;
				this.mcache.put(config.path, tplContext);
			}
			
			var tplHtml = handlebars.compile(tplContext);
			return tplHtml(config.data);
		},
 
		load : function(url, params){
			var rnd = this.random();
			url+="?rnd="+rnd;
			this.ajaxSyncOn();
			var context = $("<div>",{});
			$(context).load(url, params);
			this.ajaxSyncOff();
			return context;
		},
		
		post : function(url, params, callback){
			$.post(url,params,callback);
		},
		
		get : function(url, params, callback){
			var rnd = this.random();
			url+="?rnd="+rnd;
			$.get(url,params,callback);
		},
		
		random : function(){
			return Math.random();
		},
		
		ajaxSyncOn : function(){
			$.ajaxSetup({async: false});
		},
		
		ajaxSyncOff : function(){
			$.ajaxSetup({async: true});
		}
	}
	
});