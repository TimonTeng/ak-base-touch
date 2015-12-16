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
		    document.addEventListener('touchmove', function(e) {
		        e.preventDefault();
		    }, false);
		},
		
		refresh : function(){
			var self = this;
			var iscroll = self.getAttr('iscroll');
			iscroll.refresh();
		}
		
		
	});
}));
 