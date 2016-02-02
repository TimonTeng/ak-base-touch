/**
 * Context View Class
 * @Require: jQuery
 * @Extend:
 */
!(function(root, factory) {
	'use strict'
  
	if ('function' === typeof define) {
		
		if (define.amd) {
		
			define(function(require) {

				var $        = require('jquery'),
				    _        = require('lodash'),
					Backbone = require('backbone'),
					View     = require('backbone.view'),
					Template = require('template');
					
				return factory($, _, Backbone, View, Template);
			});
		
		} else if (define.cmd) {

			define(function(require, exports, module) {
				
				var $        = require('jquery'),
				    _        = require('lodash'),
					Backbone = require('backbone'),
					View     = require('backbone.view'),
					Template = require('template');
				
				return factory($, _, Backbone, View, Template);
			});
		}
		
	} else {

		root.scrollView = factory(root.scrollView);
	}
	
}(this, function($, _, Backbone, View, Template) {
	'use strict'
	
	function ContextView(){
		
		this.items = this.view = this.loadComplete = this.scrollView = null;
		
		this.contextItems = [];
		
		this.contextObject = {};
		
	    this.$parentNode = null;
		
		this.threads = 0;
		
		this.lazyload = true;
		
	}
	
	ContextView.prototype.initConfiguration = function(view){
		this.view = view;
		this.scrollView   = view.getAttr('scrollView');
		this.contextItems = view.getAttr('items') || [];
		this.loadComplete = view.getAttr('loadComplete');
		var parentNode    = view.getAttr('parentNode');
		this.$parentNode  = $(parentNode);
		this.lazyload     = new Boolean(view.getAttr('lazyload') || true);
		if(this.contextItems.length === 0){
			 throw Error('ContextView attribute items unspecified');
			 return;
		}
 
		if(this.$parentNode.length === 0){
			 throw Error('ContextView attribute parentNode unspecified');
			 return;
		}
 
		if(!this.scrollView){
			 throw Error('ContextView attribute scrollView unspecified');
			 return;
		}
 
		this.init();
	}
	
	/**
	 * 初始化
	 */
	ContextView.prototype.init = function(){
		this.renderComplete();
		var contextObject = this.contextObject;
		for(var i = 0; i < this.contextItems.length; i++) {
			var config = this.contextItems[i];
			var $contextElement = this.createContextElement(config, i);
			var loadMethod = ('templateOnly' in config) ? 'loadTemplateOnly' : 'loadContext' ;
			this[loadMethod](config, $contextElement);
			contextObject[config.id] = config;
		}
	}
	
	/**
	 * 渲染完成后执行
	 */
	ContextView.prototype.renderComplete = function(){
		var self = this;
		if(!self.loadComplete){
			return;
		}
		var intervalId =  setInterval(function() {
			if(self.threads == self.contextItems.length){
				self.isLazyLoad();
				self.loadComplete();
				self.scrollView.refresh();
				clearInterval(intervalId);
			}
		}, 500);
	}
	
	/**
	 * 渲染完成后执行
	 */
	ContextView.prototype.renderItemComplete = function(){
		++this.threads;
	}
	
	/**
	 * 
	 * 构造内容元素
	 */
	ContextView.prototype.createContextElement = function(config, index){
		var id = config.id || 'am-plugin-context-view'+index;
		var $contextElement = $('<div>', { id : id });
		$contextElement.appendTo(this.$parentNode);
		return $contextElement;
	}
	
	/**
	 * 渲染内容
	 */
	ContextView.prototype.renderContext = function(config, data){
		var path     = config.template;
		var template = Template.compile(path, data);
		return template;
	}
	
	
	/**
	 * 把渲染内容添加至父节点
	 * @param config
	 * @param index
	 */
	ContextView.prototype.appendToParentNode = function(config, html, $contextElement){
		$contextElement.html(html);
		if(config.renderAfter){
			config.renderAfter($contextElement);
		}
		this.renderItemComplete();
	}
	
	
	/**
	 * 只加载模板
	 * @param config
	 * @param index
	 */
	ContextView.prototype.loadTemplateOnly = function(config, $contextElement){
		var html = this.renderContext(config, null);
		this.appendToParentNode(config, html, $contextElement);
	}
	
	/**
	 * 加载内容
	 * @param config
	 */
	ContextView.prototype.loadContext = function(config, $contextElement){
		if(!config.result){
			 throw Error('ContextView.items config.result attribute unspecified');
			 return;
		}
		var self = this;
        $.getJSON(config.apiUrl).then(function(data) {
        	var html = self.renderContext(config, data[config.result]);
        	self.appendToParentNode(config, html, $contextElement);
        }, function() {
            console.log('ContextView.loadContext Error...')
        });
	}
	
	/**
	 * 刷新
	 */
	ContextView.prototype.reload = function(id){
		var self = this;
		var config = self.contextObject[id];
		var $contextElement = $('#'+id);
		var loadMethod = ('templateOnly' in config) ? 'loadTemplateOnly' : 'loadContext' ;
		this[loadMethod](config, $contextElement);
	}
	
	/**
	 * 全部刷新
	 */
	ContextView.prototype.reloadAll = function(){
		var self = this;
		self.threads = 0;
		self.renderComplete();
		for (var id in self.contextObject) {
			self.reload(id);
		}
	}
	
	/**
	 * 判断是否处理延迟加载数据
	 */
	ContextView.prototype.isLazyLoad = function(){
		if(this.lazyload == true){
			this.listenerImageOnload();
			this.imageLazyLoad();
		}
	}
	
	/**
	 * 监听图片加载完成事件, 刷新滚动条长度
	 */
	ContextView.prototype.listenerImageOnload = function(){
		var self = this;
		$('img', self.$parentNode).unbind('load').bind('load', function(e){
			self.scrollView.refresh();
		});
	}
	
	/**
	 * list中的图片延迟加载设置
	 */
	ContextView.prototype.imageLazyLoad = function(){
		$('img', this.$parentNode).lazyload({
			effect : 'fadeIn',
			threshold : 350
		});
	}
	
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
			var contextView = new ContextView();
			contextView.initConfiguration(self);
			self.setAttr('contextView', contextView);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		},
		
		reload : function(id){
			var contextView = this.getAttr('contextView');
			contextView.reload(id);
		},
		
		reloadAll : function(){
			var contextView = this.getAttr('contextView');
			contextView.reloadAll();
		}
	});
}));
 