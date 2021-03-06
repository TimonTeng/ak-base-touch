/**
 * Photo Group View Class
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
					View     = require('backbone.view');
					
				return factory($, _, Backbone, View);
			});
		
		} else if (define.cmd) {

			define(function(require, exports, module) {
				
				var $        = require('jquery'),
				    _        = require('lodash'),
					Backbone = require('backbone'),
					View     = require('backbone.view');
				
				return factory($, _, Backbone, View);
			});
		}
		
	} else {

		root.scrollView = factory(root.scrollView);
	}
	
}(this, function($, _, Backbone, View) {
	'use strict'
	
	var PopupMenu = function(){
		this.$body = this.$mark = null;
	}
	
	/**
	 * 
	 */
	PopupMenu.prototype = {
		
		holdElement : null,
		
		menu : [],
		
		menuSize : 0,
		
		menuElement : {}
	}
	
	/**
	 * 
	 * @param view
	 */
	PopupMenu.prototype.initConfiguration = function(view){
		this.menu     = view.getAttr('menu');
		this.menuSize = this.menu ? this.menu.length : 0;
		this.initMenu();
	}
	
	/**
	 * 
	 */
	PopupMenu.prototype.initMenu = function(){
		this.createBody();
		this.createMark();
		this.createMenu();
	}
 
	/**
	 * 
	 */
	PopupMenu.prototype.createMenu = function(){
		var self = this;
		var menuUl = $('<ul>');
		this.menu.forEach(function(item, index) {
			var itemLi = self.createMenuItem(item, index);
			menuUl.append(itemLi);
		});
		menuUl.append(this.createCancelMenuItem());
		menuUl.appendTo(this.$body);
	}
	
	PopupMenu.prototype.createMenuItem = function(item, index){
		var itemLi = $('<li>', {
			text : item.title,
			popupMenuItem : ''
		});
		itemLi.attr('index', index);
		this.menuElement[index] = item;
		return itemLi;
	}
	
	/**
	 * 
	 */
	PopupMenu.prototype.createCancelMenuItem = function(){
		var self = this;
		var cancelItem = $('<li>', {text : '取消', 'class' : 'popupmenu-cancel'});
		return cancelItem;
	}
	
	/**
	 * 
	 */
	PopupMenu.prototype.initBodyHeight = function(){
		var defaultHeight = 65;
		var menuItemHeight = 45;
		var bodyHeight = defaultHeight+(menuItemHeight*this.menuSize);
		return bodyHeight;
	}
	
	/**
	 * 
	 */
	PopupMenu.prototype.createBody = function(){
		this.$body = $('<div>', {
			id : 'popupmenu-body',
			'class' : 'popupmenu-body'
		});
		
		var bodyHeight = this.initBodyHeight();
		
		var style = {
			width : '100%',
			height : bodyHeight,
			background : 'rgba(0,0,0,0.3)',
			position : 'fixed',
			zIndex : 9999,
			transitionDuration : '0.2s',
			transitionTimingFunction : 'linear',
			transform : 'translate(0px, 240px)',
			bottom : 0
		};

		this.$body.css(style);
	}
	
	/**
	 * 
	 */
	PopupMenu.prototype.createMark = function(){
		this.$mark = $('<div>', {
			id : 'popupmenu-mark'
		});
		
		var style = {
			width : '100%',
			background : '#000',
			opacity : '0.3',
			position : 'fixed',
			zIndex : 9000,
			bottom : 0,
			top : 0
		};
		
		this.$mark.css(style);
	}
	
	/**
	 * 
	 */
	PopupMenu.prototype.display = function(){
		console.log('PopupMenu.prototype.display = '+this.holdElement.src);
	}
	
	/**
	 * 
	 */
	PopupMenu.prototype.hidden = function(){
		this.$mark.remove();
		this.bodyAnimationHide();
	}
	
	/**
	 * 
	 */
	PopupMenu.prototype.show = function(element){
		this.holdElement = element;
		var self = this;
		if(this.$mark){
			this.$mark.appendTo(document.body);
			$.touchEvent(this.$mark, document.body, {
				end : function(event){
					self.hidden();
				}
			});
		}
		
		if(this.$body){
			this.$body.appendTo(document.body);
			this.bodyAnimationShow();
			
			$.touchEvent('.popupmenu-cancel', this.$body, {
				end : function(e){
					self.hidden();
				}
			});
			
			$.touchEvent('[popupMenuItem]', this.$body, {
				
				start : function(e){
					$(e.target).css({
						background : 'rgba(186,186,186, 0.9)'
					});
				},
				
				move : function(e){
					$(e.target).css({
						background : 'rgba(250,252,253,0.9)'
					});
				},
				
				end : function(e){
					var index = e.target.getAttribute('index');
					var itemConfig = self.menuElement[index];
					if(itemConfig.handler){
						itemConfig.handler(self.holdElement);
					}
					self.hidden();
					
					$(e.target).css({
						background : 'rgba(250,252,253,0.9)'
					});
				}
			});
		}
		
	}
	
	
	/**
	 */
	PopupMenu.prototype.bodyAnimationHide = function(){
		var self = this;
		var y = this.$body.height();
		var transform = { 
				'transform' : 'translate(0px, '+y+'px)'
		};
		setTimeout(function() {
			self.$body.css(transform);
		}, 100);
	}
	
	/**
	 */
	PopupMenu.prototype.bodyAnimationShow = function(){
		var self = this;
		var y = this.$body.height();
		var transform = { 
			'transform' : 'translate(0px, 0px)'
		};
		setTimeout(function() {
			self.$body.css(transform);
		}, 100);
	}
	
	PopupMenu.prototype.destory = function(){
		this.$body.remove();
		this.$mark.remove();
	}
	
	/**
	 * 
	 */
	var Plugins = Plugins || function(){
		this.contextField = null;
		this.$body = this.$context = this.$tools = null;
	}
	
	/**
	 * 
	 */
	Plugins.prototype = {
		photoGroupView : null,
		items : [],
		meshItem : {},
	}
	
	/**
	 * 
	 */
	Plugins.prototype.initConfiguration = function(view, photoGroupView){
		this.photoGroupView = photoGroupView;
		this.items = view.getAttr('plugins').items || null;
		this.contextField = view.getAttr('plugins').contextField || null;
		this.createBody();
		this.createContext();
		this.createTools();
		this.createMeshItem();
	}
	
	/**
	 * 
	 */
	Plugins.prototype.createBody = function(){
		this.$body = $('<div>', {id : 'plugins-body'});
		var style = {
			position : 'absolute',
			zIndex : 4999,
			width : '100%',
			height : 'auto',
			background : 'rgba(0,0,0,0.3)',
			fontSize : '1.3rem',
			fontWeight : 500,
			color : 'white',
			bottom : 0
		};
		this.$body.css(style);
	}
	
	/**
	 * 
	 */
	Plugins.prototype.createContext = function(){
		this.$context = $('<div>', { id : 'plugins-context' , 'class' : 'plugins-context'});
	}
	
	/**
	 * 
	 */
	Plugins.prototype.createTools = function(){
		this.$tools = $('<div>', { id : 'plugins-tools' , 'class' : 'plugins-tools am-g'});
	}
	
	
	/**
	 * 
	 */
	Plugins.prototype.changeContext = function(object){
		this.$context.text(object[this.contextField]);
	}
	
	
	/**
	 * 
	 */
	Plugins.prototype.bindTouchEvent = function(){
		var self = this;
		for(var id in this.meshItem){
			if(this.meshItem[id].touch){
				this.meshItem[id].attr('touch', true);
			}
		}
		
		$('[touch]', this.$tools).unbind('touchend').bind('touchend', function(event){
			var item = self.meshItem[event.target.getAttribute('id')];
			var currentPhotoEl = self.photoGroupView.getCurrentPhotoEl();
			item.touch(event, currentPhotoEl.object);
		});
	}	
	
	/**
	 * 
	 */
	Plugins.prototype.createMeshItem = function(){
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
			$mesh.appendTo(self.$tools);
			var touch = config.touch || undefined;
			if(typeof(touch) == 'function'){
				$mesh.touch = touch;
			}
			var render = config.render || undefined;
			if(typeof(render) == 'function'){
				$mesh.render = render;
			}
			self.meshItem[config.id] = $mesh;
		});
	}
	
	/**
	 * 定义网格
	 * @param digit
	 */
	Plugins.prototype.defineMeshClass = function(digit){
		if(digit >= 1 && digit <= 12){
			return 'am-u-sm-'+digit;
		}else{
			return 'am-u-sm-12';
		}
	}
	
	
	/**
	 * 
	 */
	Plugins.prototype.renderTo = function(element){
		this.$context.appendTo(this.$body);
		this.$tools.appendTo(this.$body);
		this.$body.appendTo(element);
		this.bindTouchEvent();
	}
	
	
	Plugins.prototype.destory = function(){
		this.$body.remove();
	}
	
	/**
	 * 
	 */
	Plugins.prototype.executeItemRender = function(object){
		for(var id in this.meshItem){
			if(this.meshItem[id].render){
				this.meshItem[id].render(this.meshItem[id], object);
			}
		}
	}

	var PhotoGroupView = PhotoGroupView || function(){
		this.parentNode = null;
		this.pageScroller = null;
		this.$indicator = null;
		this.$viewport = null;
		this.$wrapper = null;
		this.$scroller = null;
		this.$pagination = null;
		this.$targetPhotoEl = null;
		this.$clonePhotoEl = null;
		this.$currentPhotoEl = null;
		
		this.popupMenu = null;
		this.plugins = null;
	}
	
	PhotoGroupView.prototype = {
			
		/**
		 * 存储元素集合
		 */
		photoElementsSize : 0 ,
		
		/**
		 * 存储元素对象集合
		 */
		photoElementMap : {},
		
		/**
		 * 获取图片元素数量
		 */
		getSize : function(){
			return this.photoElementsSize;
		}
		
	}
	
	/**
	 * 初始
	 */
	PhotoGroupView.prototype.initConfiguration = function(view){
		this.parentNode = view.getAttr('parentNode');
		var menu    = view.getAttr('menu');
		var plugins = view.getAttr('plugins');
		if(menu){
			this.popupMenu = new PopupMenu();
			this.popupMenu.initConfiguration(view);
		}
		if(plugins){
			this.plugins = new Plugins();
			this.plugins.initConfiguration(view, this);
		}
	}
	
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.createZoomScroller = function(id){
		var self = this;
		var zoomScroller = new IScroll('#'+id, {
			click : true
//			zoom: true,
//			scrollX: true,
//			scrollY: true,
//			mouseWheel: true,
//			wheelAction: 'zoom'
		});
		
		zoomScroller.on('zoomStart', function() {
			self.pageScroller.options.scrollX = false;
		});
		
		zoomScroller.on('zoomEnd', function() {
			self.pageScroller.options.scrollX = true;
		});
		return zoomScroller;
	}
	
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.createPagination = function(){
		
		var pagination = this.$pagination = $('<div>', {id : 'pagination'});
		var paginationStyle = {
			position : 'absolute',
			top : 10,
			width : '100%',
			height : 30,
			zIndex : 3999
		}; 
		
		var paginationLayout = $('<div>', {id : 'pagination-layout'});
		var paginationLayoutStyle = {
				width : 80,
				height : 30,
				lineHeight : '30px',
				color : 'white',
				fontSize: '2rem',
				fontWeight: '800',
				textAlign: 'center',
				margin: '0 auto',
				touchCallout : 'none',
				userSelect   : 'none',
				textSizeAdjust : 'none',
				'border-radius' : '25px',
				'-moz-border-radius' : '25px',
				'-webkit-border-radius' : '25px',
				background : 'rgba(0,0,0,0.3)'
		}; 
		
		paginationLayout.css(paginationLayoutStyle);
		paginationLayout.appendTo(this.$pagination);
		this.$pagination.css(paginationStyle);
		this.$pagination.appendTo(this.$viewport);
 
	}
	
	
	/**
	 * 创建触摸滚动条
	 */
	PhotoGroupView.prototype.createPageScroller = function(){
		
		var self = this;
		
		if(this.pageScroller){
			this.pageScroller.destroy();
			this.pageScroller = null;
		}

		this.pageScroller = new IScroll('#photo-group-wrapper', {
			scrollX: true,
			scrollY: false,
			momentum: false,
			snap: true,
			snapSpeed: 500,
			keyBindings: true
		});
		
		this.rewriteScrollerPages();
		
		/**
		 * 
		 */
		this.pageScroller.on('scrollEnd', function() {
			var pageNum = self.getPageNumber();
			self.setPaginationSize(pageNum);
			self.$currentPhotoEl = self.photoElementMap[pageNum-1];
			self.changePluginsData();
		});
		
	}
	
	
	PhotoGroupView.prototype.changePluginsData = function(){
		if(this.plugins && this.$currentPhotoEl.object){
			this.plugins.changeContext(this.$currentPhotoEl.object);
			this.plugins.executeItemRender(this.$currentPhotoEl.object);
		}
	}
	
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.rewriteScrollerPages = function(){
	   var pages = this.pageScroller.pages;
	   var offset = 10;
	   for(var i = 0; i < pages.length; i++){
		   offset = 10 * i;
		   pages[i][0].x = (pages[i][0].x-offset) ;
		   pages[i][0].cx = (pages[i][0].cx-offset) ;
	   }
	   this.pageScroller.pages = pages;
	}
	
	/**
	 * 查找图片组元素
	 */
	PhotoGroupView.prototype.queryPhotoGroupElement = function(photoEl){
		var photoGroupEl = this.queryPhotoGroupNode(photoEl);
		return photoGroupEl;
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.queryPhotoGroupNode = function(element){
		var returnVal = null;
		if(element.hasAttribute('photoGroup')){
			returnVal = element;
		}else{
			var parentNode = element.parentNode;
			if(!parentNode){
				return null;
			}
			returnVal = this.queryPhotoGroupNode(parentNode);
		}
		return returnVal;
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.getCurrentPhotoEl = function(){
		return this.$currentPhotoEl;
	}
	
	/**
	 * 收集组里的图片元素
	 */
	PhotoGroupView.prototype.collectPhotoElements = function(groupEl){
		var self = this;
		var photoElements = $('[photoElement]', groupEl);
		this.photoElementsSize = photoElements.length;
		photoElements.each(function(index){
			var cloneNode = this.cloneNode();
			cloneNode.removeAttribute('class');
			cloneNode.removeAttribute('style');
			cloneNode.removeAttribute('id');
			cloneNode.setAttribute('pageNum', index);
			
			var object = cloneNode.getAttribute('data-object');
			if(object){
				cloneNode.object = eval("("+object+")");
			}
			
			var originalSrc = cloneNode.getAttribute('photo-original');
			
			self.photoElementMap[index] = cloneNode;
			
			if(originalSrc){
				cloneNode.src = originalSrc;
				var targetOriginalSrc = self.$targetPhotoEl.getAttribute('photo-original');
				if(targetOriginalSrc === originalSrc){
					self.$clonePhotoEl = cloneNode;
					self.$currentPhotoEl = cloneNode;
				}
			}else{
				if(self.$targetPhotoEl.src === cloneNode.src){
					self.$clonePhotoEl = cloneNode;
					self.$currentPhotoEl = cloneNode;
				}
			}
 
		});
		return photoElements;
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.createViewport = function(){
		var viewport = this.$viewport = $('<div>', {
			id : 'photo-group-viewport'
		});
		var style = {
			position : 'fixed',
			overflow : 'hidden',
			top : '0px',
			bottom : '0px',
			width : '100%',
			zIndex : 3999,
			background : '#000'
		};
		this.$viewport.css(style);
		return viewport;
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.createWrapper = function(){
		var wrapper = this.$wrapper = $('<div>', {
			id : 'photo-group-wrapper'
		});
		var style = {
			width : '100%',
			height : '100%'
		};
		this.$wrapper.css(style);
		return wrapper;
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.createScroller = function(){
		var scroller = this.$scroller = $('<div>', {
			id : 'photo-group-scroller'
		});
		var style = {
			width  : '100%',
			height : '100%',
			position     : 'absolute',
			transform    : 'translateZ(0)',
			touchCallout : 'none',
			userSelect   : 'none',
			textSizeAdjust : 'none',
			zIndex : 1
		}
		this.$scroller.css(style);
		return scroller;
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.createPhotoElements = function(){
		var viewportWidth = this.$viewport.width();
		var photoUl = $('<ul>');
		for(var index in this.photoElementMap){
			var photoEl = this.photoElementMap[index];
			
			photoEl.width = viewportWidth;
			var photoLi = $('<li>', {
				style : 'float : left; margin-right : 10px; height : 100%; overflow: hidden;'
			});
			
			var photoWrapper = $('<div>', {
				id : 'photo'+index,
				style : 'overflow: hidden; width : 100%; height : 100%; line-height : '+this.$viewport.height()+'px;'
			});
			
			var photoWrapperTransform = $('<div>');
			photoWrapperTransform.append(photoEl);
			photoWrapperTransform.appendTo(photoWrapper);
			
			photoWrapper.appendTo(photoLi);
			photoLi.appendTo(photoUl);
		}
		
		var scrollerWidth = (viewportWidth+10)*this.photoElementsSize;
		
		var photoUlStyle = {
			width : scrollerWidth,
			height : '100%',
			background : '#000'
		};
		
		photoUl.css(photoUlStyle);
		
		this.$scroller.css('width', scrollerWidth);
		
		photoUl.appendTo(this.$scroller);
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.setPaginationSize = function(number){
		if(number > this.getSize()){
			number = this.getSize();
		}
		$('div', this.$pagination).text(number+'/'+this.getSize());
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.getPageNumber = function(){
		var pageNumber = this.pageScroller.currentPage.pageX+1;
		return pageNumber;
	}
	
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.destory = function(){
		this.$scroller.remove();
		this.$wrapper.remove();
		this.$viewport.remove();
		
		if(this.pageScroller){
			this.pageScroller.destroy();
			this.pageScroller = null;
		}
		
		this.popupMenu.destory();
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.display = function(){
		var self = this;
		this.createPageScroller();
		$.touchEvent('img', '#photo-group-scroller', {
			end : function(e){
				self.destory();
			}
		}, {
			execulteStart : true,
			
			executeTime : 200,
			
			press : function(e){
				self.popupMenu.show(e.target);
			}
		});
		
		//绑定缩放功能
		for(var index in this.photoElementMap){
			this.createZoomScroller('photo'+index);
		}
		
		this.showScalePhoto();
	}
	
	PhotoGroupView.prototype.showScalePhoto = function(){
		var pageNum = this.$clonePhotoEl.getAttribute('pageNum');
		this.pageScroller.goToPage(parseInt(pageNum), 0, 1);
		$(this.$clonePhotoEl).addClass('photo-scale');
		this.changePluginsData();
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.appendToDocument = function(){
		this.$scroller.appendTo(this.$wrapper);
		this.$wrapper.appendTo(this.$viewport);
		this.$viewport.appendTo(document.body);
		if(this.plugins){
			this.plugins.renderTo(this.$viewport);
		}
	}
	
	/**
	 * 
	 */
	PhotoGroupView.prototype.show = function(photoEl){
		
		var self = this;
		
		self.$targetPhotoEl = photoEl;
		var groupEl = this.queryPhotoGroupElement(photoEl);
		var photoElements = this.collectPhotoElements(groupEl);
		
		this.createViewport();
		this.createWrapper();
		this.createScroller();
		
		this.createPagination();
		this.setPaginationSize(1);
		this.appendToDocument();
		this.createPhotoElements();
		this.display();
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
 
		setup: function() {
			var self = this;
			var photoGroupView = new PhotoGroupView();
			photoGroupView.initConfiguration(self);
			self.setAttr('photoGroupView', photoGroupView);
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		},
		
		show : function(photoEl){
			var self = this;
			var photoGroupView = self.getAttr('photoGroupView');
			photoGroupView.show(photoEl);
		},
		
		destory : function(){
			var self = this;
			var photoGroupView = self.getAttr('photoGroupView');
			photoGroupView.destory();
		}
		
	});
}));
 