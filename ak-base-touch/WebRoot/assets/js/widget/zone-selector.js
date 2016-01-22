/**
 * ZoneSelector Class
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
					Sidebar     = require('sidebar'),
					AlphabetBar = require('alphabetBar'),
					Template    = require('template');
					
				return factory($, _, Backbone, View, Template, AlphabetBar, Sidebar);
			});
		
		} else if (define.cmd) {

			define(function(require, exports, module) {
				
				var $           = require('jquery'),
				    _           = require('lodash'),
					Backbone    = require('backbone'),
					View        = require('backbone.view'),
					Sidebar     = require('sidebar'),
					AlphabetBar = require('alphabetBar'),
					Template    = require('template');
				    
				
				return factory($, _, Backbone, View, Template, AlphabetBar, Sidebar);
			});
		}
		
	} else {

		root.ZoneSelector = factory(root.ZoneSelector);
	}
	
}(this, function($, _, Backbone, View, Template, AlphabetBar, Sidebar) {
	'use strict'
	
	var Type = {
		Province      : 'Province',
	    City          : 'City',
		ProvinceCity  : 'ProvinceCity',
	    ProvinceCityDistrict : 'ProvinceCityDistrict'
	};
 
	function ZoneSelector(){
		
		this.type = Type.City;
		
		this.alphabet = true;
		
	    this.alphabetBar = this.view = this.sidebar = this.title = null;
	    
	    this.config = {
	       province : null,
	       city : null,
	       district : null
	    };
	    
	    this.JsonReader = {
    		province : {},
    		city : {},
    		district : {}
	    };
	    
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
	    this.$provinceBody = this.$cityBody = this.$district = this.$context = this.$body = null;
	    this.provinceMeshSize = this.cityMeshSize = this.districtMeshSize = 12;
	    this.rootIScroll = null;
	    
	}
 
	ZoneSelector.prototype.initConfiguration = function(view){
		var self = this;
		self.view     	     = view || null;
		self.config.province = view.getAttr('province') || undefined;
		self.config.city     = view.getAttr('city') || undefined;
		self.config.district = view.getAttr('district') || undefined;
		self.title 			 = view.getAttr('title') || '';
		self.type 			 = view.getAttr('type') || this.type;
		self.alphabet        = view.getAttr('alphabet') || this.alphabet;
		
		if(self.alphabet){
			self.alphabetBar = new AlphabetBar();
			self.alphabetBar.alphabetBarView.bindSelectView(self);
		}
		
		if(self.validationConfiguration()){
			self.initViewMode();
		}
	}
	
	/**
	 * 校验参数
	 */
	ZoneSelector.prototype.validationConfiguration = function(){
		return true;
	}
	
	
	/**
	 * 初始化视图模型
	 */
	ZoneSelector.prototype.initViewMode = function(){
		this.createSidebar();
		this.createViewMode();
		this.renderViewMode();
	}
	
	/**
	 * 
	 */
	ZoneSelector.prototype.provinceMode = function(){
		var self = this;
		self.createBody();
		self.createProvinceBody();
		self.$provinceBody.appendTo(self.$body);
		self.$body.appendTo(self.$context);
		
		self.createZoneDataContext(self.$provinceBody);
		var config     = self.config;
		var JsonReader = self.JsonReader;
		JsonReader.province.scroll = self.rootIScroll = self.createScroll('#province-body');
		$.extend(JsonReader.province, config.province, self.provinceJsonReaderOptions());
		self.initload = function(){
			self.load(JsonReader.province);
		}
	}
	
	/**
	 * 
	 */
	ZoneSelector.prototype.cityMode = function(){
		var self = this;
		self.createBody();
		self.createCityBody();
		self.$cityBody.appendTo(self.$body);
		self.$body.appendTo(self.$context);
		
		self.createZoneDataContext(self.$cityBody);
		var config     = self.config;
		var JsonReader = self.JsonReader;
		JsonReader.city.scroll = self.rootIScroll = self.createScroll('#city-body');
		$.extend(JsonReader.city, config.city, self.cityJsonReaderOptions());
		self.initload = function(){
			self.load(JsonReader.city);
		}
	}
	
	/**
	 * 
	 */
	ZoneSelector.prototype.provinceCityMode = function(){
		var self = this;
		self.createBody();
		self.createProvinceBody();
		self.createCityBody();
		self.$provinceBody.appendTo(self.$body);
		self.$cityBody.appendTo(self.$body);
		self.$body.appendTo(self.$context);
		
		self.createZoneDataContext(self.$provinceBody);
		self.createZoneDataContext(self.$cityBody);
		
		var config     = self.config;
		var JsonReader = self.JsonReader;
		
		JsonReader.province.scroll = self.rootIScroll = self.createScroll('#province-body');
		JsonReader.city.scroll     = self.createScroll('#city-body');
		$.extend(JsonReader.province, config.province, self.provinceJsonReaderOptions());
		$.extend(JsonReader.city, config.city, self.cityJsonReaderOptions());
		
		self.scrollTigger(JsonReader.province);
		self.scrollTigger(JsonReader.city);
		
		self.initload = function(){
			self.load(JsonReader.province);
		}
	}
	
	/**
	 * 
	 */
	ZoneSelector.prototype.provinceCityDistrictMode = function(){
		var self = this;
		self.createBody();
		self.createProvinceBody();
		self.createCityBody();
		self.createDistrictBody();
		self.$provinceBody.appendTo(self.$body);
		self.$cityBody.appendTo(self.$body);
		self.$districtBody.appendTo(self.$body);
		self.$body.appendTo(self.$context);
		
		self.createZoneDataContext(self.$provinceBody);
		self.createZoneDataContext(self.$cityBody);
		self.createZoneDataContext(self.$districtBody);
		
		var config     = self.config;
		var JsonReader = self.JsonReader;
		
		JsonReader.province.scroll = self.rootIScroll = self.createScroll('#province-body');
		JsonReader.city.scroll     = self.createScroll('#city-body');
		JsonReader.district.scroll = self.createScroll('#district-body');
		$.extend(JsonReader.province, config.province, self.provinceJsonReaderOptions());
		$.extend(JsonReader.city, config.city, self.cityJsonReaderOptions());
		$.extend(JsonReader.district, config.district, self.districtJsonReaderOptions());
		
		self.initload = function(){
			self.load(JsonReader.province);
		}
	}
	
	/**
	 * 
	 * @param iscroll
	 */
	ZoneSelector.prototype.scrollTigger = function(zone){
		var self    = this;
		var iscroll = zone.scroll;
		
		iscroll.on('scrollStart', function() {
			console.log('scrollStart');
			$('.am-plugin-sidebar-header-title').text('s='+this.directionY);
		});
		
		iscroll.on('scrollEnd', function() {
			console.log('scrollEnd');
			$('.am-plugin-sidebar-header-title').text('e='+this.directionY);
		});
	}
	
	/**
	 * 
	 */
	ZoneSelector.prototype.createScroll = function(scrollId){
		return new IScroll(scrollId, {
			click : true
		});
	}
	
	/**
	 * 全部取消
	 */
	ZoneSelector.prototype.selectedAllOff = function($dataContext, zoneField){
		$('[selected]', $dataContext).css('backgroundColor', '#fff');
		this.selectData[zoneField] = null;
	}
	
	/**
	 * 取消选择
	 */
	ZoneSelector.prototype.selectedOff = function(target, zoneField){
		var data = $(target).data('object');
		target.style.backgroundColor = '#fff';
		target.removeAttribute('selected');
		this.selectData[zoneField] = null;
	}
	
	/**
	 * 选中
	 */
	ZoneSelector.prototype.selectedOn = function(target, zoneField){
		var data = $(target).data('object');
		target.style.backgroundColor = '#ececec';
		target.setAttribute('selected', true);
		this.selectData[zoneField] = data;
	}
	
	/**
	 * 
	 * @returns {___anonymous5709_5792}
	 */
	ZoneSelector.prototype.provinceJsonReaderOptions = function(){
		var self = this;
		var $dataContext = $('.zone-data-context', self.$provinceBody);
		return {
		   'renderData' : self.renderAlphabetDataContext,
		   '$dataContext' : $dataContext,
		   'bindEvent' : function(e){
			   
			   self.touchEvent('.warp_context li', $dataContext, {
		        	start : function(e){
		        		self.selectedAllOff($dataContext, 'province');
		        		self.selectedOn(e.target, 'province');
		        		if(self.$cityBody){
		        			$('.zone-data-context', self.$cityBody).empty();
		        		}

		        		if(self.$districtBody){
		        			$('.zone-data-context', self.$districtBody).empty();
		        		}
		        	},
			       	move : function(e){
			       		self.selectedOff(e.target, 'province');
			       	},
			       	end : function(e){
			       		var cityJsonReader = self.JsonReader.city;
			       		self.load(cityJsonReader);
			       	}
			   });
		   }
		};
	}
	
	/**
	 * 
	 * @returns {___anonymous6012_6095}
	 */
	ZoneSelector.prototype.cityJsonReaderOptions = function(){
		var self = this;
		var $dataContext = $('.zone-data-context', self.$cityBody);
		return {
		   'renderData' : (function(){return (self.type === Type.City) ? self.renderAlphabetDataContext : self.renderDataContext})(),
		   '$dataContext' : $dataContext,
		   'getUrl' : function(){
			   if(self.selectData.province){
				   return  this.apiUrl+'?'+ this.parentQueryName + '='+ self.selectData.province.id;
			   }
			   return this.apiUrl;
		   },
		   'bindEvent' : function(e){
			   
			   self.touchEvent('.warp_context li', $dataContext, {
		        	start : function(e){
		        		self.selectedAllOff($dataContext, 'city');
		        		self.selectedOn(e.target, 'city');

		        		if(self.$districtBody){
		        			$('.zone-data-context', self.$districtBody).empty();
		        		}
		        		
		        	},
			       	move : function(e){
			       		self.selectedOff(e.target, 'city');
			       	},
			       	end : function(e){
			       		var districtJsonReader = self.JsonReader.district;
			       		self.load(districtJsonReader);
			       	}
			   });
			   
		   }
		};
	}
	
	/**
	 * 
	 * @returns {___anonymous6323_6406}
	 */
	ZoneSelector.prototype.districtJsonReaderOptions = function(){
		var self = this;
		var $dataContext = $('.zone-data-context', self.$districtBody);
		return {
		   'renderData' : self.renderDataContext,
		   '$dataContext' : $dataContext,
		   'getUrl' : function(){
			   if(self.selectData.city){
				   return  this.apiUrl+'?'+ this.parentQueryName + '='+ self.selectData.city.id;
			   }
			   return this.apiUrl;
		   },
		   'bindEvent' : function(e){
			   self.touchEvent('.warp_context li', $dataContext, {
		        	start : function(e){
		        		self.selectedAllOff($dataContext, 'district');
		        		self.selectedOn(e.target, 'district');
		        	},
			       	move : function(e){
			       		self.selectedOff(e.target, 'district');
			       	},
			       	end : function(e){
 
			       	}
			   });
		   }
		};
	}
	
	
	/**
	 * 创建视图模型
	 */
	ZoneSelector.prototype.createViewMode = function(){
		var self = this;
		switch(self.type){
			case Type.Province 			   : self.setBodyMeshSize(12, 0, 0); self.provinceMode(); break;
			case Type.City                 : self.setBodyMeshSize(0, 12, 0); self.cityMode(); break;
			case Type.ProvinceCity         : self.setBodyMeshSize(6, 6, 0); self.provinceCityMode(); break;
			case Type.ProvinceCityDistrict : self.setBodyMeshSize(4, 4, 4); self.provinceCityDistrictMode(); break;
			default : break;
		}
	}
	
	/**
	 * 设置 body 宽度
	 */
	ZoneSelector.prototype.setBodyMeshSize = function(provinceMeshSize, cityMeshSize, districtMeshSize){
		this.provinceMeshSize = provinceMeshSize;
		this.cityMeshSize     = cityMeshSize;
		this.districtMeshSize = districtMeshSize;
	}
	
	/**
	 * 
	 * @returns
	 */
	ZoneSelector.prototype.createZoneDataContext = function($zoneBody){
		var $context = $('<div>', {
			'class' : 'zone-data-context'
		});
		$context.appendTo($zoneBody);
	}
	
	/**
	 * 
	 */
	ZoneSelector.prototype.createProvinceBody = function(){
		this.$provinceBody = $('<div>', {
			'class' : 'zone-data am-padding-0 am-u-sm-'+this.provinceMeshSize,
			'id' : 'province-body'
		});
	}
	
	
	/**
	 * 
	 */
	ZoneSelector.prototype.createCityBody = function(){
		this.$cityBody = $('<div>', {
			'class' : 'zone-data am-padding-0 am-u-sm-'+this.cityMeshSize,
			'id' : 'city-body'
		});
	}
	
	/**
	 * 
	 */
	ZoneSelector.prototype.createDistrictBody = function(){
		this.$districtBody = $('<div>', {
			'class' : 'zone-data am-padding-0 am-u-sm-'+this.districtMeshSize,
			'id' : 'district-body'
		});
	}
	
	/**
	 * 
	 */
	ZoneSelector.prototype.createBody = function(){
		this.$body = $('<div>', {
			'class' : 'am-g am-plugin-zone-body',
			'id' : 'zone-body'
		});
	}
	
	/**
	 * 创建侧边栏
	 */
	ZoneSelector.prototype.createSidebar = function(){
		
		var self = this;
		
		self.sidebar = new Sidebar({
			
	 		title : self.title,
	 		
	 		returnIcon : 'icon_return',
	 		
	 		style : {
	 			zIndex : 2013
	 		},
	 		
	 		submit : function(){
	 			self.submit();
	 		},
	 		
	 		returnAfter : function(){
	 			
	 		}
		});
		this.$context = self.sidebar.getAttr('sidebar').$context;
	}
	
	/**
	 * 渲染数据内容
	 */
	ZoneSelector.prototype.renderDataContext = function(JsonReader){
		JsonReader.$dataContext.empty();
		var data = JsonReader.data || [];
		var wrapUl = $("<ul>", {'class' : 'warp_context'});
		data.forEach(function(item, i) {
			var node = $("<li>", {'data-object' : JSON.stringify(item), 'data-select' : false});
			node.text(item[JsonReader.displayField]);
			node.appendTo(wrapUl);
		});
		wrapUl.appendTo(JsonReader.$dataContext);
		JsonReader.scroll.refresh();
		JsonReader.bindEvent();
	}
	
	/**
	 * 渲染数据内容
	 */
	ZoneSelector.prototype.renderAlphabetDataContext = function(JsonReader){
		JsonReader.$dataContext.empty();
		var data = JsonReader.data;
		data.forEach(function(item, i) {
			var wrap = $("<div>",{ 'id' : 'warp_alphabet_'+item.code, 'class' : 'warp_alphabet_mark'});
			var hd   = $("<div class='warp_alphabet_title'><li><h2>"+item.code+"</h2></li></div>");
			$(hd).appendTo(wrap);
			var apt = $("<ul>",{ 'id' : 'warp_u_'+item.code, 'class' : 'warp_context'});
			$(apt).appendTo(wrap);
			var _data = item.data || [];
			var wrapUl = $("<ul>", {'class' : 'warp_context'});
			_data.forEach(function(_item, i) {
				var node = $("<li>", {'data-object' : JSON.stringify(_item), 'data-select' : false});
				node.text(_item[JsonReader.displayField]);
				node.appendTo(wrapUl);
			});
			wrapUl.appendTo(wrap);
			wrap.appendTo(JsonReader.$dataContext);
		});
		JsonReader.scroll.refresh();
		JsonReader.bindEvent();
	}
	
	/**
	 * 渲染视图模型
	 */
	ZoneSelector.prototype.renderViewMode = function(){
		var self = this;
		var offsetHeight = self.$body.height() - 20;
		self.alphabetBar.alphabetBarView.renderTo(self.$body, offsetHeight);
	}
	
	ZoneSelector.prototype.submit = function(){
		var self = this;
		var submit = self.view.getAttr('submit');
		if(submit){
			submit(self.selectData);
		}
	}
	
	/**
	 * 
	 * @param JsonReader
	 */
	ZoneSelector.prototype.load = function(JsonReader){
		var self = this;
		var apiUrl = JsonReader.getUrl ? JsonReader.getUrl() : JsonReader.apiUrl;
		$.getJSON(apiUrl, null, function(data) {
			JsonReader.data = data[JsonReader.result];
			JsonReader.renderData(JsonReader);
			self.sidebar.open();
		});
	}
 
	/**
	 * 
	 */
	ZoneSelector.prototype.open = function(){
		this.initload();
		this.sidebar.open();
		this.renderAlphabetbar();
	}
	
	
	ZoneSelector.prototype.renderAlphabetbar = function(){
		var self = this;
		var offsetHeight = self.$body.height() - 20;
		self.alphabetBar.alphabetBarView.positionHeight(offsetHeight);
		self.alphabetBar.alphabetBarView.positionAlphabetOffsetY();
	}
	
	/**
	 * 公共触摸事件
	 * 
	 */
	ZoneSelector.prototype.touchEvent = function(origin, range, touch){
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
			var zoneSelector = new ZoneSelector();
			zoneSelector.initConfiguration(self);
			self.setAttr('zoneSelector', zoneSelector);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		},
		
		open : function() {
			var zoneSelector = this.getAttr('zoneSelector');
			zoneSelector.open();
		}
	});
}));
 