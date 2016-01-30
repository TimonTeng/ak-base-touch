/**
 * Scroll View Class
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

	var Model = Backbone.Model.extend({
		idAttribute: '',
		defaults : {}
	});
	
	var ScrollView = function(){
		this.view = this.parentNode = this.style = this.activate = null;
		this.$main = this.iscroll = null;
	}
	
	ScrollView.prototype.initConfiguration = function(view){
		this.view       = view;
		this.parentNode = view.getAttr('parentNode');
		this.style      = view.getAttr('style');
		this.$main      = $(this.parentNode);
		this.activate   = new Boolean(view.getAttr('activate') || true);
        if(this.style){
        	this.$main.css(this.style);
        }
        this.createScroll();
	}
	
	ScrollView.prototype.refresh = function(){
		this.correctView();
		this.iscroll.refresh();
	}
	
	ScrollView.prototype.setActivateOn = function(){
		var transform = {
				'transition-duration' : '.2s',
				'transition-timing-function' : 'linear',
				'transform' : 'translate(0px, 0px)'
		};
		$(this.parentNode).css(transform);
	}
	
	ScrollView.prototype.setActivateOff = function(){
		var x = document.body.clientWidth;
		var transform = { 
				'display' : 'none',
				'transition-duration' : '0s',
				'transition-timing-function' : 'linear',
				'transform' : 'translate('+x+'px, 0px)'
		};
		$(this.parentNode).css(transform);
	}
	
	ScrollView.prototype.onActivate = function(activate){
		var self = this;
		if(activate == true){
			$(self.parentNode).css('display', 'block');
			var timeoutId = setTimeout(function() {
				self.setActivateOn();
				clearTimeout(timeoutId);
			}, 100);
			return;
		}
		if(activate == false){
			self.setActivateOff();
			return;
		}
	}
	
	ScrollView.prototype.createScroll = function(){
		
		var self = this;
		
		self.iscroll = new IScroll(this.parentNode, {
		      click : true
	    });
		
        self.iscroll.on('scrollStart',function(){
            if(!!document.activeElement){
                window.scrollTo(0, 0);
                document.activeElement.blur();
            }
        });
        
        self.iscroll.on('scrollEnd', function() {
    	    //pull down
    		if(this.directionY === -1){
    			self.listenerScrollTop(this);
    		}
    		//pull up
    		if(this.directionY === 1){
    			self.listenerScrollBottom(this);
    		}
    		$(self.parentNode).trigger('scroll');
        });
	}
	
	/**
	 * 监听滚动至顶部事件
	 */
	ScrollView.prototype.listenerScrollTop = function(iscroll){
		var startY  = iscroll.startY;
		if(startY > 0){
			if(this.events.scrollTop instanceof Function){
				this.events.scrollTop();
			}
		}
	}
	
	/**
	 * 监听滚动至底部事件
	 */
	ScrollView.prototype.listenerScrollBottom = function(iscroll){
		var maxScrollY = iscroll.maxScrollY;
		var startY     = iscroll.startY;
		var offsetY    = 200;
		var onScrollBottom   = (startY < (maxScrollY+offsetY)) ? true : false;
		if(onScrollBottom){
			if(this.events.scrollBottom instanceof Function){
				this.events.scrollBottom();
			}
		}
	}
	
	
	/**
	 * 纠正视图
	 */
	ScrollView.prototype.correctView = function(){
		var self = this;
        document.body.style.position = 'fixed';
        var size = 5;
        var intervalId = setInterval(function() {
        	self.iscroll.refresh();
        	if((--size) <= 0){
        		document.body.style.position = '';
        		clearInterval(intervalId);
        	}
        }, 250);
	}
	
	/**
	 * 
	 */
	ScrollView.prototype.events = {
		scrollTop : 'scrollTop',
		scrollBottom : 'scrollBottom'
	}
	
	/**
	 * scrollTop
	 * scrollBottom
	 */
	ScrollView.prototype.on = function(eventName, callback){
		var event = this.events[eventName];
		if(!event){
			throw new Error('Not defined '+eventName+' event');
		}
		this.events[eventName] = callback;
	}
	
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
			var scrollView = new ScrollView();
			scrollView.initConfiguration(self);
			self.setAttr('scrollView', scrollView);
	        
	        var formElement = {
		        	'INPUT'  : 'INPUT',
		        	'TEXTAREA' : 'TEXTAREA'
            };
	 
	        document.addEventListener('touchend', function(e) {
	        	if(document.activeElement.tagName in formElement){
	        		document.activeElement.blur();
	        	}
	        }, false);
 
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		},
		
		refresh : function(){
			var scrollView = this.getAttr('scrollView');
			scrollView.refresh();
		},
		
		/**
		 * 激活
		 */
		setActivateOn : function(){
			var scrollView = this.getAttr('scrollView');
			scrollView.setActivateOn();
		},
		
		/**
		 * 关闭
		 */
		setActivateOff : function(){
			var scrollView = this.getAttr('scrollView');
			scrollView.setActivateOff();
		},
		
		/**
		 * 激活
		 */
		onActivate : function(activate){
			var scrollView = this.getAttr('scrollView');
			scrollView.onActivate(activate);
		},
		
		/**
		 * scrollTop
		 * scrollBottom
		 */
		on : function(eventName, callback){
			var scrollView = this.getAttr('scrollView');
			scrollView.on(eventName, callback);
		}
	});
}));
 