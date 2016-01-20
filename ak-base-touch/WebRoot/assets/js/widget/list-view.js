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

	var ViewAttributes = {
		Type : {
			'Waterfall' : 'waterfall',
			'Pivot'	    : 'pivot'
		} 
    };
	
	var ListView = function(){
		
		 this.type   = ViewAttributes.Type.Waterfall;//默认使用瀑布流分页模式
		 this.apiUrl = 
	     this.parentNode = 
		 this.$main = this.$list = this.$pullDown = this.$pullDownLabel = this.$pullUp = this.$pullUpLabel = this.topOffset = 
		 this.style = 
		 this.page = this.params = this.view = null;
		 this.iScroll = null;
		 this.activate = true;//是否激活状态
		 
		 this.page = {
			result          : '',   // 服务应用返回列表集合 在json属性键值 , set load data collection in json field
			pageNo          : 1,    // 开始页码
			pageSize        : 0, // 每页记录数量
			pageTotal       : 0, // 总共页数 
			total     	    : 0, // 总共记录数
			prev            : 1,    // 前1页码
			next            : 1,    // 下1页码
			pageNoField     : '',   // 服务应用接收pageNo 变量名
			pageSizeField   : '',	// 服务应用接收pageSize 变量名
			pageTotalField  : ''    // 服务应用返回pageTotal 在json中的属性键值
		 };
		 
		 this.renderAfter = null;
	}
	
	/**
	 * 
	 * @param view
	 */
	ListView.prototype.initConfiguration = function(view){
		this.view   	 = view;
		this.setPage(view.getAttr('page'));
		this.setParams(view.getAttr('params'));
		this.apiUrl      = view.getAttr('apiUrl');
		this.style       = view.getAttr('style');
		this.parentNode  = view.getAttr('parentNode');
		var type  	     = view.getAttr('type');
		this.$main	     = $(this.parentNode);
		this.renderAfter = view.getAttr('renderAfter');
		
		if(this.style){
			this.$main.css(this.style);
		}
		
		if(type && type != ''){
			this.type = type;
		}
		
		switch(this.type){
			case ViewAttributes.Type.Waterfall :  this.initWaterfallMode(); break;
			case ViewAttributes.Type.Pivot 	   :  this.initPivotMode(); break;
			default : break;
		}

	}
	
	
	/**
	 * 瀑布流模式初始化
	 */
	ListView.prototype.initWaterfallMode = function(){
		this.$warpiscroll = $("<div>", {'id' : 'warp-iscroll'})
//		$(this.$warpiscroll, this.parentNode).append(this.pullDownTpl());
		$(this.$warpiscroll, this.parentNode).append(this.bodyContext());
		$(this.$warpiscroll, this.parentNode).append(this.pullUpTpl());
		this.$warpiscroll.appendTo(this.$main);
		
		this.$list          = this.$main.find('#events-list');
		this.$pullDown      = this.$main.find('#pull-down');
		this.$pullDownLabel = this.$main.find('#pull-down-label');
		this.$pullUp        = this.$main.find('#pull-up');
		this.$pullUpLabel   = this.$main.find('#pull-up-label');
		this.topOffset      = -this.$pullDown.outerHeight();
		
		this.bindIScroll();
		this.setActivate();
		this.load();
	}
	
	/**
	 * 枢模式初始化
	 */
	ListView.prototype.initPivotMode = function(){
		this.$warpiscroll = $("<div>", {'id' : 'warp-iscroll'})
		$(this.$warpiscroll, this.parentNode).append(this.bodyContext());
		this.$warpiscroll.appendTo(this.$main);
		this.$list      = this.$main.find('#events-list');
		this.scrollView = this.view.getAttr('scrollView');
		this.setActivate();
	    this.load();
	}
	
	/**
	 * 渲染Dom之后处理入口
	 */
	ListView.prototype.renderAfterHandle = function(){
		var self = this;
		
		switch(this.type){
			case ViewAttributes.Type.Waterfall :  this.renderAfterWaterfallModeHandle(); break;
			case ViewAttributes.Type.Pivot 	   :  this.renderAfterPivotModeHandle(); break;
			default : break;
		}
	}
	
	
	/**
	 * 瀑布流模式渲染Dom之后执行
	 */
	ListView.prototype.renderAfterWaterfallModeHandle = function(){
		var self = this;
        self.resetLoading(self.$pullUp);
        
        self.correctView();
        
        setTimeout(function() {
          self.iScroll.refresh();
        }, 100);
        
        
        var len = $('.am-list-item-desced', self.parentNode).length;
        
        if(len == 0){
        	self.$pullUp.remove();
        }
        
        if(this.page.next == this.page.pageTotal){
      	  this.$pullUpLabel.text('已经到最后了');
        }
        
		if(this.renderAfter){
			this.renderAfter();
		}
	}
	
	/**
	 * 枢模式渲染Dom之后执行
	 */
	ListView.prototype.renderAfterPivotModeHandle = function(){
		
		if(this.scrollView){
			this.scrollView.refresh();
		}
		
		if(this.renderAfter){
			this.renderAfter();
		}
	}
	
	ListView.prototype.handlePullUp = function(){
        if (this.page.next < this.page.pageTotal) {
          this.setLoading(this.$pullUp);
          this.page.pageNo = this.page.next += 1;
          this.loadNextPage();
          if(this.page.next == this.page.pageTotal){
        	  this.$pullUpLabel.text('已经到最后了');
          }
        } else {
        	
        }
	}
	
	/**
	 * 向下拽刷新所有内容(后续开发)
	 */
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
	
	
	ListView.prototype.bindIScroll = function(){
		console.log('this.parentNode='+this.parentNode+'   this.type='+this.type);
		var self = this;
        var iscroll = self.iScroll = new IScroll(self.parentNode, {
			click : true
		});
          
  	    var self = this;
  	    var pullFormTop = false;
  	    var pullStart;
  	    
  	    iscroll.on('scrollStart', function() {
              if (this.y >= self.topOffset) {
                pullFormTop = true;
              }

              pullStart = this.y;
        });

  	    iscroll.on('scrollEnd', function() {
              if (pullFormTop && this.directionY === -1) {
              	//self.handlePullDown();
              }
              pullFormTop = false;

              if (pullStart === this.y && (this.directionY === 1)) {
              	self.handlePullUp();
              }
        });
	}
	
	
	/**
	 * 组装URL
	 */
	ListView.prototype.getUrl = function(){
//        var queries = ['callback=?'];
        var queries = [];
        for (var key in  this.params) {
          if (this.params[key]) {
            queries.push(key + '=' + this.params[key]);
          }
        }
        this.page.next
        queries.push(this.page.pageNoField + '=' + this.page.pageNo);
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
        	self.page.pageTotal = data[self.page.pageTotalField];
            var html = self.renderList(data[self.page.result]);
            self.$list.html(html);
            self.renderAfterHandle();
            self.correctView();
        }, function() {
            console.log('Error...')
        });
	}
	
	/**
	 * 重新加载
	 */
	ListView.prototype.reload = function(options){
		this.setParams(options);
		this.page.pageNo = 1;
		this.page.pageTotal = 0;
		
		this.$main          = $(this.parentNode);
		this.$main.html('');
		this.$warpiscroll   = $("<div>", {'id' : 'warp-iscroll'})
		$(this.$warpiscroll, this.parentNode).append(this.bodyContext());
		$(this.$warpiscroll, this.parentNode).append(this.pullUpTpl());
		this.$warpiscroll.appendTo(this.$main);
		
		this.$list          = this.$main.find('#events-list');
		this.$pullDown      = this.$main.find('#pull-down');
		this.$pullDownLabel = this.$main.find('#pull-down-label');
		this.$pullUp        = this.$main.find('#pull-up');
		this.$pullUpLabel = this.$main.find('#pull-up-label');
		this.topOffset      = -this.$pullDown.outerHeight();
		this.bindIScroll();
		this.load();
	}
	
	
	/**
	 * 加载
	 */
	ListView.prototype.loadNextPage = function(){
		var self = this;
        $.getJSON(self.getUrl()).then(function(data) {
        	self.page.pageTotal = data[self.page.pageTotalField];
            var html = self.renderList(data[self.page.result]);
            self.$list.append(html);
            self.correctView();
        }, function() {
            console.log('Error...')
        }).always(function() {
              self.resetLoading(self.$pullUp);
             // self.iScroll.scrollTo(0, self.topOffset, 800, $.AMUI.iScroll.utils.circular);
        });
 
	}
	
	
	/**
	 * 纠正视图
	 */
	ListView.prototype.correctView = function(){
		var self = this;
        document.body.style.position = 'fixed';
        var size = 5;
        var intervalId = setInterval(function() {
        	self.refresh();
        	if((--size) === 0){
        		document.body.style.position = '';
        		clearInterval(intervalId);
        	}
        }, 200);
	}
	
	/**
	 * 刷新iScroll触摸效果
	 */
	ListView.prototype.refresh = function(){
		this.iScroll.refresh();
	}
	
	/**
	 * 激活
	 */
	ListView.prototype.setActivateOn = function(){
		var transform = {
				'transition-duration' : '.2s',
				'transition-timing-function' : 'linear',
				'transform' : 'translate(0px, 0px)'
		};
		this.$main.css(transform);
	}
	
	/**
	 * 关闭
	 */
	ListView.prototype.setActivateOff = function(){
		var x = document.body.clientWidth;
		var transform = { 
				'display' : 'none',
				'transition-duration' : '0s',
				'transition-timing-function' : 'linear',
				'transform' : 'translate('+x+'px, 0px)'
		};
		this.$main.css(transform);
	}
	
	ListView.prototype.onActivate = function(activate){
		var self = this;
		if(activate == true){
			this.$main.css('display', 'block');
			var timeoutId = setTimeout(function() {
				self.setActivateOn();
				clearTimeout(timeoutId);
			}, 100);
			return;
		}
		
		if(activate == false){
			this.setActivateOff();
			return;
		}
	}
	
	ListView.prototype.setActivate = function(){
 
		var activate = this.view.getAttr('activate');
		switch(activate){
			case 'true'  :  this.setActivateOn(); break;
			case 'false' :  this.setActivateOff(); break;
			default : break;
		}
	}
	
	
	ListView.prototype.setPage = function(options){
		var self  = this;
		self.page =  self.page || {};
		$.extend(self.page, options);
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
				result          : '',   // 服务应用返回列表集合 在json属性键值 , set load data collection in json field
				pageNo          : 0,    // 开始页码
				pageSize        : 0, // 每页记录数量
				pageNoField     : 'pageNum',   // 服务应用接收pageNo 变量名
				pageSizeField   : 'pageSize',	// 服务应用接收pageSize 变量名
				pageTotalField  : 'lastPageNumber'    // 服务应用返回pageTotal 在json中的属性键值
			},
			params : { //加载列表数据的查询条件
				
			}
		},
		
		events: {
			
		},
 
		setup: function() {
			var self = this;
			var parentNode = self.getAttr('parentNode'),
			    type       = self.getAttr('type'),
				data       = self.getAttr('data');
			
			
			var listView = new ListView();
			listView.initConfiguration(self);
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
		},
		
		/**
		 * 刷新触摸布局
		 * 只支持 Waterfall 模式
		 */
		refreshTouchLayout : function(){
			var listView = this.getAttr('listView');
			if(listView.type == ViewAttributes.Type.Waterfall){
				listView.refresh();
			}
		},
		
		/**
		 * 是否激活
		 */
		onActivate : function(activate){
			var listView = this.getAttr('listView');
			listView.onActivate(activate);
		}
		
	});
}));
 