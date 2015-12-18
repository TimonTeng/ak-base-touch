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
			var parentNode = self.getAttr('parentNode');
			var style      = self.getAttr('style');
			var $main      = $(parentNode);
			
	        var iscroll = new $.AMUI.iScroll(parentNode, {
			      click : true
		    });
	        
	        self.setAttr('iscroll', iscroll);
	        
	        $main.css(style);
	        $main.css('display', 'block');
	        
	        self.activate = true;
	        var activate = self.getAttr('activate');
	        
	        if(activate){
	        	this.activate = activate;
	        	self.onActivate(activate);
	        }
	        
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
		 * 是否激活
		 */
		onActivate : function(activate){
			
			var self = this;
			var parentNode = self.getAttr('parentNode');
			var x = 0;
			if(activate == true || activate == 'true'){
				var transform = {
						'transition-duration' : '.2s',
						'transition-timing-function' : 'linear',
						'transform' : 'translateX('+x+'px)',
						'position' : 'fixed'
				};
				$(parentNode).css(transform);
			}
			if(activate == false || activate == 'false'){
				x = document.body.clientWidth;
				var transform = { 
						'transition-duration' : '0s',
						'transition-timing-function' : 'linear',
						'position' : 'fixed',
						'transform' : 'translateX('+x+'px)'
				};
				$(parentNode).css(transform);
			}
		}
		
		
	});
}));
 