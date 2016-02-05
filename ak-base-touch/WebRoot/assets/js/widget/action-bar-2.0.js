/**
 * Action View Class
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
					AlphabetBar = require('alphabetBar');
				return factory($, _, Backbone, View, AlphabetBar);
			});
		
		} else if (define.cmd) {
			
			define(function(require, exports, module) {
				
				var $         = require('jquery'),
				    _         = require('lodash'),
					Backbone  = require('backbone'),
					View      = require('backbone.view'),
				  AlphabetBar = require('alphabetBar');
				
				return factory($, _, Backbone, View, AlphabetBar);
			});
		}
		
	} else {

		root.ActionBar = factory(root.ActionBar);
	}
	
}(this, function($, _, Backbone, View, AlphabetBar) {
	'use strict'
  	
	var ViewData = {
		form : {
			Remote   : 'remote',
			Local    : 'local',
			Compose  : 'compose'
		} 
	};
	
	var ViewModel = {
		Button					 : 'Button',
		SelectView       		 : 'SelectView',
		DoubleSelectView         : 'DoubleSelectView',
		AplhabetSelectView       : 'AplhabetSelectView',
		AplhabetDoubleSelectView : 'AplhabetDoubleSelectView'
	};
	
	/**
	 * action 元素
	 */
	var ActionElement = function(config){
		this.id = this.type = this.result = this.title = this.store = null;
		this.$action = null;
	}
	
	/**
	 *  action 主视图
	 */
	var ActionView = function(){
		this.actions = this.view = this.parentNode = null;
		this.style = null;
		this.defaultDigit = 4;
		this.$main = this.$body = null;
		this.iscroll = null;
	}
	
	/**
	 * 初始化配置
	 */
	ActionView.prototype.initConfiguration = function(view){
		var self = this;
		this.view = view;
		this.parentNode = view.getAttr('parentNode');
		this.actions    = view.getAttr('actions');
		this.$main = $(this.parentNode);
		this.createBody();
		this.actions.forEach(function(config, i) {
			self.createActionElement(config);
		});
		//this.createActionViewScroll();
	}
	
	/**
	 * 初始化试图
	 */
	ActionView.prototype.initView = function(){
		
	}
	
	/**
	 * 初始化事件
	 */
	ActionView.prototype.initEvent = function(){
		
	}
	
	/**
	 * 初始化数据加载读取器
	 */
	ActionView.prototype.initJsonReader = function(){
		
	}
	
	/**
	 * 
	 */
	ActionView.prototype.createBody = function(){
		this.$body = $('<div>', { id : 'action-body', 'class' : 'am-plugin-padding0'});
		this.$body.appendTo(this.$main);
	}
	
	/**
	 * 
	 */
	ActionView.prototype.createActionElement = function(config){
		var digit = config.digit || this.defaultDigit;
		var defineMeshClass = this.defineMeshClass(digit);
		var $actionElement = $('<div>', {'id' : config.id, 'class' :  defineMeshClass+' am-plugin-actionbar-element am-plugin-padding0'});
		$actionElement.text(config.title);
		$actionElement.appendTo(this.$body);
		return $actionElement;
	}
	
	/**
	 * 
	 */
	ActionView.prototype.createActionViewScroll = function(){
	      this.iscroll = new IScroll(this.parentNode, {
	    	  scrollX: true, 
	    	  scrollY: false,
	    	  mouseWheel: true
	      });
	}
	
	
	/**
	 * 检查网格数量
	 */
	ActionView.prototype.checkMeshSize = function(){
		return (this.meshSize > this.maxMeshSize);
	}
	
	/**
	 * 计算网格平均值
	 */
	ActionView.prototype.averageMeshSize = function(){
		//this.defaultDigit = 0;
	}
	
	/**
	 * 按标题长度转化成网格大小
	 */
	ActionView.prototype.convertFontLengthToMeshSize = function(){
		var actionLength = this.actions.length;
		
	}
	
	
	/**
	 * 定义网格
	 * @param digit
	 */
	ActionView.prototype.defineMeshClass = function(digit){
		switch(digit){
			case 1 :  return 'am-u-sm-1';
			case 2 :  return 'am-u-sm-2';
			case 3 :  return 'am-u-sm-3';
			case 4 :  return 'am-u-sm-4';
			case 5 :  return 'am-u-sm-5';
			case 6 :  return 'am-u-sm-6';
			case 7 :  return 'am-u-sm-7';
			case 8 :  return 'am-u-sm-8';
			case 9 :  return 'am-u-sm-9';
			case 10 : return 'am-u-sm-10';
			case 11 : return 'am-u-sm-11';
			case 12 : return 'am-u-sm-12';
			default : return 'am-u-sm-12';
		}
	}
	
	/**
	 * 
	 */
	var Model = Backbone.Model.extend({
		idAttribute: '',
		defaults : {}
	});
 
	return View.extend({
		
		id: '',
		
		model: new Model,
		
		attrs: {
			parentNode : null
		},
		
		events: {},
		
		setup: function() {
			var self = this;
			var actionView = new ActionView();
			actionView.initConfiguration(self);
			self.setAttr('actionView', actionView);
		}
		
	});
}));
 