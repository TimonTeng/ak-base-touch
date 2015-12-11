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
	 * 一级选择容器
	 */
	var SelectView = function(attr){
		this.attr = attr;
		this.root = $("<div>", {'id' : attr.id, 'class' : attr.class});
		this.selectedContext = $("<div>", {'id' : attr.id+'_context'});
		this.selectedContext.appendTo(this.root);
		
		/**
		 * BackBone.View
		 */
		this.view = null;
		
		/**
		 * ActionBar Item Config
		 */
		this.config = null;
		
		this.clearSelectedContext = function(){
			this.selectedContext.html('');
		}
		
	}
	
	/**
	 * 数据加载
	 */
	SelectView.prototype.onloadData = function(){
		
		var self = this;
		var apiUrl = self.view.getAttr('apiUrl');
		$.getJSON(apiUrl, {}, function(data) {
 
		}).error(function() {
			console.log('Ajax Request Error!');
		});
		
	}
	
	/**
	 * 
	 * 显示元素前设置
	 */
	SelectView.prototype.displaySetting = function(parentContainer){
		var ht = $(parentContainer).height() - this.attr.offset;
		this.root.css({height : ht});
	}
	
	/**
	 * 容器渲染至父元素之后执行
	 */
	SelectView.prototype.renderAfter = function(view){
		
	      this.rootIScroll = new $.AMUI.iScroll('#'+this.attr.id, {
		      scrollbars: true,
		      mouseWheel: true,
		      interactiveScrollbars: true,
		      shrinkScrollbars: 'scale',
		      fadeScrollbars: true
	      });
	      
	      this.view.iscrolls.push(this.rootIScroll);
	}
	
	/**
	 * 二级选择容器
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
		this.config = null;
		
		var self = this;
		this.clearSelectedContext = function(){
			self.leftSelectView.clearSelectedContext();
			self.rightSelectView.clearSelectedContext();
		}
		
	}
	
	DoubleSelectView.prototype.displaySetting = function(parentContainer){
		var ht = $(parentContainer).height() - this.attr.offset;
		this.leftSelectView.root.css({height : ht});
		this.rightSelectView.root.css({height : ht});
	}
	
	/**
	 * 数据加载
	 */
	DoubleSelectView.prototype.onloadData = function(){
		var self   = this;
		var apiUrl = self.config.url;
		$.getJSON(apiUrl, {}, function(data) {
			alert(JSON.stringify(data));
		}).error(function() {
			console.log('Ajax Request Error!');
		});
		
	}
	
	/**
	 * 容器渲染至父元素之后执行
	 */
	DoubleSelectView.prototype.renderAfter = function(view){
		
		this.rootIScroll = new $.AMUI.iScroll('#'+this.leftSelectView.attr.id, {
		      scrollbars: true,
		      mouseWheel: true,
		      interactiveScrollbars: true,
		      shrinkScrollbars: 'scale',
		      fadeScrollbars: true
	    });
		
		this.nodeIScroll = new $.AMUI.iScroll('#'+this.rightSelectView.attr.id, {
			scrollbars: true,
			mouseWheel: true,
			interactiveScrollbars: true,
			shrinkScrollbars: 'scale',
			fadeScrollbars: true
		});
		
		this.view.iscrolls.push(this.rootIScroll);
		this.view.iscrolls.push(this.nodeIScroll);
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
	      this.rootIScroll = new $.AMUI.iScroll('#'+this.attr.id, {
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
				for(var n = 0; n < data.form[i].p2pcb.length; n++){
					$(apt).append("<li data-id='"+data.form[i].p2pcb[n].id+"'>"+data.form[i].p2pcb[n].name+"</li>");
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
	 * 
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
	 * 
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
		this.rootIScroll = new $.AMUI.iScroll('#'+this.leftSelectView.attr.id, {
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
		this.nodeIScroll = new $.AMUI.iScroll('#'+this.rightSelectView.attr.id, {
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
				for(var n = 0; n < data.form[i].p2pcb.length; n++){
					var node = $("<li>", {'data-object' : JSON.stringify(data.form[i].p2pcb[n]), 'data-select' : false});
					node.text(data.form[i].p2pcb[n].name);
					node.appendTo(apt);
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
	
	return View.extend({
		
		id: 'ActionBarView',
		
		model: new Model,
		
		attrs: {
			
			template: 'assets/template/base-action-bar.tpl?ver='+  new Date().getTime()
		},
		
		events: {
			'click a[action-event]' : 'onExpand'
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
					case 'Base'             	    : self.base(actions[i]); break;
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
			
			selectView.view = self;
			selectView.config = action;
			
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
			
			selectView.view = self;
			selectView.config = action;
			
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
		onExpand : function(e){
			
			var self = this;
			var nowActiveItem = $(e.target).parent();
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
 