/**
 * @package Handlebars Service 模板服务
 * @author <gzzhiyi@126.com>
 * @version 1.0.0-beta
 * @dependencies [Handlebars]
 * @description
 *
 * 对 Handlebars 的二次封装，主要添加：
 * 1. 异步加载文件功能
 * 2. 异步缓存功能与缓存刷新功能
 *
 * 该服务请求 HTML 模板将会 block 页面，就是说将 async 执行 Ajax
 */
 
!(function(root, factory) {
	'use strict'
  
	if ('function' === typeof define) {
		
		if (define.amd) {
		
			define(['jquery', 'handlebars'], function($, Handlebars) {

				return factory($, Handlebars);
			});
		
		} else if (define.cmd) {

			define(function(require, exports, module) {
				
				var $ = require('jquery'),
					Handlebars = require('handlebars');
				
				return factory($, Handlebars);
			});
		}
		
	} else {

		root.Utils = factory(root.Utils);
	}
	
}(this, function($, Handlebars) {
	'use strict';

	/**
	 * cache - 模板缓存
	 * @example: { name: <html string> }  内容为值对
	 */
	var cache = {};
	
	/**
	 * function compile - 模板编译
	 * @param   path       {String}   模板路径
	 * @param   data       {Object}   模板数据
	 * @param   overwrite  {Boolean}  是否重写模板
	 * @return  response   {String}   返回模板HTML
	 */
	var compile = function(path, data, overwrite) {
		
		var response = '';
		
		for (name in cache) {  // 检查模板是否已缓存
			
			if (name === 'path')  response = cache[name];
		}
		
		if (overwrite || !response) {
		
			$.ajax({
				
				url      : path,
				type     : 'GET',
				async    : false,
				success  : function(context) {
					
					var tpl = Handlebars.compile(context);
					response = tpl(data);
				},
				error: function() {
					
					console.log('模板编译失败！')
				}
			});
		}
		
		return response;
	};

	/**
	 * helper compare
	 * @param   left      {String} | {Object} | {Array}  左表达式
	 * @param   operator  {String}                       操作运算符
	 * @param   right     {String} | {Object} | {Array}  右表达式
	 */
	Handlebars.registerHelper('compare', function(left, operator, right, options) {
		
		if (arguments.length < 3) {
		
			throw new Error('Handlerbars Helper "compare" needs 2 parameters');
		}

		var operators = {

			'=='     : function(l, r) { return l == r; },
			'==='    : function(l, r) { return l === r; },
			'!='     : function(l, r) { return l != r; },
			'!=='    : function(l, r) { return l !== r; },
			'<'      : function(l, r) { return l < r; },
			'>'      : function(l, r) { return l > r; },
			'<='     : function(l, r) { return l <= r; },
			'>='     : function(l, r) { return l >= r; },
			'typeof' : function(l, r) { return typeof l == r; }
		};
		
		if (!operators[operator]) {

			throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
		}
		
		var result = operators[operator](left, right);
		
		if (!result) {
			
			return options.inverse(this);
		} 
		
		return options.fn(this);
    });

	// Return	
	return {
		
		'compile': compile
	}
}));