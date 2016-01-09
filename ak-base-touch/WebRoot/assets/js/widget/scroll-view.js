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
			var parentNode = this.getAttr('parentNode');
			var style      = this.getAttr('style');
			var $main      = $(parentNode);
			
	        var iscroll = new IScroll(parentNode, {
			      click : true
		    });
	        
	        this.setAttr('iscroll', iscroll);
	        if(style){
	        	$main.css(style);
	        }
 
	        var activate = this.activate = this.getAttr('activate') || 'true';
 
	        if(activate){
	    		switch(activate){
	    			case 'true'  :  this.setActivateOn(); break;
	    			case 'false' :  this.setActivateOff(); break;
	    			default : break;
	    		}
	        }
	        
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
			var self = this;
			var iscroll = self.getAttr('iscroll');
			iscroll.refresh();
		},
		
		/**
		 * 激活
		 */
		setActivateOn : function(){
			 
			var transform = {
					'transition-duration' : '.2s',
					'transition-timing-function' : 'linear',
					'transform' : 'translate(0px, 0px)'
			};
			var parentNode = this.getAttr('parentNode');
			$(parentNode).css(transform);
		},
		
		/**
		 * 关闭
		 */
		setActivateOff : function(){
			 
			var x = document.body.clientWidth;
			var transform = { 
					'display' : 'none',
					'transition-duration' : '0s',
					'transition-timing-function' : 'linear',
					'transform' : 'translate('+x+'px, 0px)'
			};
			var parentNode = this.getAttr('parentNode');
			$(parentNode).css(transform);
		},
		
		onActivate : function(activate){
			var self = this;
			if(activate == true){
				var parentNode = this.getAttr('parentNode');
				$(parentNode).css('display', 'block');
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
		
		
	});
}));
 