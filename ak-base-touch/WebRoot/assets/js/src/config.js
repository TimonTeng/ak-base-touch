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
			'listView'		   : 'js/widget/list-view',
		    'scrollView'	   : 'js/widget/scroll-view',
		    'sidebar'	   	   : 'js/widget/sidebar',
		    'sideFrameView'	   : 'js/widget/sideframe-view',
		    'contextView'	   : 'js/widget/context-view',
		    'headerNavigate'   : 'js/widget/header-navigate',
		    'addressSelector'  : 'js/widget/address-selector'
		},
		
		shim: {
			'amazeui'   : { 
				deps: ['jquery']
			},
			
	        'actionBar' : {
	        	deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view', 'swipe', 'alphabetBar']
	        },
	        
			'listView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe']
			},
			
			'sideFrameView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe']
			},
			
			'contextView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe']
			},
			
			'sidebar' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe']
			},
			
			'headerNavigate' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe']
			},
			
			'addressSelector' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe', 'sidebar']
			}
		},
		
		urlArgs: 'v='+new Date()
	});