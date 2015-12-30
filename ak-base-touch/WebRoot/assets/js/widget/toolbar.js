/**
 * Toolbar Class
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
	
	function ToolBar(){
		this.id = this.style = this.items = this.width = this.height = this.view = null;
		this.$body = null;
		this.$MeshItems = [];
		this.meshSize    = 0;
		this.maxMeshSize = 12;
	}
	
	ToolBar.prototype.initConfiguration = function(view){
		this.view       = view;
		this.id         = view.getAttr('id');
		this.items		= view.getAttr('items');
		this.style		= view.getAttr('style');
		this.init();
	}
	
	ToolBar.prototype.init = function(){
		this.collectDigitSize();
		if(this.checkMeshSize()){
			throw Error('items.digit 累计不能 > 12');
			return;
		}
		this.render();
	}
	
	/**
	 * 收集网格数量
	 */
	ToolBar.prototype.collectDigitSize = function(){
		var self = this;
		this.items.forEach(function(elt, i) {
			if(isNaN(elt.digit)){
				throw Error('items.digit 参数值只能为数字类型');
				return;
			}
			var digit = elt.digit || 0;
			self.meshSize += parseInt(digit);
		});
	}
	
	ToolBar.prototype.createBody = function(){
		var bodyAttribute = {
		   'class' : 'am-plugin-toolbar am-g',
		   'id' : this.id + ''
		};
		this.$body = $('<div>', bodyAttribute);
		var css = {};
		css.width  = this.width || '100%';
		css.height = this.height || '49px';
		css.lineHeight = this.height || '49px';
		$.extend(css, this.style);
		this.$body.css(css);
	}
	
	ToolBar.prototype.createMeshItem = function(){
		
		var self = this;
		
		this.items.forEach(function(config, i) {
			var meshClass = self.defineMeshClass(config.digit);
			var cssClass = config.cssClass|| '';
			var meshAttribute = {
				'id' : config.id + '',
				'class' : meshClass + ' ' +cssClass + ' am-plugin-toolbar-mesh'
			};
			var $mesh = $('<div>', meshAttribute);
			var html = config.html || '';
			$mesh.append(html);
			$mesh.appendTo(self.$body);
			self.$MeshItems.push($mesh);
			var touchend = config.touch || undefined;
			if(typeof(touchend) == 'function'){
				console.log('touchend instanceof function');
				$($mesh).bind('touchend', touchend);
			}
		});
	}
	
	/**
	 * 检查网格数量
	 */
	ToolBar.prototype.checkMeshSize = function(){
		console.log(this.meshSize);
		return (this.meshSize > this.maxMeshSize);
	}
	
	/**
	 * 定义网格
	 * @param digit
	 */
	ToolBar.prototype.defineMeshClass = function(digit){
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
 
	ToolBar.prototype.render = function(){
		this.createBody();
		this.createMeshItem();
		this.$body.appendTo(document.body);
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
 
		setup: function() {
			var self = this;
			var toolBar = new ToolBar();
			toolBar.initConfiguration(self);
			self.setAttr('toolBar', toolBar);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		}
		
	});
}));
 