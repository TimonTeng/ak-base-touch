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
		this.backgroundView.appendTo(this.root);
		this.alphabetBox.appendTo(this.root);
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
		 * 导航条
		 */
		alphabetBarView : null,
		
		/**
		 * 字母提示层
		 */
		alphabetTip : null,
		
		/**
		 * 字母提示内容
		 */
		alphabetText : '#',
 
		setup: function() {
			
			var self = this;
			
			var parentNode = self.getAttr('parentNode'),
			    type       = self.getAttr('type'),
				data       = self.getAttr('data');
			
			self.structure();
		},
		
		
		
		structure : function(){
			
			var self = this;
			self.alphabetBarView = new AlphabetBarView();
			for(var i = 0; i < self.alphabet.length; i++){
				self.alphabetBarView.putAlphabet(self.alphabet[i]);
			}
			
		}
		
	});
	
});