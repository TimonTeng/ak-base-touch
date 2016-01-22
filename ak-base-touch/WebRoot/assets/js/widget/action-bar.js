/**
 * Action Bar Class
 * @Require: jQuery
 * @Extend:
 */
!(function(root, factory) {
	'use strict'
  
	if ('function' === typeof define) {
		
		if (define.amd) {
			define(function(require) {

				var $           = require('jquery'),
				    _           = require('lodash'),
					Backbone    = require('backbone'),
					View        = require('backbone.view'),
					Template    = require('template'),
					AlphabetBar = require('alphabetBar');
				return factory($, _, Backbone, View, Template, AlphabetBar);
			});
		
		} else if (define.cmd) {
			
			define(function(require, exports, module) {
				
				var $         = require('jquery'),
				    _         = require('lodash'),
					Backbone  = require('backbone'),
					View      = require('backbone.view'),
					Template  = require('template'),
				  AlphabetBar = require('alphabetBar');
				
				return factory($, _, Backbone, View, Template, AlphabetBar);
			});
		}
		
	} else {

		root.ActionBar = factory(root.ActionBar);
	}
	
}(this, function($, _, Backbone, View, Template, AlphabetBar) {
	'use strict'
  	
	var ViewAttributes = {
		DataType : {
			'Remote'   : 'remote',
			'Local'    : 'local',
			'Compose'  : 'compose'
		} 
	};
	
	var Model = Backbone.Model.extend({
		idAttribute: 'ActionBar',
		defaults : {
			apiUrl : '',
			actions : [
		         {
					id : '',
					title : '',
					condition : '',
					type : '',
					url : ''
		         }
			]
		}
	});
	 
	
	/**
	 * 一级字母导航选择器
	 */
	var SelectView = function(attr){
		
		this.attr = attr;
		this.root = $("<div>", {'id' : attr.id, 'class' : attr.class});
		this.selectedContext = $("<div>", {'id' : attr.id+'_context'});
		this.selectedContext.appendTo(this.root);
		
		/**
		 * BackBone.View
		 * this.view;
		 */
		/**
		 * ActionBar Item Config
		 * this.config
		 */
		this.config = this.view = this.store = this.displayField = this.result = null;

		var self = this;
		this.clearSelectedContext = function(){
			self.selectedContext.html('');
		}
		this.dataType = ViewAttributes.DataType.Remote;
		
		/**
		 * 设置数据类型
		 */
		this.setDataType = function(dataType){
			if(dataType) {
				this.dataType = dataType;
			}
		}
		
		/**
		 * bind data store typeof is Array
		 */ 
		this.setStore = function(store){
			if(store) {
				self.store = store;
			}
		}
		
		this.setDisplayField = function(displayField){
			if(!displayField){
				throw Error("displayField can't not null");
				return null;
			}
			this.displayField = displayField;
		}
		
		/**
		 * set load data collection in json field
		 */
		this.setResult = function(result){
			
			if(this.DataType == ViewAttributes.DataType.Remote || this.DataType == ViewAttributes.DataType.Compose){
				
				if(!result){
					throw Error("result can't not null");
					return null;
				}
			} 
			this.result = result;
		}
	}
	
	/**
	 * 
	 * @param config
	 * @param view
	 */
	SelectView.prototype.initConfiguration = function(config, view){
		
		var self = this;
		self.config = config;
		self.view = view;
		self.setDataType(config.dataType);
		self.setResult(config.result);
		self.setStore(config.store);
		self.setDisplayField(config.displayField);
	}
	
	SelectView.prototype.displaySetting = function(parentContainer){
		
		var ht = $(parentContainer).height() - this.attr.offset;
		this.root.css({height : ht});
	}
 
	
	/**
	 * 在主列表滑动时触发
	 */
	SelectView.prototype.onSwipe = function(){
		
		var self = this;
		$('li', self.selectedContext).swipe({

           swipeStatus : function(event, phase, direction, distance, duration, fingers) {
        	   
        	   if(phase == 'move'){
        		   var select = $(event.target).data('select');
        		   if(select){
        			   $(event.target).data('select', false);
        			   $(event.target).css('backgroupColor', '#fff');
        		   }
        	   }
           },
           
           threshold: 0,
           
           maxTimeThreshold: 1000*60,
           
           fingers:$.fn.swipe.fingers.ALL
       });
	}
	
	
	/**
	 * 清空选择
	 */
	SelectView.prototype.clearSelect = function(){
		
  	    $(".warp_context li", this.selectedContext).css('backgroundColor', '#fff');
  	    $(".warp_context li", this.selectedContext).data('select', false);
    }

	
	/**
	 * 容器渲染至父元素之后执行
	 */
	SelectView.prototype.renderAfter = function(){
		
		  var self = this;
	      this.rootIScroll = new IScroll('#'+this.attr.id, {
		      scrollbars: true,
		      mouseWheel: true,
		      interactiveScrollbars: true,
		      shrinkScrollbars: 'scale',
		      fadeScrollbars: true
	      });
	      this.view.iscrolls.push(this.rootIScroll);

	      $.each($('.warp_context li',this.selectContext), function(){
	    	  
	    	  /**
	    	   * 选中参数处理过程
	    	   */
	    	  $(this).unbind('touchstart').bind('touchstart' , function(e){
	    		  
	    		  self.clearSelect();
	    		  $(e.target).css('backgroundColor', '#ececec');
	    		  var select = $(e.target).data('select');
	    		  if(!select){
	    			  $(e.target).data('select', true);
	    			  $(e.target).css('backgroundColor', '#ececec');
	    		  }else{
	    			  $(e.target).data('select', false);
	    		  }
	    		 
	    	  });
	    	  
	    	  $(this).unbind('touchend').bind('touchend' , function(e){
	    		  
	    		  if($(e.target).data('select') == true){
	    			  self.data = $(e.target).data('object');
	    		  }else{
	    			  $(e.target).css('backgroundColor', '#fff');
	    		  }
	    	  });
 
	      });
	      
	      this.onSwipe();
	}
	
	/**
	 * 加载远程数据
	 */
	SelectView.prototype.loadRemoteData = function(){
		
		var self   = this;
		var apiUrl = self.config.url;
		$.getJSON(apiUrl+'?ver='+new Date(), null, function(data) {
			
			var store = data[self.result];
			if(!store){
				return;
			}
			
			var wrap   = $("<div>",{ 'id' : 'warp_root', 'class' : 'warp_mark'});
			var wrapUl = $("<ul>",{ 'id' : 'warp_ul_root', 'class' : 'warp_context'});
			wrapUl.appendTo(wrap);
	        for (var i = 0; i < store.length; i++) {
	        	var storeElement = store[i];
	        	storeElement.dataType = self.dataType;
				var node = $("<li>", {'data-object' : JSON.stringify(storeElement), 'data-select' : false});
				node.text(storeElement[self.displayField]);
				node.appendTo(wrapUl);
			}
			wrap.appendTo(self.selectedContext);
	        self.renderAfter();
		}).error(function() {
			console.log('Ajax Request Error!');
		});
	}
	
	/**
	 * 加载本地数据
	 */
	SelectView.prototype.loadLocalData = function(){
		
		var self = this;
		if(!self.store){
			return;
		}
		
		var wrap   = $("<div>",{ 'id' : 'warp_root', 'class' : 'warp_mark'});
		var wrapUl = $("<ul>",{ 'id' : 'warp_ul_root', 'class' : 'warp_context'});
		wrapUl.appendTo(wrap);
		for (var i = 0; i < self.store.length; i++) {
			var storeElement = self.store[i];
			storeElement.dataType = self.dataType;
			var node = $("<li>", {'data-object' : JSON.stringify(storeElement), 'data-select' : false});
			node.text(storeElement[self.displayField]);
			node.appendTo(wrapUl);
		}
		wrap.appendTo(self.selectedContext);
		self.renderAfter();
	}
	
	/**
	 * 加载混合数据
	 */
	SelectView.prototype.loadComposeData = function(){
		
		var self = this;
		if(!self.store){
			return;
		}
		
		var wrap   = $("<div>",{ 'id' : 'warp_root', 'class' : 'warp_mark'});
		var wrapUl = $("<ul>",{ 'id' : 'warp_ul_root', 'class' : 'warp_context'});
		wrapUl.appendTo(wrap);
		for (var i = 0; i < self.store.length; i++) {
			var storeElement = self.store[i];
			storeElement.dataType = ViewAttributes.DataType.Local;
			var node = $("<li>", {'data-object' : JSON.stringify(storeElement), 'data-select' : false});
			node.text(storeElement[self.displayField]);
			node.appendTo(wrapUl);
		}
		
		var apiUrl = self.config.url;
		$.getJSON(apiUrl+'?ver='+new Date(), null, function(data) {
			var store = data[self.result];
			if(store){
				for (var i = 0; i < store.length; i++) {
					var storeElement = store[i];
					storeElement.dataType = ViewAttributes.DataType.Compose;
					var node = $("<li>", {'data-object' : JSON.stringify(storeElement), 'data-select' : false});
					node.text(storeElement[self.displayField]);
					node.appendTo(wrapUl);
				}
			}
			wrap.appendTo(self.selectedContext);
	        self.renderAfter();
		}).error(function() {
			console.log('Ajax Request Error!');
		});
		
	}
	
	/**
	 * 数据加载
	 */
	SelectView.prototype.onloadData = function(){
		
		var self   = this;
		switch(self.dataType){
			case ViewAttributes.DataType.Remote  : self.loadRemoteData(); break;
			case ViewAttributes.DataType.Local   : self.loadLocalData(); break;
			case ViewAttributes.DataType.Compose : self.loadComposeData(); break;
			default : break;
		}
	}
	
	/**
	 * 二级选择器
	 */
	var DoubleSelectView = function(attr){
		
		this.attr = attr;
		this.root = $("<div>",{ id : 'double-select-view'});
		this.leftSelectView = new SelectView({
			'id' : 'left',
			'class' :  'am-plugin-actionbar-container-l',
			'offset' : attr.offset
		});
		
		this.rightSelectView = new SelectView({
			'id' : 'right',
			'class' :  'am-plugin-actionbar-container-r',
			'offset' : attr.offset
		});
		this.leftSelectView.root.appendTo(this.root);
		this.rightSelectView.root.appendTo(this.root);
		
		/**
		 * BackBone.View
		 */
		this.view = null;
		
		/**
		 * ActionBar Item Config
		 */
		this.config = this.store = this.result = null;

		this.dataType = ViewAttributes.DataType.Remote;

		/**
		 * 设置数据类型
		 */
		this.setDataType = function(dataType){
			if(dataType) {
				this.dataType = dataType;
			}
		}


		/**
		 * bind data store typeof is Array
		 */ 
		this.setStore = function(store){
			if(store) {
				self.store = store;
			}
		}

		
		var self = this;
		this.clearSelectedContext = function(){
			self.leftSelectView.clearSelectedContext();
			self.rightSelectView.clearSelectedContext();
		}

		/**
		 * set load data collection in json field
		 */
		this.setResult = function(result){
			
			if(this.DataType == ViewAttributes.DataType.Remote || this.DataType == ViewAttributes.DataType.Compose){
				
				if(!result){
					throw Error("result can't not null");
					return null;
				}
			} 
			this.result = result;
		}
		
	}

	/**
	 * 
	 * @param config
	 * @param view
	 */
	DoubleSelectView.prototype.initConfiguration = function(config, view){
		
		var self = this;
		self.config = config;
		self.view = view;
		self.url  = config.url;
		self.setDataType(config.dataType);
		self.setResult(config.result);
		self.setStore(config.store);
		
	}
	
	/**
	 * 展示界面
	 * @param parentContainer
	 */
	DoubleSelectView.prototype.displaySetting = function(parentContainer){
		var ht = $(parentContainer).height() - this.attr.offset;
		this.leftSelectView.root.css({height : ht});
		this.rightSelectView.root.css({height : ht});
 
	}
 
	
	/**
	 * 清空选择
	 */
	DoubleSelectView.prototype.clearSelect = function(view){
 
  	    $(".warp_mark li", view.selectedContext).css('backgroundColor', '#fff');
  	    $(".warp_mark li", view.selectedContext).data('select', false);
    }
	
	/**
	 * 容器渲染至父元素之后执行
	 */
	DoubleSelectView.prototype.renderAfter = function(){
		
		var self = this;
		this.rootIScroll = new IScroll('#'+this.leftSelectView.attr.id, {
		      scrollbars: true,
		      mouseWheel: true,
		      interactiveScrollbars: true,
		      shrinkScrollbars: 'scale',
		      fadeScrollbars: true
	    });
		
		this.view.iscrolls.push(this.rootIScroll);
		
	    $.each($('#warp_ul_root li', this.leftSelectView.selectContext), function(){
	    	  
	    	  /**
	    	   * 选中参数处理过程
	    	   */
	    	  $(this).unbind('touchstart').bind('touchstart' , function(e){
	    		  self.clearSelect(self.leftSelectView);
	    		  $(e.target).css('backgroundColor', '#ececec');
	    		  var select = $(e.target).data('select');
	    		  if(!select){
	    			  $(e.target).data('select', true);
	    			  $(e.target).css('backgroundColor', '#ececec');
	    		  }else{
	    			  $(e.target).data('select', false);
	    		  }
	    		 
	    	  });
	    	  
	    	  $(this).unbind('touchend').bind('touchend' , function(e){
	    		  if($(e.target).data('select') == true){
	    			  self.data = $(e.target).data('object');
	    			  self.nodeData = null;
	    			  self.onloadNodeData(self.data.dataType);
	    		  }else{
	    			  $(e.target).css('backgroundColor', '#fff');
	    		  }
	    	  });
 
	    });
	      
	    this.onSwipe();
		
	}
	
	
	DoubleSelectView.prototype.renderNodeAfter = function(){
		
		var self = this;
		this.nodeIScroll = new IScroll('#'+this.rightSelectView.attr.id, {
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true
		});
		
		this.view.iscrolls.push(this.nodeIScroll);
		
	    $.each($('#warp_ul_node li', this.rightSelectView.selectContext), function(){
	    	  
	    	  /**
	    	   * 选中参数处理过程
	    	   */
	    	  $(this).unbind('touchstart').bind('touchstart' , function(e){
	    		  self.clearSelect(self.rightSelectView);
	    		  $(e.target).css('backgroundColor', '#ececec');
	    		  var select = $(e.target).data('select');
	    		  if(!select){
	    			  $(e.target).data('select', true);
	    			  $(e.target).css('backgroundColor', '#ececec');
	    		  }else{
	    			  $(e.target).data('select', false);
	    		  }
	    		 
	    	  });
	    	  
	    	  $(this).unbind('touchend').bind('touchend' , function(e){
	    		  
	    		  if($(e.target).data('select') == true){
	    			  self.nodeData = $(e.target).data('object');
	    		  }else{
	    			  $(e.target).css('backgroundColor', '#fff');
	    		  }
	    	  });

	    });
		
	}
	
	
	
	/**
	 * 在主列表滑动时触发
	 */
	DoubleSelectView.prototype.onSwipe = function(){
		
		var self = this;
		$('li', self.leftSelectView.selectedContext).swipe({

           swipeStatus : function(event, phase, direction, distance, duration, fingers) {
        	   if(phase == 'move'){
        		   var select = $(event.target).data('select');
        		   if(select){
        			   $(event.target).data('select', false);
        			   $(event.target).css('backgroupColor', '#fff');
        		   }
        	   }
           },
           
           threshold: 0,
           
           maxTimeThreshold: 1000*60,
           
           fingers:$.fn.swipe.fingers.ALL
       });
	}
	
	
	/**
	 * 格式化加载子节点数据的url
	 */
	DoubleSelectView.prototype.formatNodeApiUrl = function(){
		var node 	       = this.config.url.node;
		this.nodeUrl 	   = node.apiUrl;
		this.rootPropertys = node.rootPropertys;
		var params = "?"
			
		for(var i = 0; i < node.rootPropertys.length; i++){
			for (var f in node.rootPropertys[i]) {
				params += "&"+f+"={"+f+"}"
			}
		}
		this.nodeUrl+=params;
	}





	DoubleSelectView.prototype.onloadData = function(){
		this.onloadRootData();
	}


	/***********************onload root data*********************/

	DoubleSelectView.prototype.onloadRootData = function(){
		var self   = this;
		switch(self.dataType){
			case ViewAttributes.DataType.Remote  : self.onloadRootRemoteData(); break;
			case ViewAttributes.DataType.Local   : self.onloadRootLocalData(); break;
			case ViewAttributes.DataType.Compose : self.onloadRootComposeData(); break;
			default : break;
		}
	}


	DoubleSelectView.prototype.onloadRootRemoteData = function(){
		
		var self   = this;
		var apiUrl = null;
		
		if(self.url && typeof(self.url) == 'string'){
			apiUrl = self.url;
		}
		
		if(self.url && typeof(self.url) == 'object'){
			apiUrl = self.url.root.apiUrl;
		}
		
		$.getJSON(apiUrl, null, function(data) {
			 
			var store  = data[self.result];
			var wrap   = $("<div>",{ 'id' : 'warp_root', 'class' : 'warp_mark'});
			var wrapUl = $("<ul>",{ 'id' : 'warp_ul_root', 'class' : 'warp_context'});
			wrapUl.appendTo(wrap);
			if(!store){
				wrap.appendTo(self.leftSelectView.selectedContext);
				self.renderAfter();
				return;
			}
			
	        for (var i = 0; i < store.length; i++) {
	        	var object =  store[i];
	        	object['dataType'] = ViewAttributes.DataType.Remote;
				var node = $("<li>", {'data-object' : JSON.stringify(object), 'data-select' : false});
				node.text(object[self.url.root.displayField]);
				node.appendTo(wrapUl);
			}
			wrap.appendTo(self.leftSelectView.selectedContext);
			
			self.formatNodeApiUrl();
			self.renderAfter();
	        
		}).error(function() {
			console.log('Ajax Request Error!');
		});
	}

	DoubleSelectView.prototype.onloadRootLocalData = function(){
		
		var self   = this;
		var wrap   = $("<div>",{ 'id' : 'warp_root', 'class' : 'warp_mark'});
		var wrapUl = $("<ul>",{ 'id' : 'warp_ul_root', 'class' : 'warp_context'});
		wrapUl.appendTo(wrap);

		if(!self.url.root.displayField){
			throw Error("url.root.displayField can't not null");
			return;
		}
		
		if(!self.store){
			throw Error("ListView store can't not null");
			return;
		}
		
        for (var i = 0; i < self.store.length; i++) {
        	var object =  self.store[i];
        	object['dataType'] = ViewAttributes.DataType.Local;
			var node = $("<li>", {'data-object' : JSON.stringify(object), 'data-select' : false});
			node.text(object[self.url.root.displayField]);
			node.appendTo(wrapUl);
		}
		wrap.appendTo(self.leftSelectView.selectedContext);
		self.renderAfter();

	}

	DoubleSelectView.prototype.onloadRootComposeData = function(){
		var self   = this;
		var wrap   = $("<div>",{ 'id' : 'warp_root', 'class' : 'warp_mark'});
		var wrapUl = $("<ul>",{ 'id' : 'warp_ul_root', 'class' : 'warp_context'});
		wrapUl.appendTo(wrap);
		
		if(self.store && self.store.length > 0){
	        for (var i = 0; i < self.store.length; i++) {
	        	var object =  self.store[i];
	        	object['dataType'] = ViewAttributes.DataType.Local;
				var node = $("<li>", {'data-object' : JSON.stringify(object), 'data-select' : false});
				node.text(object[self.url.root.displayField]);
				node.appendTo(wrapUl);
			}
		}
		
		var apiUrl = null;
		
		if(self.url && typeof(self.url) == 'string'){
			apiUrl = self.url;
		}
		
		if(self.url && typeof(self.url) == 'object'){
			apiUrl = self.url.root.apiUrl;
		}
		
		$.getJSON(apiUrl, null, function(data) {
			if(!data || !data[self.result]){
				wrap.appendTo(self.leftSelectView.selectedContext);
				self.renderAfter();
				return;
			}
			
			var store  = data[self.result];
	        for (var i = 0; i < store.length; i++) {
	        	var object =  store[i];
	        	object['dataType'] = ViewAttributes.DataType.Remote;
				var node = $("<li>", {'data-object' : JSON.stringify(object), 'data-select' : false});
				node.text(object[self.url.root.displayField]);
				node.appendTo(wrapUl);
			}
			wrap.appendTo(self.leftSelectView.selectedContext);
			
			self.formatNodeApiUrl();
			self.renderAfter();
	        
		}).error(function() {
			console.log('Ajax Request Error!');
		});
		 

	}


	/***********************onload node data*********************/

	DoubleSelectView.prototype.onloadNodeData = function(dataType){
		var self   = this;
		switch(dataType){
			case ViewAttributes.DataType.Remote  : self.onloadNodeRemoteData(); break;
			case ViewAttributes.DataType.Local   : self.onloadNodeLocalData(); break;
			case ViewAttributes.DataType.Compose : self.onloadNodeComposeData(); break;
			default : break;
		}
	}

	DoubleSelectView.prototype.onloadNodeRemoteData = function(){
		var self   = this;
		self.rightSelectView.selectedContext.html('');
		var apiUrl = this.nodeUrl+'';
		for(var i = 0; i < this.rootPropertys.length; i++){
			for (var f in this.rootPropertys[i]) {
				apiUrl = apiUrl.replace('{'+f+'}', this.data[this.rootPropertys[i][f]]);
			}
		}
		$.getJSON(apiUrl, null, function(data) {
			var store   = data[self.result];
			var wrap    = $("<div>", {'id' : 'warp_node', 'class' : 'warp_mark'});
			var wrapUl  = $("<ul>", {'id' : 'warp_ul_node', 'class' : 'warp_context'});
			var allNode = $("<li>", {'data-object' : 'all', 'data-select' : true});
			allNode.text('全部');
			allNode.css('backgroundColor', '#ececec');
			allNode.appendTo(wrapUl);
			wrapUl.appendTo(wrap);
	        for (var i = 0; i < store.length; i++) {
	        	var object = store[i];
				var node = $("<li>", {'data-object' : JSON.stringify(object), 'data-select' : false});
				node.text(object[self.url.node.displayField]);
				node.appendTo(wrapUl);
			}
	        wrap.appendTo(self.rightSelectView.selectedContext);
	        self.renderNodeAfter();
		}).error(function() {
			console.log('Ajax Request Error!');
		});
		
	}

	DoubleSelectView.prototype.onloadNodeLocalData = function(){
		console.log('DoubleSelectView.prototype.onloadNodeLocalData');
		var self = this;
		self.rightSelectView.selectedContext.html('');
		var rootValue = self.data;
		var nodeStore = rootValue.nodes;
		if(!nodeStore || nodeStore.length == 0){
			return;
		}
		
		var wrap    = $("<div>", {'id' : 'warp_node', 'class' : 'warp_mark'});
		var wrapUl  = $("<ul>", {'id' : 'warp_ul_node', 'class' : 'warp_context'});
		var allNode = $("<li>", {'data-object' : 'all', 'data-select' : true});
		allNode.text('全部');
		allNode.css('backgroundColor', '#ececec');
		allNode.appendTo(wrapUl);
		wrapUl.appendTo(wrap);
		
        for (var i = 0; i < nodeStore.length; i++) {
        	var object = nodeStore[i];
			var node = $("<li>", {'data-object' : JSON.stringify(object), 'data-select' : false});
			node.text(object[self.url.node.displayField]);
			node.appendTo(wrapUl);
		}
        wrap.appendTo(self.rightSelectView.selectedContext);
        self.renderNodeAfter();

	}
	
	
	/**
	 * 一级字母导航选择器
	 */
	var AplhabetSelectView = function(attr){
		
		var selectView = new SelectView(attr);
		this.attr = attr;
		this.root = selectView.root;
		this.selectedContext = selectView.selectedContext;
		
		/**
		 * BackBone.View
		 */
		this.view = null;
		
		/**
		 * ActionBar Item Config
		 */
		this.config = null;
		
		var self = this;
		this.clearSelectedContext = function(){
			self.selectedContext.html('');
		}
		
	}
	
	AplhabetSelectView.prototype.displaySetting = function(parentContainer){
		
		var ht = $(parentContainer).height() - this.attr.offset;
		this.root.css({height : ht});
		var alphabetBarView = this.aplhabetBar.alphabetBarView;
		alphabetBarView.renderTo(parentContainer, ht);
	}
	
	AplhabetSelectView.prototype.setAplhabetBar = function(aplhabetBar){
		this.aplhabetBar = aplhabetBar;
		this.aplhabetBar.alphabetBarView.bindSelectView(this);
	}
	
	/**
	 * 在主列表滑动时触发
	 */
	AplhabetSelectView.prototype.onSwipe = function(){
		
		var self = this;
		$('li', self.selectedContext).swipe({

           swipeStatus : function(event, phase, direction, distance, duration, fingers) {
        	   
        	   if(phase == 'move'){
        		   var select = $(event.target).data('select');
        		   if(select){
        			   $(event.target).data('select', false);
        			   $(event.target).css('backgroupColor', '#fff');
        		   }
        	   }
           },
           
           threshold: 0,
           
           maxTimeThreshold: 1000*60,
           
           fingers:$.fn.swipe.fingers.ALL
       });
	}
	
	
	/**
	 * 清空选择
	 */
	AplhabetSelectView.prototype.clearSelect = function(){
		
  	    $(".warp_context li", this.selectedContext).css('backgroundColor', '#fff');
  	    $(".warp_context li", this.selectedContext).data('select', false);
    }

	
	/**
	 * 容器渲染至父元素之后执行
	 */
	AplhabetSelectView.prototype.renderAfter = function(){
		
		  var self = this;
	      this.rootIScroll = new IScroll('#'+this.attr.id, {
		      scrollbars: true,
		      mouseWheel: true,
		      interactiveScrollbars: true,
		      shrinkScrollbars: 'scale',
		      fadeScrollbars: true
	      });
	      this.view.iscrolls.push(this.rootIScroll);

	      $.each($('.warp_context li',this.selectContext), function(){
	    	  
	    	  /**
	    	   * 选中参数处理过程
	    	   */
	    	  $(this).unbind('touchstart').bind('touchstart' , function(e){
	    		  
	    		  self.clearSelect();
	    		  $(e.target).css('backgroundColor', '#ececec');
	    		  var select = $(e.target).data('select');
	    		  if(!select){
	    			  $(e.target).data('select', true);
	    			  $(e.target).css('backgroundColor', '#ececec');
	    		  }else{
	    			  $(e.target).data('select', false);
	    		  }
	    		 
	    	  });
	    	  
	    	  $(this).unbind('touchend').bind('touchend' , function(e){
	    		  
	    		  if($(e.target).data('select') == true){
	    			  self.data = $(e.target).data('object');
	    		  }else{
	    			  $(e.target).css('backgroundColor', '#fff');
	    		  }
	    	  });
 
	      });
	      
	      this.onSwipe();
	      
	}
	
	/**
	 * 数据加载
	 */
	AplhabetSelectView.prototype.onloadData = function(){
		var self   = this;
		var apiUrl = self.config.url;
		$.getJSON(apiUrl+'?ver='+new Date(), null, function(data) {
			
	        for (var i = 0; i < data.form.length; i++) {
				var wrap = $("<div>",{ 'id' : 'warp_alphabet_'+data.form[i].code, 'class' : 'warp_alphabet_mark'});
				var hd   = $("<div class='warp_alphabet_title'><li><h2>"+data.form[i].code+"</h2></li></div>");
				$(hd).appendTo(wrap);
				var apt = $("<ul>",{ 'id' : 'warp_u_'+data.form[i].code, 'class' : 'warp_context'});
				if(data.form[i].p2pcb){
					for(var n = 0; n < data.form[i].p2pcb.length; n++){
						var node = $("<li>", {'data-object' : JSON.stringify(data.form[i].p2pcb[n]), 'data-select' : false});
						node.text(data.form[i].p2pcb[n].name);
						node.appendTo(apt);
					}
				}
				$(apt).appendTo(wrap);
				$(wrap).appendTo(self.selectedContext);
 
			}
	        
			$.each($('.warp_alphabet_mark'), function(){
				$(this).attr('data-position', parseInt($(this).offset().top));
			});
	        
	        self.renderAfter();
	        
		}).error(function() {
			console.log('Ajax Request Error!');
		});
	}
	
	
	/**
	 * 二级字母导航选择器
	 */
	var AplhabetDoubleSelectView = function(attr){
		
		this.attr = attr;
		this.root = $("<div>",{ id : 'double-select-view'});
		this.leftSelectView = new SelectView({
			'id' : 'left',
			'class' :  'am-plugin-actionbar-container-l',
			'offset' : attr.offset
		});
		
		this.rightSelectView = new SelectView({
			'id' : 'right',
			'class' :  'am-plugin-actionbar-container-r',
			'offset' : attr.offset
		});
		this.leftSelectView.root.appendTo(this.root);
		this.rightSelectView.root.appendTo(this.root);
		
		/**
		 * BackBone.View
		 */
		this.view = null;
		
		/**
		 * ActionBar Item Config
		 */
		this.config = null;
		
		var self = this;
		this.clearSelectedContext = function(){
			self.leftSelectView.clearSelectedContext();
			self.rightSelectView.clearSelectedContext();
		}
		
	}
	
	/**
	 * 展示界面
	 * @param parentContainer
	 */
	AplhabetDoubleSelectView.prototype.displaySetting = function(parentContainer){
		var ht = $(parentContainer).height() - this.attr.offset;
		this.leftSelectView.root.css({height : ht});
		this.rightSelectView.root.css({height : ht});
		var alphabetBarView = this.aplhabetBar.alphabetBarView;
		alphabetBarView.renderTo(parentContainer, ht);
	}
	
	/**
	 * 注入字母导航栏
	 * @param aplhabetBar
	 */
	AplhabetDoubleSelectView.prototype.setAplhabetBar = function(aplhabetBar){
		this.aplhabetBar = aplhabetBar;
		this.aplhabetBar.alphabetBarView.bindSelectView(this);
	}
	
	/**
	 * 清空选择
	 */
	AplhabetDoubleSelectView.prototype.clearSelect = function(view){
		
  	    $(".warp_context li", view.selectedContext).css('backgroundColor', '#fff');
  	    $(".warp_context li", view.selectedContext).data('select', false);
    }
	
	/**
	 * 容器渲染至父元素之后执行
	 */
	AplhabetDoubleSelectView.prototype.renderAfter = function(){
		
		
		var self = this;
		this.rootIScroll = new IScroll('#'+this.leftSelectView.attr.id, {
		      scrollbars: true,
		      mouseWheel: true,
		      interactiveScrollbars: true,
		      shrinkScrollbars: 'scale',
		      fadeScrollbars: true
	    });
		
		this.view.iscrolls.push(this.rootIScroll);
		
	    $.each($('.warp_context li', this.leftSelectView.selectContext), function(){
	    	  
	    	  /**
	    	   * 选中参数处理过程
	    	   */
	    	  $(this).unbind('touchstart').bind('touchstart' , function(e){
	    		  
	    		  self.clearSelect(self.leftSelectView);
	    		  $(e.target).css('backgroundColor', '#ececec');
	    		  var select = $(e.target).data('select');
	    		  if(!select){
	    			  $(e.target).data('select', true);
	    			  $(e.target).css('backgroundColor', '#ececec');
	    		  }else{
	    			  $(e.target).data('select', false);
	    		  }
	    		 
	    	  });
	    	  
	    	  $(this).unbind('touchend').bind('touchend' , function(e){
	    		  
	    		  if($(e.target).data('select') == true){
	    			  self.data = $(e.target).data('object');
	    			  self.nodeData = null;
	    			  self.onloadNodeData();
	    		  }else{
	    			  $(e.target).css('backgroundColor', '#fff');
	    		  }
	    	  });
 
	    });
	      
	    this.onSwipe();
		
	}
	
	
	AplhabetDoubleSelectView.prototype.renderNodeAfter = function(){
		
		var self = this;
		this.nodeIScroll = new IScroll('#'+this.rightSelectView.attr.id, {
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true
		});
		
		this.view.iscrolls.push(this.nodeIScroll);
		
	    $.each($('#warp_alphabet_node li', self.rightSelectView.selectContext), function(){
	    	  
	    	  /**
	    	   * 选中参数处理过程
	    	   */
	    	  $(this).unbind('touchstart').bind('touchstart' , function(e){
	    		  
	    		  self.clearSelect(self.rightSelectView);
	    		  $(e.target).css('backgroundColor', '#ececec');
	    		  var select = $(e.target).data('select');
	    		  if(!select){
	    			  $(e.target).data('select', true);
	    			  $(e.target).css('backgroundColor', '#ececec');
	    		  }else{
	    			  $(e.target).data('select', false);
	    		  }
	    		 
	    	  });
	    	  
	    	  $(this).unbind('touchend').bind('touchend' , function(e){
	    		  
	    		  if($(e.target).data('select') == true){
	    			  self.nodeData = $(e.target).data('object');
	    		  }else{
	    			  $(e.target).css('backgroundColor', '#fff');
	    		  }
	    	  });

	    });
		
	}
	
	
	
	/**
	 * 在主列表滑动时触发
	 */
	AplhabetDoubleSelectView.prototype.onSwipe = function(){
		
		var self = this;
		$('li', self.leftSelectView.selectedContext).swipe({

           swipeStatus : function(event, phase, direction, distance, duration, fingers) {
        	   
        	   if(phase == 'move'){
        		   var select = $(event.target).data('select');
        		   if(select){
        			   $(event.target).data('select', false);
        			   $(event.target).css('backgroupColor', '#fff');
        		   }
        	   }
           },
           
           threshold: 0,
           
           maxTimeThreshold: 1000*60,
           
           fingers:$.fn.swipe.fingers.ALL
       });
	}
	
	
	/**
	 * 格式化加载子节点数据的url
	 */
	AplhabetDoubleSelectView.prototype.formatNodeApiUrl = function(){
		var node 	       = this.config.url.node;
		this.nodeUrl 	   = node.apiUrl;
		this.rootPropertys = node.rootPropertys;
		var params = "?"
			
		for(var i = 0; i < node.rootPropertys.length; i++){
			for (var f in node.rootPropertys[i]) {
				params += "&"+f+"={"+f+"}"
			}
		}
		this.nodeUrl+=params;
	}
	
	/**
	 * 数据加载
	 */
	AplhabetDoubleSelectView.prototype.onloadData = function(){
		
		var self   = this;
		var apiUrl = null;
		
		if(self.config.url && typeof(self.config.url) == 'string'){
			apiUrl = self.config.url;
		}
		
		if(self.config.url && typeof(self.config.url) == 'object'){
			apiUrl = self.config.url.root.apiUrl;
		}
		
		$.getJSON(apiUrl+'?ver='+new Date(), null, function(data) {
			 
	        for (var i = 0; i < data.form.length; i++) {
				var wrap = $("<div>",{ 'id' : 'warp_alphabet_'+data.form[i].code, 'class' : 'warp_alphabet_mark'});
				var hd   = $("<div class='warp_alphabet_title'><li><h2>"+data.form[i].code+"</h2></li></div>");
				$(hd).appendTo(wrap);
				var apt = $("<ul>",{ 'id' : 'warp_u_'+data.form[i].code, 'class' : 'warp_context'});
				if(data.form[i].p2pcb){
					for(var n = 0; n < data.form[i].p2pcb.length; n++){
						var node = $("<li>", {'data-object' : JSON.stringify(data.form[i].p2pcb[n]), 'data-select' : false});
						node.text(data.form[i].p2pcb[n].name);
						node.appendTo(apt);
					}
				}
				$(apt).appendTo(wrap);
				$(wrap).appendTo(self.leftSelectView.selectedContext);
			}
	        
			$.each($('.warp_alphabet_mark'), function(){
				$(this).attr('data-position', parseInt($(this).offset().top));
			});
			
			self.formatNodeApiUrl();
			self.renderAfter();
	        
		}).error(function() {
			console.log('Ajax Request Error!');
		});
	}
	
	/**
	 * 加载节点数据
	 */
	AplhabetDoubleSelectView.prototype.onloadNodeData = function(){
 
		var self   = this;
		var apiUrl = this.nodeUrl+'';
		for(var i = 0; i < this.rootPropertys.length; i++){
			for (var f in this.rootPropertys[i]) {
				apiUrl = apiUrl.replace('{'+f+'}', this.data[this.rootPropertys[i][f]]);
			}
		}
		self.rightSelectView.selectedContext.html('');
		$.getJSON(apiUrl, null, function(data) {
			
			var wrap = $("<div>",{ 'id' : 'warp_alphabet_node', 'class' : 'warp_alphabet_mark'});
			var apt = $("<ul>",{ 'id' : 'warp_u_node', 'class' : 'warp_context'});
			var allNode = $("<li>", {'data-object' : 'all', 'data-select' : true});
			allNode.text('全部');
			allNode.css('backgroundColor', '#ececec');
			allNode.appendTo(apt);
	        for (var i = 0; i < data.form.length; i++) {
				var node = $("<li>", {'data-object' : JSON.stringify(data.form[i]), 'data-select' : false});
				node.text(data.form[i].name);
				node.appendTo(apt);
			}
	        apt.appendTo(wrap);
	        wrap.appendTo(self.rightSelectView.selectedContext);
	        self.renderNodeAfter();
		}).error(function() {
			console.log('Ajax Request Error!');
		});
		
	}
 
	/**
	 * 确认按钮
	 */
	var ConfirmView = function(css){
		this.root = $("<div>",{'class' : 'am-plugin-actionbar-container-b am-vertical-align  am-cf'});
		this.root.css(css);
		this.button = $("<button>", {'type' : 'button', 'id' : 'confirmButton', 'class' : 'am-btn am-btn-danger'});
		this.button.text('确认');
		this.button.appendTo(this.root);
	}
	
	/**
	 * 
	 * @param submitFunction : config function
	 * @param selectView : ui view
	 * @param view : backbone.view
	 */
	ConfirmView.prototype.submit = function(submitFunction, selectView, view){
		$(this.button).unbind('click').bind('click', function(e){
			var data = {rootValue : selectView.data, nodeValue : selectView.nodeData};
			submitFunction(data);
			view.destroyAction();
		});
	}
	
	/**
	 * 
	 */
	function ActionBarView(){
		this.view = null;
	}
	
	/**
	 * 初始化配置
	 * @param view
	 */
	ActionBarView.prototype.initConfiguration = function(view){
		
	}
	
	/**
	 * 激活设置 true or false
	 * @param activate
	 */
	ActionBarView.prototype.onActivate = function(activate){
		
		
	}
 
	
	return View.extend({
		
		id: 'ActionBarView',
		
		model: new Model,
		
		attrs: {
			template: 'assets/template/widget/action-bar.tpl?ver='+  new Date().getTime()
		},
		
		events: {
			'touchend [action-selectview-event]' : 'onSelectView',
			'touchend [action-button-event]'     : 'onButton'
		},
		
		actionNodes : {
 
		},
		
		setup: function() {
			
			var self = this;
			
			var parentNode = self.getAttr('parentNode'),
			    type       = self.getAttr('type'),
				data       = self.getAttr('data');
			
			var actions = self.getAttr('actions');
			
			for(var i = 0; i < actions.length; i++){
				switch(actions[i].type){
					case 'SelectView'       		: self.selectView(actions[i]); break;
					case 'DoubleSelectView' 		: self.doubleSelectView(actions[i]); break;
					case 'AplhabetSelectView'       : self.aplhabetSelectView(actions[i]); break;
					case 'AplhabetDoubleSelectView'	: self.aplhabetDoubleSelectView(actions[i]); break;
					case 'Button'             	    : self.actionButton(actions[i]); break;
					default : break;
				}
			}
			
			self.parentNodePosition = {
					width :  $(parentNode).width(),
					height : $(parentNode).height(),
					top :    $(parentNode).offset().top,
					left :   $(parentNode).offset().left,
					right :  $(parentNode).offset().right,
					bottom : $(parentNode).offset().bottom,
					screen : {
						width : window.screen.width,
						height : window.screen.height
					}
			};
			
			document.addEventListener('touchmove', function(e) {
				if(self.activeActionItem != null){
					e.preventDefault();
				} 
			}, false);
 
		},
		
		parentNodePosition : {
			width :  0,
			height : 0,
			top :    0,
			left :   0,
			right :  0,
			bottom : 0
		},
		
		/**
		 * 选中的action
		 */
		activeActionItem : null,
		
		/**
		 * 组件el
		 */
		elContainer : new Array(),
		
		/**
		 * iscroll 对象容器
		 */
		iscrolls : new Array(),
		
		/**
		 * 
		 */
		base : function(action){
			
			var self = this;
			var data = self.getModel('data');
			if(!data || data == ''){
				data = new Array();
			}
			data.push(action);
			self.setModel('data', data);
 
		},
		
		/**
		 * 单选
		 */
		selectView : function(action){
			
			var self = this;
			self.base(action);
			
			var   id 		     = action.id,
				type 			 = action.type;
			self.actionNodes[id] = null;
			
			var selectView = new SelectView({
				'id'     : 'select-container',
				'class'  : 'am-plugin-actionbar-container-full',
				'offset' : 146
			});
			
			selectView.initConfiguration(action, self);
			
			var element = {
				selectView : selectView
			}
			self.actionNodes[id] = element;
			
		},
		
		/**
		 * 二级关联选择器
		 */
		doubleSelectView : function(action){
			
			var self = this;
			self.base(action);
			
			var   id 		       = action.id,
				type 	           = action.type;
			  self.actionNodes[id] = null;
			
			var selectView = new DoubleSelectView({
				'offset' : 146
			});
			
			selectView.initConfiguration(action, self);
			
			var element = {
				selectView : selectView
			}
			self.actionNodes[id] = element;
		},
		
		/**
		 * 字母导航选择器
		 */
		aplhabetSelectView : function(action){
			
			var self = this;
			self.base(action);
			
			var    id		     = action.id,
				 type		     = action.type;
		    self.actionNodes[id] = null;
		
			var selectView = new AplhabetSelectView({
				'id'     : 'select-container',
				'class'  : 'am-plugin-actionbar-container-full',
				'offset' : 146
			});
			
			selectView.view   = self;
			selectView.config = action;
			selectView.setAplhabetBar(new AlphabetBar({}));
			
			var element = {
				selectView : selectView
			}
			self.actionNodes[id] = element;
		},
		
		/**
		 * 字母导航二级选择器
		 */
		aplhabetDoubleSelectView : function(action){
			
			var self = this;
			self.base(action);
			
			var     id			   = action.id,
			 	  type			   = action.type;
			  self.actionNodes[id] = null;
			
			var selectView = new AplhabetDoubleSelectView({
				'offset' : 146
			});
			
			selectView.view   = self;
			selectView.config = action;
			selectView.setAplhabetBar(new AlphabetBar({}));
			
			var element = {
				selectView : selectView
			}
			self.actionNodes[id] = element;
		},
		
		/**
		 * 按钮
		 */
		actionButton : function(action){
			var self = this;
			self.base(action);
			
			var     id			   = action.id,
			 	  type			   = action.type;
			  self.actionNodes[id] = null;
			  
			var element = {
				selectView : {
					config : action
				}
			};
			self.actionNodes[id] = element;
		},
		
		/**
		 * 弹出层
		 */
		popup : function(){
			
			var self = this;
			var popup = $("<div>",{'class' : 'am-plugin-popup'});
			$(popup).appendTo(document.body);
			self.banScrollTouchmove(popup);
			self.elContainer.push(popup);
		},
		
		/**
		 * 展示ActionBar 容器
		 * 
		 */
		showActionBarContainer : function(){
			
			var self = this;
			var container = $("<div>",{'class' : 'am-plugin-actionbar-container', 'id' : 'action-bar-container'});
			$(container).appendTo(document.body);
			self.createChildContainer(container);
			self.elContainer.push(container);
		},
		
		/**
		 * 创建子容器
		 */
		createChildContainer : function(parentContainer){
			
			var self = this;
			var id   = self.activeActionItem.data('id'),
				type = self.activeActionItem.data('type');
			var actionNode = self.actionNodes[id];
			actionNode.selectView.displaySetting(parentContainer);
			actionNode.selectView.clearSelectedContext();
			actionNode.selectView.root.appendTo(parentContainer);
			actionNode.selectView.onloadData();
			var confirmView = new ConfirmView({bottom : 86});
			if(actionNode.selectView.config.submit){
				confirmView.submit(actionNode.selectView.config.submit, actionNode.selectView, self);
			}
			confirmView.root.appendTo(parentContainer);
		},
 
		/**
		 *  禁止触摸滚动条滚动
		 * @param element
		 */
		banScrollTouchmove : function(el){
			$(el).bind("touchmove",function(e){  
				e.preventDefault();  
			}, false);
		},
		
		/**
		 * 销毁Action Item
		 */
		destroyAction : function(){
			
			var self = this;
			var activeActionItem = self.activeActionItem;
			$(activeActionItem).attr('status', '0');
			$(activeActionItem).removeClass('am-plugin-actionbar-active');
			
			for(var index in self.elContainer){
				$(self.elContainer[index]).remove();
			}
			for(var index in self.iscrolls){
				self.iscrolls[index].destroy();
			}
			self.elContainer = new Array();
			self.iscrolls = new Array();
			self.activeActionItem = null;
		},
 
		
		/**
		 * 销毁选中的Action Item
		 */
		destroyActiveAction : function(nowActiveAction){
			
			var self   = this;
			var status = $(self.activeActionItem).attr('status');
			var nowAction = $(nowActiveAction).data('id'),
				oldAction = $(self.activeActionItem).data('id');
			
			if(self.activeActionItem != null){
				self.destroyAction();
				if(nowAction == oldAction && status == '1'){
					return false;
				}else{
					return true;
				}
			}else{
				return true;
			}
		},
		
		/**
		 * 激活ActionItem
		 */
		activeAction : function(){
			
			var self = this;
			$(self.activeActionItem).addClass('am-plugin-actionbar-active');
			$(self.activeActionItem).attr('status', '1');
			self.showActionBarContainer();
			
		},
		
		/**
		 * 展开下选框
		 */
		onSelectView : function(e){
			this.activeView(e.target);
		},
		
		/**
		 * 展示指定的Action
		 */
		setActive : function(id){
			var self = this;
			var element = self.actionNodes[id];
			var el = $('div[data-id='+element.selectView.config.id+']').get(0);
			if(element.selectView.config.type === 'Button'){
				self.activeButton(el);
			}else{
				self.activeView(el);
			}
		},
		
		/**
		 * 点击按钮组件入口
		 */
		onButton : function(e){
			this.activeButton(e.target);
		},
		
		activeButton : function(el){
			var self = this;
			var nowActiveItem = $(el);
			var status    	  = $(nowActiveItem).attr('status');
			var activeStatus  = self.destroyActiveAction(nowActiveItem);
			if(!activeStatus){
				return;
			}
			self.activeActionItem = nowActiveItem;
			switch(status){
				case '0' :  $(nowActiveItem).addClass('am-plugin-actionbar-active'); $(nowActiveItem).attr('status', '1'); break;
				case '1' :  $(nowActiveItem).removeClass('am-plugin-actionbar-active'); $(nowActiveItem).attr('status', '0'); break;
				default :     break;
			}
			var id = $(nowActiveItem).data('id');
			var config = self.actionNodes[id].config;
			config.submit();
		},
		
		activeView : function(el){
			var self = this;
			var nowActiveItem =$(el);
			var status    	  = $(nowActiveItem).attr('status');
			var activeStatus  = self.destroyActiveAction(nowActiveItem);
			if(!activeStatus){
				return;
			}
			
			self.activeActionItem = nowActiveItem;
			switch(status){
				case '0' :  self.activeAction();  break;
				case '1' :  self.destroyAction(); break;
				default :     break;
			}
		}
		
	});
}));
 