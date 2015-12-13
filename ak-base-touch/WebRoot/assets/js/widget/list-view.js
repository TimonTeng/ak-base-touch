/**
 * ListView Class
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

		root.listView = factory(root.listView);
	}
	
}(this, function($, _, Backbone, View, Template) {
	'use strict'
	
	
	var ListView = function(){
		 this.apiUrl = 
	     this.parentNode = 
		 this.$main = this.$list = this.$pullDown = this.$pullDownLabel = this.$pullUp = this.topOffset = 
		 this.page = this.params = this.view = null;
		 
		 this.iScroll = null;
		 
		 this.page = {
			result    : '',   //set load data collection in json field
			start     : 1,    // 开始页码
			prev      : 0,    // 前1页码
			next      : 0,    // 下1页码
			pageSize  : null, // 每页记录数量
			pageTotal : null, // 总共页数 
			total     : null,  // 总共记录数
			pageStartField : '', // 服务应用接收start 变量名
			pageSizeField  : ''	// 服务应用接收pageSize 变量名
		 };
	}
	
	ListView.prototype.initConfiguration = function(view){
		this.view   = view;
		
		this.setPage(view.getAttr('page'));
		this.setParams(view.getAttr('params'));
		this.apiUrl = view.getAttr('apiUrl');
		var parentNode = this.parentNode = view.getAttr('parentNode');
		
		this.$main          = $(parentNode);
		this.$warpiscroll = $("<div>", {'id' : 'warp-iscroll'})
		$(this.$warpiscroll, parentNode).append(this.pullDownTpl());
		$(this.$warpiscroll, parentNode).append(this.bodyContext());
		$(this.$warpiscroll, parentNode).append(this.pullUpTpl());
		this.$warpiscroll.appendTo(this.$main);
		
		this.$list          = this.$main.find('#events-list');
		this.$pullDown      = this.$main.find('#pull-down');
		this.$pullDownLabel = this.$main.find('#pull-down-label');
		this.$pullUp        = this.$main.find('#pull-up');
		this.topOffset      = -this.$pullDown.outerHeight();
	}
	
	ListView.prototype.init = function(){
 
        var iscroll = this.iScroll = new $.AMUI.iScroll(this.parentNode, {
            click: true
        });
          
	    var self = this;
	    var pullFormTop = false;
	    var pullStart;
	    
	    this.load();
 
	    iscroll.on('scrollStart', function() {
	    	console.log('scrollStart');
	    	console.log('this.y='+this.y);
	    	console.log('topOffset='+self.topOffset);
            if (this.y >= self.topOffset) {
              pullFormTop = true;
            }

            pullStart = this.y;
        });

	    iscroll.on('scrollEnd', function() {
            if (pullFormTop && this.directionY === -1) {
//            	self.handlePullDown();
            }
            pullFormTop = false;

            if (pullStart === this.y && (this.directionY === 1)) {
            	self.handlePullUp();
            }
        });
	    
	    self.resetLoading(self.$pullDown);
	}
	
	ListView.prototype.handlePullUp = function(){
        if (this.page.next < this.page.total) {
          this.setLoading(this.$pullUp);
          this.page.next += this.page.pageSize;
          this.loadNextPage();
        } else {
        }
	}
	
	ListView.prototype.handlePullDown = function(){
 
	}
	
	ListView.prototype.pullDownTpl = function(){
		return "<div class=\"pull-action loading\" id=\"pull-down\">"+
			        "<span class=\"am-icon-arrow-down pull-label\" id=\"pull-down-label\">下拉刷新</span>"+
			        "<span class=\"am-icon-spinner am-icon-spin\"></span>"+
	           "</div>";
	}
	
	ListView.prototype.pullUpTpl = function(){
		return "<div class=\"pull-action loading\" id=\"pull-up\">"+
		"<span class=\"am-icon-arrow-down pull-label\" id=\"pull-up-label\">上拉加载更多</span>"+
		"<span class=\"am-icon-spinner am-icon-spin\"></span>"+
		"</div>";
	}
	
	ListView.prototype.bodyContext = function(){
		return "<ul class=\"am-list\" id=\"events-list\">"+
			        "<li class=\"am-list-item-desced\">"+
			        	"<div class=\"am-list-item-text\">正在加载内容...</div>"+
			        "</li>"+
	           "</ul>";
	}
	
	ListView.prototype.setLoading = function($el) {
        $el.addClass('loading');
	};
	

	ListView.prototype.resetLoading = function($el) {
        $el.removeClass('loading');
	};
	
	/**
	 * 组装URL
	 */
	ListView.prototype.getUrl = function(){
        var queries = ['callback=?'];
        for (var key in  this.params) {
          if (this.params[key]) {
            queries.push(key + '=' + this.params[key]);
          }
        }
        queries.push(this.page.pageStartField + '=' + this.page.start);
        queries.push(this.page.pageSizeField + '=' + this.page.pageSize);
        return this.apiUrl + '?' + queries.join('&');
	}
	
	
	/**
	 * 渲染内容
	 */
	ListView.prototype.renderList = function(data){
		var path = this.view.getAttr('template');
		var template = Template.compile(path, data);
		return template;
	}
 
	
	/**
	 * 加载
	 */
	ListView.prototype.load = function(){
		
		var self = this;
        $.getJSON(self.getUrl()).then(function(data) {
        	self.page.total = data.total;
            var html = self.renderList(data[self.page.result]);
            self.$list.html(html);
            setTimeout(function() {
              self.iScroll.refresh();
            }, 100);
            
        }, function() {
            console.log('Error...')
        });
 
	}
	
	
	
	/**
	 * 加载
	 */
	ListView.prototype.loadNextPage = function(){
		var self = this;
        $.getJSON(self.getUrl()).then(function(data) {
        	self.page.total = data.total;
            var html = self.renderList(data[self.page.result]);
            self.$list.append(html);
            setTimeout(function() {
              self.iScroll.refresh();
            }, 100);
            
        }, function() {
            console.log('Error...')
        }).always(function() {
              self.resetLoading(self.$pullUp);
             // self.iScroll.scrollTo(0, self.topOffset, 800, $.AMUI.iScroll.utils.circular);
        });
 
	}
	
	ListView.prototype.setPage = function(options){
		var self = this;
		var page = {};
		$.extend(page, self.page, options);
		self.page = page
	}
	
	ListView.prototype.setParams = function(options){
		var self = this;
		var params = {};
		$.extend(params, self.params, options);
		self.params = params
	}
	
	ListView.prototype.setParam = function(name, value){
		this.params[name] = value;
	}
  		
	var Model = Backbone.Model.extend({
		idAttribute: '',
		defaults : {
			apiUrl : ''
		}
	});
		
	return View.extend({
		
		id: '',
		
		model: new Model,
		
		attrs: {
			parentNode : null,
			template : null,
			page : {
				result    : '', //set load data collection in json field
				start     : 1,    // 开始页码
				pageSize  : null, // 每页记录数量
				pageStartField : '', // 服务应用接收start 变量名
				pageSizeField  : ''	// 服务应用接收pageSize 变量名
			},
			params : { //加载列表数据的查询条件
				
			}
		},
		
		events: {
			
		},
 
		setup: function() {
			var self = this;
			var parentNode = self.getAttr('type'),
			    type       = self.getAttr('type'),
				data       = self.getAttr('data');
			
			var listView = new ListView();
			listView.initConfiguration(self);
			listView.init();
			self.setAttr('listView', listView);
			
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		},
		
		/**
		 * 设置分页条件 
		 */
		setPage : function(page){
			this.getAttr('listView').setPage(page);
		},
		
		/**
		 * 设置参数
		 */
		setParams : function(params){
			this.getAttr('listView').setParams(params);
		},
		
		/**
		 * 单项属性属性设置
		 */
		setParam : function(name, value){
			this.getAttr('listView').setParam(name, value);
		},
		
		/**
		 * 重新加载ListView 内容
		 * 
		 */
		reload : function(params){
			this.getAttr('listView').reload(params);
		}
		
	});
}));
 