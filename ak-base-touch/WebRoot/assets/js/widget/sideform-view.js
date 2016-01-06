/**
 * SideForm View Class
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
					Sidebar  = require('sidebar'),
					Template = require('template');
					
				return factory($, _, Backbone, View, Template, Sidebar);
			});
		
		} else if (define.cmd) {

			define(function(require, exports, module) {
				
				var $        = require('jquery'),
				    _        = require('lodash'),
					Backbone = require('backbone'),
					View     = require('backbone.view'),
					Sidebar  = require('sidebar'),
					Template = require('template');
				
				return factory($, _, Backbone, View, Template, Sidebar);
			});
		}
		
	} else {

		root.scrollView = factory(root.scrollView);
	}
	
}(this, function($, _, Backbone, View, Template, Sidebar) {
	'use strict'
	
	var STATE = {
		'ADD'  : 'add',
		'EDIT' : 'edit',
		'INFO' : 'info'
	};
	
	function SideFormView() {
		this.state = this.touchTargetId = this.view =this.sideView = this.view = this.data = this.formObject = this.title = this.template = this.selectFields = null;
		this.sideSelectView = null;
		this.$touchEl = this.$context = this.$form = null;
		this.delegatesEvents = {};
	}
	
	/**
	 * 初始化视图配置
	 */
	SideFormView.prototype.initConfiguration = function(view){
		this.view 		    = view;
		this.title   	    = view.getAttr('title') || null;
		this.data    	    = view.getAttr('data') || [];
		this.touchTargetId  = view.getAttr('touchTargetId') || null;
		this.template       = view.getAttr('template') || null;
		this.sideSelectView = view.getAttr('sideSelectView') || null;
		
		this.delegatesEvents.onSubmit   = view.getAttr('onSubmit') || undefined;
		this.delegatesEvents.onloadAfter = view.getAttr('onloadAfter') || undefined;
		this.initFormView();
	}
	
	/**
	 * 公共触摸事件
	 * 
	 */
	SideFormView.prototype.touchEvent = function(origin, range, touch){
		var guess = range || document.body;
		var touchStat = false;
		$(origin, guess).unbind('touchstart').bind('touchstart', function(e){
			touchStat = true;
			touch.start(e);
		});
		$(origin, guess).unbind('touchmove').bind('touchmove', function(e){
			touchStat = false;
			touch.move(e);
		});
		$(origin, guess).unbind('touchend').bind('touchend', function(e){
			if(touchStat){
				touch.end(e);
			}
		});
	}
	
	/**
	 * 
	 */
	SideFormView.prototype.initFormView = function(){
		this.createSiderView();
		this.createFormEl();
	}
	
	/**
	 * 创建侧边栏
	 */
	SideFormView.prototype.createSiderView = function(){
		var self = this;
		this.sideView = new Sidebar({
	 		title : '',
	 		returnIcon : 'icon_return',
	 		style : {
	 			zIndex : 3129
	 		},
	 		submit : function(){
	 			var formObject = self.serializeForm();
	 			self.delegatesEvents.onSubmit(formObject);
	 		} 
		});
		var $sidebar = this.sideView.getAttr('sidebar');
		this.$context = $sidebar.$context;
	}
	
	/**
	 * 
	 */
	SideFormView.prototype.createFormEl = function(){
		this.$form = $('<form>', {
			'method' : 'post',
			'name'   : 'side-form',
			'id'     : 'side-form'
		});
		this.$form.appendTo(this.$context);
	}
	
	
	/**
	 * TODO
	 */
	SideFormView.prototype.renderForm = function(){
		var path = this.template;
		var formObject = this.formObject;
		var template = Template.compile(path, this.formObject);
		this.$form.empty();
		this.$form.append(template);
		
		if(this.sideSelectView){
			this.sideSelectView.initSideSelectConfigs();
		}
		
		if(this.delegatesEvents.onloadAfter){
			this.delegatesEvents.onloadAfter(formObject);
		}
	}
	
	/**
	 * TODO
	 */
	SideFormView.prototype.serializeForm = function(){
		var serializeFormJson = $(this.$form).serializeJson();
		var formObject = this.formObject || {};
		$.extend(formObject, serializeFormJson);
		return formObject;
	} 
 
	/**
	 * TODO
	 */
	SideFormView.prototype.loadForm = function(formObject){
		this.state = STATE.EDIT;
		this.formObject = formObject;
		this.sideView.setTitle(this.title.edit);
		this.renderForm();
		this.sideView.open();
	}
	
	/**
	 * TODO
	 */
	SideFormView.prototype.loadNewForm = function(){
		this.state = STATE.ADD;
		this.formObject = {};
		this.sideView.setTitle(this.title.add);
		this.renderForm();
		this.sideView.open();
	}
	
	/**
	 * 获取表单当前状态
	 * @returns {String}
	 */
	SideFormView.prototype.getState = function(){
		return this.state || STATE.INFO;
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
		
		events: {
			
		},
		
		loadForm : function(formObject) {
			var sideFormView = this.getAttr('sideFormView');
			sideFormView.loadForm(formObject);
		},
		
		loadNewForm : function(){
			var sideFormView = this.getAttr('sideFormView');
			sideFormView.loadNewForm();
		},
		
		getState : function(){
			var sideFormView = this.getAttr('sideFormView');
			return sideFormView.getState();
		},
		
		onload : function(){
			
		},
 
		setup: function() {
			
			var self = this;
			var sideFormView = new SideFormView();
			sideFormView.initConfiguration(self);
			self.setAttr('sideFormView', sideFormView);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		}
		
	});
}));
 