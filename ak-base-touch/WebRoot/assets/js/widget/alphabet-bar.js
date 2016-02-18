/**
 * 字母导航元件
 * Alphabet Bar Class
 * @Require: jQuery
 * @Extend:
 */

!(function(root, factory){
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

		root.AlphabetBar = factory(root.AlphabetBar);
	}
	
})(this, function($, _, Backbone, View, Template){
	'use strict'
	
	
	var AlphabetBarView = function(){
		
		this.root           = $("<div>", {'id' : 'alphabetNavBar', 'class' : 'am-plugin-alphabet-nav'});
		this.backgroundView = $("<div>", {'class' : 'am-plugin-alphabet-nav-bg'});
		this.alphabetBox    = $("<ul>", {'class' : ''});
		this.tip		    = $("<div>", {'class' : 'am-plugin-alphabet-nav-tip'});
		this.alphabetText   = null;
		this.backgroundView.appendTo(this.root);
		this.alphabetBox.appendTo(this.root);
		
		/**
		 * 导航控制的选择空间视图
		 */
		this.selectView = null;
		
		this.tractionScroll = null;
		
		this.$dataView = null;
		
	}
	
	/**
	 * 装配字母到导航栏
	 * @param alphabetText
	 */
	AlphabetBarView.prototype.putAlphabet = function(alphabetText){
		var alphabet = $("<li>",{});
		alphabet.text(alphabetText);
		alphabet.appendTo(this.alphabetBox);
	}
	
	/**
	 * 导航条定位高度
	 * @param viewHeight
	 */
	AlphabetBarView.prototype.positionHeight = function(positionHeight){
		positionHeight -= 10;
		this.root.css({height : positionHeight});
		this.backgroundView.css({height : positionHeight});
		this.alphabetBox.css({height : positionHeight});
		this.alphabetItemHeight = positionHeight/26;
		this.alphabetBox.find('li').css({height : this.alphabetItemHeight});
	}
	
	/**
	 * 绑定视图控件
	 */
	AlphabetBarView.prototype.bindSelectView = function(selectView){
		this.selectView = selectView;
	}
	
	/**
	 * 
	 */
	AlphabetBarView.prototype.bindTractionScroll = function(scroll){
		this.tractionScroll = scroll;
	}
	
	AlphabetBarView.prototype.bind$DataView = function($dataView){
		this.$dataView = $dataView;
	}
	
	
	/**
	 * 定位字母在屏幕Y轴坐标位置
	 */
	AlphabetBarView.prototype.positionAlphabetOffsetY = function(){
		
		var self = this;
        $.each($('li', this.alphabetBox), function(){
            var top = parseInt($(this).offset().top);
            var position = top+',';
            var height = parseInt(self.alphabetItemHeight);
            for(var i = 1; i <= height; i++){
                 position +=(top+i)+',';
            }
            $(this).attr('data-position', position);
       });
		
	}
	
	/**
	 * 展示字母导航栏前参数设置
	 */
	AlphabetBarView.prototype.displaySetting = function(){
		this.tip.removeClass('am-plugin-alphabet-nav-tip-active');
		this.tip.removeClass('am-plugin-alphabet-nav-tip-destroy');
	}
	
	
	/**
	 * 渲染至元素内部
	 * @param element
	 */
	AlphabetBarView.prototype.renderTo = function(element, positionHeight){
		
		this.positionHeight(positionHeight);
		this.displaySetting();
		this.root.appendTo(element);
		this.tip.appendTo(element);
		this.positionAlphabetOffsetY();
		this.onTouchStart();
		this.onTouchEnd();
		this.onSwipe();
	}
	
	/**
	 * 按下字母触发
	 */
	AlphabetBarView.prototype.onTouchStart = function(){
		var self = this;
        $('li', self.alphabetBox).unbind('touchstart').bind('touchstart', function(e){
        	 $(self.tip).text($(e.target).text());
        	 $(self.tip).css('display', 'block');
        	 $(self.tip).addClass('am-plugin-alphabet-nav-tip-active');
        	 $(self.tip).removeClass('am-plugin-alphabet-nav-tip-destroy');
        	 $('li', self.root).css('color','#AAA');
        	 $(e.target).css('color', '#E60012');
        	 var positionAlphabet = $('#warp_alphabet_'+$(e.target).text(), self.$dataView);
        	 self.tractionScroll.scrollToElement($(positionAlphabet).get(0), 10, 0, -5);
        });
 
	}
	
	/**
	 * 释放按下的字母
	 */
	AlphabetBarView.prototype.onTouchEnd = function(){
		var self = this;
        $('li', self.alphabetBox).unbind('touchend').bind('touchend', function(e){
        	$(self.tip).addClass('am-plugin-alphabet-nav-tip-destroy');
        	$(self.tip).removeClass('am-plugin-alphabet-nav-tip-active');
        	
	       	setTimeout(function() {
	    		 $(self.tip).css('display', 'none');
	    	}, 350);
        });
	}
	
	
	/**
	 * 滑动字母导航条触发
	 */
	AlphabetBarView.prototype.onSwipe = function(){
		
		var self = this;
		var alphabetNavBarOffsetTop = parseInt(self.root.offset().top);
		$('li', self.root).swipe({

           swipeStatus : function(event, phase, direction, distance, duration, fingers) {
        	   
               var pageY = parseInt(event.touches[0].pageY);
	           var alphabet = $('li[data-position^='+pageY+']', self.alphabetBox);
	           if(!alphabet || pageY < alphabetNavBarOffsetTop || alphabet.text() == ''){
	           		return;
	           }
	             
               var alphabetText = alphabet.text();
               if(self.alphabetText != alphabetText){
            	   
                    self.alphabetText = alphabetText;
                    $('li', self.root).css('color','#AAA');
                    $(alphabet).css('color', '#E60012');
                    self.tip.text(alphabetText);
                    var positionAlphabet = $('#warp_alphabet_'+self.alphabetText, self.$dataView);
                    self.tractionScroll.scrollToElement($(positionAlphabet).get(0), 10, 0, -5);
               }
               
           },
           
           threshold: 0,
           
           maxTimeThreshold: 1000*60,
           
           fingers:$.fn.swipe.fingers.ALL
       });
	}
	
	var Model = Backbone.Model.extend({
		idAttribute: 'AlphabetBar',
		defaults : {
			apiUrl : ''
		}
	});
	
	return View.extend({
		
		id: 'AlphabetBarView',
		
		model: new Model,
		
		attrs: {
			template: null
		},
		
		events: {
			 
		},
		
		alphabet : ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
		
		/**
		 * 字母提示内容
		 */
		alphabetText : '#',
		
		alphabetBarView : null,
 
		setup: function() {
			
			var self = this;
			
			var parentNode = self.getAttr('parentNode'),
			    type       = self.getAttr('type'),
				data       = self.getAttr('data');
			self.structure();
		},
		
		structure : function(){
			
			var self = this;
			var alphabetBarView = new AlphabetBarView();
			for(var i = 0; i < self.alphabet.length; i++){
				alphabetBarView.putAlphabet(self.alphabet[i]);
			}
			self.alphabetTip = $("<div>", {'class' : 'am-plugin-alphabet-nav-tip'});
			self.alphabetTip.text('#');
			self.setAttr('alphabetBarView', alphabetBarView);
			self.alphabetBarView = alphabetBarView;
		},
		
		renderTo : function(element, positionHeight){
			var alphabetBarView = this.getAttr('alphabetBarView');
			alphabetBarView.renderTo(element, positionHeight);
		},
		
		bindTractionScroll : function(scroll){
			var alphabetBarView = this.getAttr('alphabetBarView');
			alphabetBarView.bindTractionScroll(scroll);
		},
		
		bind$DataView : function($dataView){
			var alphabetBarView = this.getAttr('alphabetBarView');
			alphabetBarView.bind$DataView($dataView);
		}
		
		
	});
	
});
