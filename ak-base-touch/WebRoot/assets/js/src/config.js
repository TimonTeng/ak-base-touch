/**
 <ZA-Mall Config> JavaScript Document
 -> Version : 1.0
 -> Require : RequireJS
 -> Copyright © 2015 za-mall. All rights reserved.
 */

	requirejs.config({
	
		baseUrl: window.mainPath+'/assets/',
		
		paths: {
			'jquery'           : 'js/lib/jquery.min',
			'swipe'  		   : 'js/lib/jquery.touchSwipe',
			'underscore' 	   : 'js/lib/underscore',
			'lodash'           : 'js/lib/lodash',
			'handlebars'       : 'js/lib/handlebars.min',
			'template'         : 'js/lib/template',
			'backbone'         : 'js/lib/backbone',
			'backbone.view'    : 'js/lib/backbone.view',
			'amazeui'		   : 'js/lib/amazeui.min',
			'alphabetBar' 	   : 'js/widget/alphabet-bar',
			'actionBar'		   : 'js/widget/action-bar',
			'listView'		   : 'js/widget/list-view'
		},
		
		shim: {
			'amazeui'   : { deps: ['jquery'] },
	        'actionBar' : {
	        	deps: ['underscore','lodash', 'handlebars', 'backbone', 'backbone.view', 'swipe', 'alphabetBar']
	        },
			'listView' : {
				deps: ['underscore','lodash', 'handlebars', 'backbone', 'backbone.view','swipe']
			}
		},
		
		urlArgs: 'v='+new Date()
	});