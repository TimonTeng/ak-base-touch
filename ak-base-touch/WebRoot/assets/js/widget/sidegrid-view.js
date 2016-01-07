/**
 * SideGrid View Class
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
	
	function SideGridView() {
		
		this.enabledHeader = true;
		this.touchTargetId = this.view =this.sideView = this.view = this.plugins = this.store = this.data = this.columns = this.title = null;
		this.$touchEl = this.$context = this.$storeContextEl = null;
		
		this.delegatesEvents = {};
		
		this.colSize  = 0;
		this.rowSize  = 0;
		this.meshSize = 0;
		this.maxMeshSize = 12; 
		this.displayColumns = [];
	}
	
	/**
	 * 初始化视图配置
	 */
	SideGridView.prototype.initConfiguration = function(view){
		this.view = view;
		this.enabledHeader = view.getAttr('enabledHeader') || true;
		this.plugins 	   = view.getAttr('plugins') || null;
		this.columns 	   = view.getAttr('columns') || null;
		this.title   	   = view.getAttr('title') || null;
		this.data    	   = view.getAttr('data') || [];
		this.touchTargetId = view.getAttr('touchTargetId') || null;
		
		this.delegatesEvents.editEvent   = view.getAttr('editAction') || undefined;
		this.delegatesEvents.deleteEvent = view.getAttr('deleteAction') || undefined;
		this.delegatesEvents.infoEvent   = view.getAttr('infoAction') || undefined;
		this.delegatesEvents.onSubmit    = view.getAttr('onSubmit') || undefined;
		
		this.initGridView();
	}
	
	/**
	 * 公共触摸事件
	 * 
	 */
	SideGridView.prototype.touchEvent = function(origin, range, touch){
		var guess = range || document.body;
		var touchStat = false;
		$(origin, guess).bind('touchstart', function(e){
			touchStat = true;
			touch.start(e);
		});
		$(origin, guess).bind('touchmove', function(e){
			touchStat = false;
			touch.move(e);
		});
		$(origin, guess).bind('touchend', function(e){
			if(touchStat){
				touch.end(e);
			}
		});
	}
	
	/**
	 * 收集网格数量
	 */
	SideGridView.prototype.collectDigitSize = function(){
		var self = this;
		var meshSize = self.meshSize;
		this.displayColumns.forEach(function(column, i) {
			if(isNaN(column.digit)){
				throw Error('column.digit 参数值只能为数字类型');
				return;
			}
			var digit = column.digit || 0;
			meshSize += parseInt(digit);
			column.meshClass = self.defineMeshClass(column.digit);
		});
		self.meshSize = meshSize;
	}
	
	/**
	 * 检查网格数量
	 */
	SideGridView.prototype.checkMeshSize = function(){
		return (this.meshSize > this.maxMeshSize);
	}
	
	/**
	 * 定义网格
	 * @param digit
	 */
	SideGridView.prototype.defineMeshClass = function(digit){
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
	 * 初始化网格视图
	 */
	SideGridView.prototype.initGridView = function(){
		this.verifyRegular();
		this.createSiderView();
		this.createPlugins();
		this.createGridHeader();
		this.createGridColumnContext();
		this.createStoreContextEl();
		this.render();
	}
	
	/**
	 * 校验参数标准
	 */
	SideGridView.prototype.verifyRegular = function(){
		var $touchEl = this.$touchEl = $('#'+this.touchTargetId);
		if($touchEl.length === 0){
			throw new Error('找不到指定 '+this.touchTargetId+' id element');
		}
	}
	
	/**
	 * 创建侧边栏
	 */
	SideGridView.prototype.createSiderView = function(){
		var self = this;
		this.sideView = new Sidebar({
	 		title : self.title,
	 		returnIcon : 'icon_return',
	 		style : {
	 			zIndex : 3119
	 		},
	 		submit : function(){
	 			if(self.delegatesEvents.onSubmit){
	 				self.delegatesEvents.onSubmit();
	 			}
	 		} 
		});
		
		var $sidebar = this.sideView.getAttr('sidebar');
		
		this.$context = $sidebar.$context;
		
        this.touchEvent(self.$touchEl, null, {
        	
        	start : function(e){
        	},
        	
        	move : function(e){
        	},
        	
        	end : function(e){
        		self.sideView.open();
        	}
        });
		
	}
	
	/**
	 * 初始化store
	 */
	SideGridView.prototype.initStore = function(){
		
		var self = this;
		var data  = self.data || [];
		var store = self.store || [];
		if(data.length == 0){
			return;
		}
		data.forEach(function(element, i) {
			var record = self.convertToStoreRecord(element);
			store.push(record);
		})
		self.store = store;
	}
	
	/**
	 * 源数据转列表行记录
	 */
	SideGridView.prototype.convertToStoreRecord = function(sourceData){
		var displayColumns = this.displayColumns;
		var record = new Object({data : sourceData});
		
		record.get = function(field){
			var recordField = this[field] || {};
			return recordField.text || '';
		}
		
		displayColumns.forEach(function(column, i) {
			
			var type  = column.type;
			var field = column.field || 'action';
			var text  = sourceData[field] || '';
			var meshClass = column.meshClass || 'am-u-sm-12';
			
			record[field] = {
				index : i,
				text  : sourceData[column.field],
				type  : type,
				meshClass : column.meshClass
			}
 
		});
		return record;
	}
	
	/**
	 * 创建扩展组件
	 */
	SideGridView.prototype.createPlugins = function(){
		if(!this.plugins){
			return;
		}
		
		//创建扩展组件
		var $plugins = $('<div>', {
			'id' : 'gridview-tools'+this.touchTargetId,
			'class' : 'am-plugins-gridview-tools'
		});
		
		$plugins.appendTo(this.$context);
		
		this.plugins.forEach(function(plugin, index) {
			
			var $plugin = $('<div>');
			
			var $i = $('<i>', {
				'class' : 'icon_add'
			});
			$i.appendTo($plugin);
			
			var $text = $('<label>');
			$text.text(plugin.title);
			$text.appendTo($plugin);
			
			var $tip = $('<i>',{
				'class' : 'icon_right_arrow'
			});
			$tip.css({
				'float' : 'right'
			});
			
			$tip.appendTo($plugin);
 
			$plugin.appendTo($plugins);
			
			if(plugin.touch){
				$($plugin).bind('touchend', function(e){
					plugin.touch(e);
				});
			}
			
		});
	}
	
	/**
	 * 点算列数
	 */
	SideGridView.prototype.checkColSize = function(){
		var self = this;
		var colSize        = self.colSize;
		var displayColumns = self.displayColumns;
		this.columns.forEach(function(column, i) {
			++colSize;
			if(column.display){
				displayColumns.push(column);
			}
		});
		self.colSize = colSize, self.displayColumns = displayColumns;
	}
	
	/**
	 * 创建列头
	 * TODO
	 */
	SideGridView.prototype.createGridHeader = function(){
		
	}
	
	/**
	 * 创建数据内容装载元素
	 * TODO
	 */
	SideGridView.prototype.createStoreContextEl = function(){
		//创建扩展组件
		this.$storeContextEl = $('<div>', {
			'id' : 'gridview-store-context',
			'class' : 'am-plugins-gridview-storecontext'
		});
		
		this.$storeContextEl.appendTo(this.$context);
	}
	
	/**
	 * 创建数据内容
	 */
	SideGridView.prototype.createGridColumnContext = function(){
		this.checkColSize();
		this.collectDigitSize();
		if(this.checkMeshSize()){
			throw Error('meshSize transboundary(网格数量越界，digit属性累计只能 <=12)');
			return;
		}
		this.initStore();
	}
	
	/**
	 * 加载
	 */
	SideGridView.prototype.onload = function(){
		
	}
	
	/**
	 * 重新加载
	 */
	SideGridView.prototype.reload = function(){
		this.render();
	}
	
	/**
	 * 加载静态数据
	 */
	SideGridView.prototype.onloadData = function(data){
		
	}
	
	/**
	 * TODO
	 * 获取源数据
	 */
	SideGridView.prototype.getData = function(){
		return this.data;
	}
	
	/**
	 * TODO
	 * 获取展示中的数据
	 */
	SideGridView.prototype.getStore = function(){
		
	}
	
	/**
	 * data : {Object}
	 * 添加记录
	 */
	SideGridView.prototype.addRecord = function(data){
		var record = this.convertToStoreRecord(data);
		this.store.push(record);
		this.data.push(data);
	}
	
	/**
	 *  data : {Object}
	 *  更新记录
	 */
	SideGridView.prototype.updateRecord = function(data){
		var record = this.convertToStoreRecord(data);
		var _record = this.findBy('id', data.id);
		if(_record){
			$.extend(_record, record);
			$.extend(_record.data, record.data);
		}else{
			throw new Errow('updateRecord error');
		}
	}
	
	/**
	 * 查找指定参数的对象
	 */
	SideGridView.prototype.findBy = function(field, value){
		var record = null
		this.store.forEach(function(item, index){
			var dataValue = item.data[field];
			if(dataValue == value){
				record = item;
				return;
			}
		});
		return record;
	}
	
	/**
	 * 渲染
	 */
	SideGridView.prototype.render = function(){
		var self = this;
		var store = self.store;
		self.$storeContextEl.empty();
		store.forEach(function(record, i) {
			var $row = self.renderRow(record);
			self.renderColumn(record, $row);
			$row.appendTo(self.$storeContextEl);
		});
	}
	
	/**
	 * 渲染行
	 */
	SideGridView.prototype.renderRow = function(record){
		return $('<div>',{
			'class' : 'am-g'
		})
	}
	
	/**
	 * 渲染列
	 */
	SideGridView.prototype.renderColumn = function(record, $row){
		var self = this;
		self.displayColumns.forEach(function(column, i) {
			 var field 		 = column.field || 'action';
			 var recordField = record[field];
			 var type 		 = recordField.type;
			 var $column     = type === 'action' ? self.renderActionColumn(recordField) : self.renderDataTypeColumn(recordField);
			 $column.appendTo($row);
		});
		
		var self = this;
		if(this.delegatesEvents.editEvent){
	        this.touchEvent('i', $row.get(0), {
	        	start : function(e){
	        	},
	        	move : function(e){
	        	},
	        	end : function(e){
	        		self.delegatesEvents.editEvent(record);
	        	}
	        });
		}
	}
	
	/**
	 * TODO
	 */
	SideGridView.prototype.renderDataTypeColumn = function(recordField, column){
		var $column = $('<div>', {
			'class' : recordField.meshClass + ' column'
		});
		$column.text(recordField.text);
		return $column;
		
	}
	
	/**
	 * TODO
	 */
	SideGridView.prototype.renderActionColumn = function(recordField, column){
		var $column = $('<div>', {
			'class' : recordField.meshClass + ' column'
		});
		
		var $edit_i = $('<i>',{
			'class' : 'icon_edit'
		});
		
		$edit_i.appendTo($column);
		
		return $column;
	}
	
	/**
	 * 随机数
	 */
	SideGridView.prototype.generateMixed = function(n) {
	     var res = "";
	     for(var i = 0; i < n ; i ++) {
	         var id = Math.ceil(Math.random()*35);
	         res += this.chars[id];
	     }
	     return res;
	}
	
	/**
	 * 
	 */
	SideGridView.prototype.chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	
	/**
	 * 打开侧边栏
	 */
	SideGridView.prototype.open = function(){
		this.sideView.open();
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
		
		open : function(closeTarget) {
			var sideGridView = this.getAttr('sideGridView');
			sideGridView.open();
		},
		
		addRecord : function(data){
			var sideGridView = this.getAttr('sideGridView');
			sideGridView.addRecord(data);
		},
		
		updateRecord : function(data){
			var sideGridView = this.getAttr('sideGridView');
			sideGridView.updateRecord(data);
		},
		
		getData : function(){
			var sideGridView = this.getAttr('sideGridView');
			return sideGridView.getData();
		},
		
		reload : function(){
			var sideGridView = this.getAttr('sideGridView');
			sideGridView.reload();
		},
 
		setup: function() {
			var self = this;
			var sideGridView = new SideGridView();
			sideGridView.initConfiguration(self);
			self.setAttr('sideGridView', sideGridView);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		}
		
	});
}));
 