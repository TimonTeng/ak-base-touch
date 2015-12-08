/**
 * Image Gallery Class
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
		idAttribute: 'imageGallery',
		defaults : {
			apiUrl : '',
			loadModelData : function(view){

			}
		}
	});
		
	return View.extend({
		
		id: '',
		model: new Model,
		attrs: {
			template: 'assets/template/widget/image-gallery.tpl'
		},
		events: {
			
		},
		
		setup: function() {
			
			var self = this;
			var parentNode = null,
			    type       = self.getAttr('type'),
				data       = self.getAttr('data');
		},
		
		
		registerClose : function(){
			var self = this;
			var gallery = self.getAttr('parentNode');
			$('[data-am-modal-close]').unbind('click').bind('click', function(){
				$(gallery).addClass('am-animation-leftsidepopup-hide');
				var timeID = setTimeout(function() {
					$(gallery).remove();
					clearTimeout(timeID);
					$('#image-panel').modal('close');
				}, 200);
			});
		},
		
		actions : function(){
			
			var self = this;
			var Hammer = $.AMUI.Hammer;
			$('.am-slides').find('li').each(function(){
				var hammertime = new Hammer($(this).get(0));
				hammertime.on("press", function(e){
					$('.am-modal-actions').addClass('am-modal-active');
					$('.am-modal-actions').find('[am-imagepanel-close]').unbind('click').bind('click', function(){
						$('.am-modal-actions').removeClass('am-modal-active');
					});
				});
			});
			
		},
		
		slider : function(){
			$('.am-slider').flexslider({
				'slideshow' : false,
				'controlNav' : false,
				'after' : function(){
				}
			});
		},
		
		show : function(){
			
			var self    = this;
			var gallery = self.getAttr('parentNode');
			$("#image-panel").modal({closeViaDimmer: 0});
			$(gallery).appendTo('[data-am-dimmer]');
			
			var timeID = setTimeout(function() {
				$(gallery).addClass('am-animation-leftsidepopup-show');
				clearTimeout(timeID);
			}, 100);
			var h1_style = {color : 'white'};
			$("#data-am-imagepanel").find("h1").css(h1_style);
		},
		
		modal : function(){
 
			var self = this;
			self.setAttr('parentNode', $("<div>",{'id' : 'data-am-imagepanel', 'class' : 'am-animation-leftsidepopup'}));
			self.render();
			self.show();
			self.registerClose();
			self.actions();
			self.slider();
		},
		
		open: function(clickEl) {
			
			var self   = this;
			var id     = $(clickEl).data('id');
			var apiUrl = self.getAttr('apiUrl');
			$.getJSON(apiUrl, { 'homeworkId': id }, function(data) {
				var loadModelData = self.getAttr('loadModelData');
				loadModelData(self, data);
				self.modal();
			}).error(function() {
				console.log('Ajax Request Error!');
			});
		}
	});
}));
 