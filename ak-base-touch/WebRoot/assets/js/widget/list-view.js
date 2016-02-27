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
					Template = require('template'),
				 AlphabetBar = require('alphabetBar');
					
				return factory($, _, Backbone, View, Template, AlphabetBar);
			});
		
		} else if (define.cmd) {

			define(function(require, exports, module) {
				
				var $        = require('jquery'),
				    _        = require('lodash'),
					Backbone = require('backbone'),
					View     = require('backbone.view'),
					Template = require('template'),
				AlphabetBar = require('alphabetBar');
				
				return factory($, _, Backbone, View, Template, AlphabetBar);
			});
		}
		
	} else {

		root.listView = factory(root.listView);
	}
	
}(this, function($, _, Backbone, View, Template, AlphabetBar) {
	'use strict'

	var ViewAttributes = {
		Type : {
			'Waterfall' : 'waterfall',
			'Pivot'	    : 'pivot',
			'Alphabet'  : 'alphabet'
		} 
    };
	
	var ListView = function(){
		
		 this.type   = ViewAttributes.Type.Waterfall;//默认使用瀑布流分页模式
		 this.apiUrl = 
	     this.parentNode = 
		 this.$main = this.$list = this.$pullDown = this.$pullDownLabel = this.$pullUp = this.$pullUpLabel = this.topOffset = 
		 this.style = this.page = this.params = this.view = this.displayField = null;
		 this.iScroll = null;
		 this.activate = true;//是否激活状态
		 this.template = null;
		 
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
		 
		 this.doLoad = true;
		 
		 this.alphabetBar = null;
		 
		 this.renderAfter = null;
		 this.scrollEnd = null;
		 this.loadedHtml = '';
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
		this.displayField= view.getAttr('displayField');
		this.doLoad      = view.getAttr('doLoad') === 'false' ? false : true; //开始是否加载数据 true = 加载 , false 不加载
		this.template    = view.getAttr('template');
		
		if(this.style){
			this.$main.css(this.style);
		}
		
		if(type && type != ''){
			this.type = type;
		}
		
		if(this.doLoad){
			switch(this.type){
			case ViewAttributes.Type.Waterfall :  this.initWaterfallMode(); break;
			case ViewAttributes.Type.Pivot 	   :  this.initPivotMode(); break;
			case ViewAttributes.Type.Alphabet  :  this.initAlphabetMode(); break;
			default : break;
			}
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
		
		this.scrollEndPolicy();
		this.bindIScroll();
		this.setActivate();
		this.load();
	}
	
	/**
	 * 枢模式初始化
	 */
	ListView.prototype.initPivotMode = function(){
		this.$warpiscroll = $("<div>", {'id' : 'warp-iscroll'});
		$(this.$warpiscroll, this.parentNode).append(this.bodyContext());
		this.$warpiscroll.appendTo(this.$main);
		this.$list      = this.$main.find('#events-list');
		this.scrollView = this.view.getAttr('scrollView');
		
		this.scrollEndPolicy();
		if(this.doLoad){
			this.setActivate();
			this.load();
		}
	}
	
	/**
	 * 字母导航模式初始化
	 * 不存在分页功能
	 */
	ListView.prototype.initAlphabetMode = function(){
		this.$warpiscroll = $("<div>", {'id' : 'warp-iscroll'})
		$(this.$warpiscroll, this.parentNode).append(this.bodyContext());
		$(this.$warpiscroll, this.parentNode).append(this.pullUpTpl());
		this.$warpiscroll.appendTo(this.$main);
		
		this.$list          = this.$main.find('#events-list');
		this.$pullDown      = this.$main.find('#pull-down');
		this.$pullDownLabel = this.$main.find('#pull-down-label');
		this.$pullUp        = this.$main.find('#pull-up');
		this.$pullUpLabel   = this.$main.find('#pull-up-label');
		this.topOffset      = -this.$pullDown.outerHeight();
		
		this.scrollEndPolicy();
		this.bindIScroll();
		this.setActivate();
		this.setAlphabetBar();
		this.loadAlphabetData();
	}
	
	/**
	 * 设置字母导航组件
	 */
	ListView.prototype.setAlphabetBar = function(){
		var height = this.$main.height();
		var alphabetBar = new AlphabetBar();
		alphabetBar.bindTractionScroll(this.iScroll);
		alphabetBar.bind$DataView(this.$main);
		alphabetBar.renderTo(this.$main, height);
		this.alphabetBar = alphabetBar;
	}
	
	
	/**
	 * 渲染Dom之后处理入口
	 */
	ListView.prototype.renderAfterHandle = function(){
		var self = this;
		switch(this.type){
			case ViewAttributes.Type.Waterfall : this.renderAfterWaterfallModeHandle(); break;
			case ViewAttributes.Type.Pivot 	   : this.renderAfterPivotModeHandle(); break;
			case ViewAttributes.Type.Alphabet  : this.renderAfterAlphabetModeHandle(); break;
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
		
		this.listenerImageOnload();
		this.imageLazyLoad();
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
		
		this.listenerImageOnload();
		this.imageLazyLoad();
	}
	
	/**
	 * 字母导航模式渲染Dom之后执行
	 */
	ListView.prototype.renderAfterAlphabetModeHandle = function(){
		var self = this;
        self.resetLoading(self.$pullUp);
        self.correctView();
        
        self.$pullUp.remove();
 
		if(this.renderAfter){
			this.renderAfter();
		}
		
		this.listenerImageOnload();
		this.imageLazyLoad();
		
	}
	
	/**
	 * 监听图片加载完成事件, 刷新滚动条长度
	 */
	ListView.prototype.listenerImageOnload = function(){
		var self = this;
		$('img', this.$main).unbind('load').bind('load', function(e){
			self.refresh();
		});
	}
	
	/**
	 * list中的图片延迟加载设置
	 */
	ListView.prototype.imageLazyLoad = function(){
		$('img', this.loadedHtml).lazyload({
			effect : 'fadeIn',
			threshold : 350
		});
	}
	
	/**
	 * 向上拽
	 */
	ListView.prototype.handleSwipeUp = function(){
		var iscroll = this.iScroll;
		var maxScrollY = iscroll.maxScrollY;
		var startY     = iscroll.startY;
		var offsetY    = 200;
		var nextPage   = (startY < (maxScrollY+offsetY)) ? true : false;
		if(nextPage){
			this.getNextPage();
		}
	}
	
	/**
	 * 向下拽刷新所有内容
	 */
	ListView.prototype.handleSwipeDown = function(){
		var iscroll = this.iScroll;
		var startY  = iscroll.startY;
		if(startY > 0){
			this.reload();
		}
	}
	
	ListView.prototype.pullDownTpl = function(){
		return "<div class=\"pull-action loading\" id=\"pull-down\">"+
			        "<span class=\"am-icon-arrow-down pull-label\" id=\"pull-down-label\">下拉刷新</span>"+
			        "<span class=\"am-icon-spinner am-icon-spin\"></span><span>正在加载内容</span>"+
	           "</div>";
	}
	
	ListView.prototype.pullUpTpl = function(){
		return "<div class=\"pull-action loading\" id=\"pull-up\">"+
		"<span class=\"am-icon-arrow-down pull-label\" id=\"pull-up-label\">上拉加载更多</span>"+
		"<span class=\"am-icon-spinner am-icon-spin\"></span><span>正在加载内容</span>"+
		"</div>";
	}
	
	ListView.prototype.bodyContext = function(){
		return "<ul class=\"am-list\" id=\"events-list\"></ul>";
	}
	
	ListView.prototype.setLoading = function($el) {
		if($el)
			$el.addClass('loading');
	};
	

	ListView.prototype.resetLoading = function($el) {
		if($el)
			$el.removeClass('loading');
	};
	
	
	/**
	 * scrollEndPolicy
	 */
	ListView.prototype.scrollEndPolicy = function(){
		var self = this;
		switch(self.type){
			case ViewAttributes.Type.Waterfall : self.scrollEnd = function(){
	    	    //pull down
	    		if(this.directionY === -1){
	    			self.handleSwipeDown();
	    		}
	    		//pull up
	    		if(this.directionY === 1){
	    			self.handleSwipeUp();
	    		}
	    		
	    		$(self.parentNode).trigger('scroll');
	    		
			}; break;
			case ViewAttributes.Type.Alphabet : self.scrollEnd = null; break;
			case ViewAttributes.Type.Pivot : self.scrollEnd = null; break;
		}
	}
	
	
	/**
	 * console.log("scrollStart y:{%s} startY:{%s} maxScrollY:{%s} absStartY:{%s} distY:{%s} directionY:{%s} pointY:{%s}", this.y,this.startY,this.maxScrollY,this.absStartY,this.distY,this.directionY,this.pointY);
	 */
	ListView.prototype.bindIScroll = function(){
		if(this.isPivotMode()){
			return;
		}
		
		var self = this;
		
		if(this.iScroll){
			this.iScroll.destroy();
		}
		
        var iscroll = this.iScroll = new IScroll(self.parentNode, {
        	click : true
		});
        
        if(self.scrollEnd){
        	iscroll.on('scrollEnd', self.scrollEnd);
        }
  	    
	}
	
	
	/**
	 * 组装URL
	 */
	ListView.prototype.getUrl = function(){
        var queries = [];
        for (var key in  this.params) {
          if (this.params[key]) {
            queries.push(key + '=' + this.params[key]);
          }
        }
        queries.push(this.page.pageNoField + '=' + this.page.pageNo);
        queries.push(this.page.pageSizeField + '=' + this.page.pageSize);
        return this.apiUrl + '?' + queries.join('&');
	}
	
	/**
	 * 渲染内容
	 */
	ListView.prototype.renderList = function(data){
		var template = Template.compile(this.template, data);
		return template;
	}
	
	/**
	 * 素材元素渲染
	 */
	ListView.prototype.renderMaterialElement = function(type, record){
		switch(type){
			case 0 : return $('<li>', {'data-object' : JSON.stringify(record)});
			case 3 : return $("<div>",{ 'id' : 'warp_alphabet_'+record.code, 'class' : 'warp_alphabet_mark'});
			case 4 : return $("<div class='warp_alphabet_title'><li><h2>"+record.code+"</h2></li></div>");
			case 5 : return $("<ul>",{ 'id' : 'warp_u_'+record.code, 'class' : 'warp_context'});
			case 6 : return $("<ul>",{ 'id' : 'warp_u_'+record.code, 'class' : 'warp_context'});
		}
	}
 
 
	/**
	 * 加载
	 */
	ListView.prototype.load = function(){
		var self = this;
        $.getJSON(self.getUrl()).then(function(data) {
        	self.page.pageTotal = data[self.page.pageTotalField];
        	self.createLoadedPageHtmlBox();
        	self.loadedHtml.html(self.renderList(data[self.page.result]));
            self.loadedHtml.appendTo(self.$list);
            self.renderAfterHandle();
            self.correctView();
        }, function() {
            console.log('Error...')
        });
	}
	
	/**
	 * 
	 */
	ListView.prototype.loadAlphabetData = function(){
		var self = this;
        $.getJSON(self.getUrl()).then(function(data) {
        	var store = data[self.page.result];
        	
        	store.forEach(function(record, i) {
				var $codeWrap  = self.renderMaterialElement(3, record);
				var $codeTag   = self.renderMaterialElement(4, record);
				var $codeTagUl = self.renderMaterialElement(5, record);
				var data = record.data;
				if(data){
					data.forEach(function(dataItem, i) {
						var $dataNode = self.renderMaterialElement(0, dataItem);
						if(self.template){
							var html = self.renderList(dataItem);
							$dataNode.html(html);
						}else{
							$dataNode.text(dataItem[self.displayField]);
						}
						$dataNode.appendTo($codeTagUl);
					});
				}
				$codeTagUl.appendTo($codeTag);
				$codeTag.appendTo($codeWrap);
				$codeWrap.appendTo(self.$list);
			});
        	
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
		
		this.scrollEndPolicy();
		this.bindIScroll();
		this.load();
	}
	
	
	/**
	 * 
	 */
	ListView.prototype.createLoadedPageHtmlBox = function(){
		this.loadedHtml = $('<div>', {});
	}
	
	/**
	 * 加载
	 */
	ListView.prototype.loadNextPage = function(){
		var self = this;
        $.getJSON(self.getUrl()).then(function(data) {
        	self.page.pageTotal = data[self.page.pageTotalField];
        	self.createLoadedPageHtmlBox();
        	self.loadedHtml.html(self.renderList(data[self.page.result]));
            self.loadedHtml.appendTo(self.$list);
            self.renderAfterHandle();
            self.correctView();
        }, function() {
            console.log('Error...')
        }).always(function() {
              self.resetLoading(self.$pullUp);
        });
 
	}
	
	
	/**
	 * 获取下一页数据
	 */
	ListView.prototype.getNextPage = function(){
		
		if (this.page.next < this.page.pageTotal) {
	          this.setLoading(this.$pullUp);
	          this.page.pageNo = this.page.next += 1;
	          this.loadNextPage();
	          if(this.page.next == this.page.pageTotal){
	        	  this.$pullUpLabel.text('已经到最后了');
	          }
		} 
	}
	
	
	/**
	 * 纠正视图
	 */
	ListView.prototype.correctView = function(){
		if(this.isPivotMode()){
			this.scrollView.refresh();
			return;
		}
		var self = this;
        document.body.style.position = 'absolute';
        var size = 5;
        var intervalId = setInterval(function() {
			self.refresh();
        	if((--size) <= 0){
        		document.body.style.position = '';
        		clearInterval(intervalId);
        	}
        }, 250);
	}
	
	/**
	 * 
	 */
	ListView.prototype.isPivotMode = function(){
		if(this.type === ViewAttributes.Type.Pivot){
			return true;
		}
		return false;
	}
	
	
	/**
	 * 刷新iScroll触摸效果
	 */
	ListView.prototype.refresh = function(){
		if(this.isPivotMode()){
			this.scrollView.refresh();
			return;
		}
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
		 * 加载数据
		 */
		load : function(params){
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
		},
		
		/**
		 * 加载下一页内容
		 */
		getNextPage : function(){
			var listView = this.getAttr('listView');
			listView.getNextPage();
		}
		
	});
}));
 