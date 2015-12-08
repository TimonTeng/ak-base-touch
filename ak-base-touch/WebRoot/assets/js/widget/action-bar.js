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
		this.selectedContext =  $("<div>", {'id' : attr.id+'_context'});
		this.selectedContext.appendTo(this.root);
	}
	
	SelectView.prototype.displaySetting = function(parentContainer){
		var ht = $(parentContainer).height() - this.attr.offset;
		this.root.css({height : ht});
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
	}
	
	DoubleSelectView.prototype.displaySetting = function(parentContainer){
		var ht = $(parentContainer).height() - this.attr.offset;
		this.leftSelectView.root.css({height : ht});
		this.rightSelectView.root.css({height : ht});
	}
	
	
	/**
	 * 一级字母导航选择器
	 */
	var AplhabetSelectView = function(attr){
		var selectView = new SelectView(attr);
		this.attr = attr;
		this.root = selectView.root;
	}
	
	AplhabetSelectView.prototype.displaySetting = function(parentContainer){
		var ht = $(parentContainer).height() - this.attr.offset;
		this.root.css({height : ht});
		var alphabetBarView = this.aplhabetBar.alphabetBarView;
		alphabetBarView.root.appendTo(this.root);
	}
	
	AplhabetSelectView.prototype.setAplhabetBar = function(aplhabetBar){
		this.aplhabetBar = aplhabetBar;
	}
	
	
	/**
	 * 二级字母导航选择器
	 */
	var AplhabetDoubleSelectView = function(attr){
		
	}
	
	AplhabetDoubleSelectView.prototype.displaySetting = function(parentContainer){
		
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
		return this;
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
			actionNode.selectView.root.appendTo(parentContainer);
			var confirmView = new ConfirmView({bottom : 86});
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
				default :   alert('error');  break;
			}
			
		} 
		
	});
}));
 