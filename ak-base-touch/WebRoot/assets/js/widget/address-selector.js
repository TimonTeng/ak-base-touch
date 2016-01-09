/**
 * AddressSelector Class
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

		root.AddressSelector = factory(root.AddressSelector);
	}
	
}(this, function($, _, Backbone, View, Template, Sidebar) {
	'use strict'
	
	var Type = {
		'Province'               : 'Province',
		'City'                   : 'City',
		'ProvinceCity' 		     : 'ProvinceCity',
		'ProvinceCityDistrict'   : 'ProvinceCityDistrict'
	};
	
	function AddressSelector(){
		
	    this.type = Type.City;
		
	    this.result = this.view = this.sidebar = null;
	    
	    this.province = this.city = this.district = null;
	    
	    this.data = {
	    	province : null,
	    	city : null,
	    	district : null
	    };
	    
	    this.selectData = {
	    	 province : null,
	    	 city : null,
	    	 district : null
	    }
	    
		this.sidebar = this.createSidebar();
	}
	
	AddressSelector.prototype.initConfiguration = function(view){
		this.view     = view || null;
		this.type     = view.getAttr('type') || this.type;
		this.result   = view.getAttr('result') || 'data';
		this.province = view.getAttr('province') || null;
		this.city     = view.getAttr('city') || null;
		this.district = view.getAttr('district') || null;
		this.buildJsonReader();
	}
	
	AddressSelector.prototype.createSidebar = function(){
		var self = this;
		return new Sidebar({
			
	 		title : '城市选择',
	 		
	 		returnIcon : 'icon_return',
	 		
	 		style : {
	 			zIndex : 200
	 		},
	 		
	 		submit : function(){
	 			self.submit();
	 		},
	 		
	 		returnAfter : function(){
	 			
	 		}
		});
	}
	
	AddressSelector.prototype.submit = function(){
		var submit = this.view.getAttr('submit');
		if(submit){
			submit(this.selectData);
		}
	}
	
	AddressSelector.prototype.load = function(JsonReader){
		var self = this;
		$.getJSON(JsonReader.apiUrl, null, function(data) {
			JsonReader.formatData(data);
			JsonReader.renderAfter();
			self.sidebar.open();
		});
	}
	
	AddressSelector.prototype.open = function(){
		
		switch(this.type){
			case Type.Province 			   : this.openProvinceView(); break;
			case Type.City 				   : this.openCityView(); break;
			case Type.ProvinceCity    	   : this.openProvinceCityView(); break;
			case Type.ProvinceCityDistrict : this.openProvinceCityDistrictView(); break;
			default : break;
		}
	}
	
	AddressSelector.prototype.buildJsonReader = function(){
		
		//暂时开发1种选择器
		var self = this;
		this.JsonReader = {
				
			apiUrl : self.city.apiUrl,
			
			formatData : function(data){
				self.data.city = data;
				var root = $("<div>", {'id' :'city-root', 'class' : 'am-plugin-sidebar-scroll'});
				var selectedContext = $("<div>", {'id' : 'city-context'});
				selectedContext.appendTo(root);
				var wrap   = $("<div>",{ 'id' : 'warp_root', 'class' : 'warp_mark'});
				var wrapUl = $("<ul>",{ 'id'  : 'warp_ul_root', 'class' : 'warp_context'});
				var store  = data[self.result];
				if(store){
					for (var i = 0; i < store.length; i++) {
						var storeElement = store[i];
						var node = $("<li>", {'data-object' : JSON.stringify(storeElement), 'data-select' : false});
						node.text(storeElement[self.city.displayField]);
						node.appendTo(wrapUl);
					}
				}
				wrapUl.appendTo(wrap);
				wrap.appendTo(selectedContext);
				self.sidebar.appendHtml(root);
			},
			
			renderAfter : function(){
				
				 new IScroll('#city-root', {
				      scrollbars: true,
				      mouseWheel: true,
				      interactiveScrollbars: true,
				      shrinkScrollbars: 'scale',
				      fadeScrollbars: true
			     });
				 
				 var touch = false;
				 var $el = null;
				 
				 $('.warp_context li', '#city-root').unbind('touchstart').bind('touchstart' , function(e){
					 if($el){
						 $el.css('backgroundColor', '#fff');
					 }
					 touch = true;
					 $el = $(e.target);
					 $(e.target).css('backgroundColor', '#ececec');
		    	 });
				 
				 $('.warp_context li', '#city-root').unbind('touchmove').bind('touchmove' , function(e){
					 touch = false;
					 $el.css('backgroundColor', '#fff');
				 });
				 
				 $('.warp_context li', '#city-root').unbind('touchend').bind('touchend' , function(e){
					 if(touch){
						 self.selectData.city = $el.data('object');
					 }
		    	 });
				 
			}
		};
	}
	
	AddressSelector.prototype.openProvinceView = function(){
		this.load();
	}
	
	AddressSelector.prototype.openCityView = function(){
		if(this.data.city){
			this.sidebar.open();
			return;
		}
		this.load(this.JsonReader);
	}
	
	AddressSelector.prototype.openProvinceCityView = function(){
		this.load();
	}
	
	AddressSelector.prototype.openProvinceCityDistrictView = function(){
		this.load();
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
			var addressSelector = new AddressSelector();
			addressSelector.initConfiguration(self);
			self.setAttr('addressSelector', addressSelector);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		},
		
		open : function() {
			var addressSelector = this.getAttr('addressSelector');
			addressSelector.open();
		}
	});
}));
 