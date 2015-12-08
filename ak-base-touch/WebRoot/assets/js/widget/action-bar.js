/**
 * Action Bar Class
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
  		
	var Model = Backbone.Model.extend({
		idAttribute: 'ActionBar',
		defaults : {
			apiUrl : '',
			actions : [
		         {
					id : '',
					title : '',
					condition : '',
					type : '',
					url : ''
		         }
			]
		}
	});
	
	
	/**
	 * 字母导航对象
	 */
	var alphabetNavBar = {
			/**
			 * 选中的action
			 */
			activeActionItem : null,
			
			/**
			 * 组件el
			 */
			elContainer : new Array(),
			
			/**
			 * iscroll 对象容器
			 */
			iscrolls : new Array(),
			
			/**
			 * 
			 */
			alphabet : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
			
			/**
			 * 导航条
			 */
			alphabetNav : null,
			
			/**
			 * 字母提示层
			 */
			alphabetTip : null,
			
			/**
			 * 字母提示内容
			 */
			alphabetText : '#',
			
			/**
			 * 
			 */
			alphabetNavSetup : function(){
				var self = this;
				var alphabetNavBar   = $("<div>", {'id' : 'alphabetNavBar', 'class' : 'am-plugin-alphabet-nav'}); 
				var alphabetNavBarBg = $("<div>", {'class' : 'am-plugin-alphabet-nav-bg'});
				$(alphabetNavBarBg).appendTo(alphabetNavBar);
				var ul = $("<ul>", {'class' : ''});
				for (var i = 0; i < self.alphabet.length; i++) {
					var alp = $("<li>",{}).text(self.alphabet[i]);
					$(alp).text(self.alphabet[i]);
					$(alp).appendTo(ul);
				}
				$(ul).appendTo(alphabetNavBar);
				self.alphabetNav = alphabetNavBar;
				
				var alphabetTip  = $("<div>", {'class' : 'am-plugin-alphabet-nav-tip'});
				alphabetTip.text('#');
				self.alphabetTip = alphabetTip;
				
			}
	};
		
	return View.extend({
		
		id: '',
		
		model: new Model,
		
		attrs: {
			
			template: 'assets/template/widget/base-action-bar.tpl'
		},
		
		events: {
			'click a:first-child' : 'onExpand'
		},
		
		setup: function() {
			
			var self = this;
			var parentNode = self.getAttr('parentNode'),
			    type       = self.getAttr('type'),
				data       = self.getAttr('data');
			
			var actions = self.getAttr('actions');
			for(var i = 0; i < actions.length; i++){
				switch(actions[i].type){
					case 'base' : self.base(actions[i]); break;
					default : break;
				}
			}
			
			self.parentNodePosition = {
					width :  $(parentNode).width(),
					height : $(parentNode).height(),
					top :    $(parentNode).offset().top,
					left :   $(parentNode).offset().left,
					right :  $(parentNode).offset().right,
					bottom : $(parentNode).offset().bottom,
					screen : {
						width : window.screen.width,
						height : window.screen.height
					}
			};
			
			self.alphabetNavSetup();
			document.addEventListener('touchmove', function(e) {
				if(self.activeActionItem != null){
					e.preventDefault();
				} 
			}, false);
 
		},
		
		parentNodePosition : {
			width :  0,
			height : 0,
			top :    0,
			left :   0,
			right :  0,
			bottom : 0
		},
		
		/**
		 * 选中的action
		 */
		activeActionItem : null,
		
		/**
		 * 组件el
		 */
		elContainer : new Array(),
		
		/**
		 * iscroll 对象容器
		 */
		iscrolls : new Array(),
		
		/**
		 * 
		 */
		alphabet : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
		
		/**
		 * 导航条
		 */
		alphabetNav : null,
		
		/**
		 * 字母提示层
		 */
		alphabetTip : null,
		
		/**
		 * 字母提示内容
		 */
		alphabetText : '#',
		
		/**
		 * 
		 */
		alphabetNavSetup : function(){
			var self = this;
			var alphabetNavBar   = $("<div>", {'id' : 'alphabetNavBar', 'class' : 'am-plugin-alphabet-nav'}); 
			var alphabetNavBarBg = $("<div>", {'class' : 'am-plugin-alphabet-nav-bg'});
			$(alphabetNavBarBg).appendTo(alphabetNavBar);
			var ul = $("<ul>", {'class' : ''});
			for (var i = 0; i < self.alphabet.length; i++) {
				var alp = $("<li>",{}).text(self.alphabet[i]);
				$(alp).text(self.alphabet[i]);
				$(alp).appendTo(ul);
			}
			$(ul).appendTo(alphabetNavBar);
			self.alphabetNav = alphabetNavBar;
			
			var alphabetTip  = $("<div>", {'class' : 'am-plugin-alphabet-nav-tip'});
			alphabetTip.text('#');
			self.alphabetTip = alphabetTip;
			
		},
		
		/**
		 * 
		 */
		base : function(action){
			
			var self = this;
			var data = self.getModel('data');
			if(!data || data == ''){
				data = new Array();
			}
			data.push(action);
			self.setModel('data', data);
 
		},
		
		/**
		 * 弹出层
		 */
		popup : function(){
			
			var self = this;
			var popup = $("<div>",{'class' : 'am-plugin-popup'});
			$(popup).appendTo(document.body);
			self.banScrollTouchmove(popup);
			self.elContainer.push(popup);
		},
		
		/**
		 * 展示ActionBar 容器
		 * 
		 */
		showActionBarContainer : function(){
			
			var self = this;
			var container = $("<div>",{'class' : 'am-plugin-actionbar-container'});
			$(container).appendTo(document.body);
			self.createChildContainer(container);
			self.elContainer.push(container);
		},
		
		/**
		 * 创建子容器
		 */
		createChildContainer : function(parentContainer){
			
			var self = this;
			var offset = 60 + 86;
			var ht = $(parentContainer).height() - offset;
			
			var l = $("<div>",{'class' : 'am-plugin-actionbar-container-l', 'id' : 'left'});
			var r = $("<div>",{'class' : 'am-plugin-actionbar-container-r', 'id' : 'right'});
			$(l).css({height : ht});
			$(r).css({height : ht});
			$(l).appendTo(parentContainer);
			$(r).appendTo(parentContainer);
			
			var b = $("<div>",{'class' : 'am-plugin-actionbar-container-b am-vertical-align  am-cf'});
			$(b).css({bottom : 86});
			$(b).html("<button type='button' id='pageY' class='am-btn am-btn-danger'>确认</button>");
			$(b).appendTo(parentContainer);
			
			var lcontext = $("<div id='contextl'></div>");
			var rcontext = $("<div id='contextr'></div>");
			
			for(var a = 0 ; a < self.alphabet.length; a++){
				var wrapAlphabet = $("<div>",{ 'id' : 'warp_alphabet_'+self.alphabet[a], 'class' : 'warp_alphabet_mark'});
				var hd = $("<div><li><h2>"+self.alphabet[a]+"</h2></li></div>");
				$(hd).appendTo(wrapAlphabet);
				var apt = $("<ul>",{ 'id' : 'warp_u_'+self.alphabet[a]});
				for(var i =0 ; i< 50; i++){
					$(apt).append("<li>"+i+"</li>");
				}
				$(apt).appendTo(wrapAlphabet);
				$(wrapAlphabet).appendTo(lcontext);
			}
			
			$(lcontext).appendTo(l);
			$(rcontext).appendTo(r);
			 
			var iScroll = $.AMUI.iScroll;
			var lScroll = new iScroll('#left', {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: true
			});
			
			var rScroll = new iScroll('#right', {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: true
			});
			self.iscrolls.push(lScroll);
			self.iscrolls.push(rScroll);
			
			$(self.alphabetNav).appendTo(parentContainer);
			$(self.alphabetTip).appendTo(parentContainer);
 
			
			var alphabetNavBarOffsetTop = parseInt($('#alphabetNavBar').offset().top);
			
			$.each($("#alphabetNavBar li"), function(){
				var top = parseInt($(this).offset().top);
				var position = top+',';
				for(var i = 1; i <= 18; i++){
					position +=(top+i)+',';
				}
				$(this).attr('data-position', position);
			});
			
			$.each($('.warp_alphabet_mark'), function(){
				var top = $(this).offset().top;
				$(this).attr('data-position', top);
			});
 
			$("#alphabetNavBar li").unbind('touchstart').bind('touchstart', function(e){
				 console.log($(e.target).text());
				 $(self.alphabetTip).text($(e.target).text());
				 var positionAlphabet = $('#warp_alphabet_'+$(e.target).text());
				 lScroll.scrollToElement($(positionAlphabet).get(0), 10, 0, -32);
			});
			
			$("#alphabetNavBar li").unbind('touchend').bind('touchend', function(e){
				console.log($(e.target).text());
				if($(self.alphabetTip).text() == $(e.target).text()){
					$(self.alphabetTip).text('');
				}
			});

			$("#alphabetNavBar li").swipe({
 
				swipeStatus:function(event, phase, direction, distance, duration, fingers) {
					var pageY = parseInt(event.touches[0].pageY)-20;
					try {
						$('#pageY').text(parseInt(event.touches[0].pageY));
					} catch (e) {
						$('#pageY').text('error');
					}
					var alphabet = $('li[data-position^='+pageY+']');
					if(!alphabet || pageY < alphabetNavBarOffsetTop ||$(alphabet).text() == ''){
						return;
					}
					
					var alphabetText = $(alphabet).text();
					if(self.alphabetText != alphabetText){
						self.alphabetText = alphabetText;
						$("#alphabetNavBar li").css('color','#AAA');
						$(alphabet).css('color', '#E60012');
						$(self.alphabetTip).text(self.alphabetText);
						
						var positionAlphabet = $('#warp_alphabet_'+self.alphabetText);
						
						lScroll.scrollToElement($(positionAlphabet).get(0), 10, 0, -32);
					}
 
			    },
				threshold: 0,
				maxTimeThreshold: 1000*60,
				fingers:$.fn.swipe.fingers.ALL
			});
			
		},
 
		/**
		 *  禁止触摸滚动条滚动
		 * @param element
		 */
		banScrollTouchmove : function(el){
			$(el).bind("touchmove",function(e){  
				e.preventDefault();  
			}, false);
		},
		
		/**
		 * 销毁Action Item
		 */
		destroyAction : function(){
			
			var self = this;
			var activeActionItem = self.activeActionItem;
			$(activeActionItem).attr('status', '0');
			$(activeActionItem).removeClass('am-plugin-actionbar-active');
			
			for(var index in self.elContainer){
				$(self.elContainer[index]).remove();
			}
			for(var index in self.iscrolls){
				self.iscrolls[index].destroy();
			}
			self.elContainer = new Array();
			self.iscrolls = new Array();
			self.activeActionItem = null;
 
		},
		
		/**
		 * 销毁选中的Action Item
		 */
		destroyActiveAction : function(nowActiveAction){
			
			var self   = this;
			var status = $(self.activeActionItem).attr('status');
			
			var nowCondition = $(nowActiveAction).data('condition'),
				oldCondition = $(self.activeActionItem).data('condition');
			
			if(self.activeActionItem != null){
				self.destroyAction();
				if(nowCondition == oldCondition && status == '1'){
					return false;
				}else{
					return true;
				}
			}else{
				return true;
			}
		},
		
		/**
		 * 激活ActionItem
		 */
		activeAction : function(){
			
			var self = this;
			$(self.activeActionItem).addClass('am-plugin-actionbar-active');
			$(self.activeActionItem).attr('status', '1');
			self.showActionBarContainer();
			
		},
		
		/**
		 * 展开下选框
		 */
		onExpand : function(e){
			
			var self = this;
			var nowActiveItem = $(e.target).parent();
			var status    	  = $(nowActiveItem).attr('status');
			var activeStatus  = self.destroyActiveAction(nowActiveItem);
			if(!activeStatus){
				return;
			}
 
			self.activeActionItem = nowActiveItem;
			switch(status){
				case '0' :  self.activeAction();break;
				case '1' :  self.destroyAction(); break;
				default :   self.activeAction(); break;
			}
			
		} 
		
	});
}));
 