/**
 -> Version : 1.0
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
			'actionBar1'	   : 'js/widget/action-bar-1.0',
			'actionBar2'	   : 'js/widget/action-bar-2.0',
			'listView'		   : 'js/widget/list-view',
		    'scrollView'	   : 'js/widget/scroll-view',
		    'sidebar'	   	   : 'js/widget/sidebar',
		    'sideFrameView'	   : 'js/widget/sideframe-view',
		    'sideSelectView'   : 'js/widget/sideselect-view',
		    'sideGridView'     : 'js/widget/sidegrid-view',
		    'sideFormView'     : 'js/widget/sideform-view',
		    'toolbar'   	   : 'js/widget/toolbar',
		    'contextView'	   : 'js/widget/context-view',
		    'headerNavigate'   : 'js/widget/header-navigate',
		    'zoneSelector'     : 'js/widget/zone-selector',
		    'photoGroupView'   : 'js/widget/photo-group-view'
		},
		
		shim: {
			'amazeui'   : { 
				deps: ['jquery']
			},
			
			'scrollView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view', 'swipe']
			},
			
	        'actionBar2' : {
	        	deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view', 'swipe', 'alphabetBar']
	        },
	        
			'listView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view', 'swipe', 'alphabetBar']
			},
			'contextView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe']
			},
			
			'sidebar' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe']
			},
			
			'sideFrameView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe', 'sidebar']
			},
			
			'sideGridView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe', 'sidebar']
			},
			
			'sideSelectView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe', 'sidebar']
			},
			
			'sideFormView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe', 'sidebar', 'sideSelectView']
			},
			
			'headerNavigate' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe']
			},
 
			'zoneSelector' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe', 'sidebar', 'alphabetBar']
			},
			
			'toolbar' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view','swipe']
			},
			
			'photoGroupView' : {
				deps: ['underscore', 'lodash', 'handlebars', 'backbone', 'backbone.view', 'swipe']
			}
		},
		
		urlArgs: 'v='+new Date()
	});