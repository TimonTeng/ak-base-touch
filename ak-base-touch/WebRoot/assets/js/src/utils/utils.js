/**
 * @package Template Service 模板服务
 * @author <David Jones qowera@qq.com, david01.zhong@vip.com>
 * @contributors []
 * @version 1.0.0-beta
 * @dependencies [artTemplate]
 * @description
 *
 * 对 artTemplate 的二次封装，主要添加：
 * 1. 异步加载文件功能
 * 2. 异步缓存功能与缓存刷新功能
 *
 * 该服务请求 HTML 模板将会 block 页面，就是说将 async 执行 Ajax
 */
 
!(function(root, factory) {
	'use strict'
  
	if ('function' === typeof define) {
		
		if (define.amd) {
			
			define(['lodash'], function(_) {
				
				return factory(_);
			});
		
		} else if (define.cmd) {
			
			define(['lodash'], function(require, exports, module) {
				
				var _ = require('lodash');
				
				return factory(_);
			});
		}
	
	} else {

		root.Utils = factory(root.Utils);
	}
	
}(this, function(_) {
	'use strict';
  
	/**
	 * class Browser
	 * @function  getScrollTop     {String}   获取垂直滚动位置
	 * @function  getScrollLeft    {Object}   获取水平滚动位置
	 * @function  getScrollWidth   {Boolean}  获取页面高度
	 * @function  getScrollHeight  {String}   获取页面宽度
	 * @function  getClientWidth   {Boolean}  获取屏幕宽度
	 * @function  getClientHeight  {String}   获取屏幕高度
	 * @function  version  判断浏览器版本类型
	 */
	var	Browser = {
			
		getScrollTop: function() {
			
			return document.body.scrollTop;
		},
	   
		getScrollLeft: function() {
			
			return document.body.scrollLeft;
		},
	   
		getScrollWidth: function() {
		   
			return document.body.scrollWidth;
		},
		
		getScrollHeight: function() {
					  
			return document.body.scrollHeight;
		},
		
		getClientWidth: function() {
			
			return document.documentElement.clientWidth;
		},
		
		getClientHeight: function() {
			
			return document.documentElement.clientHeight;
		},
					
		version: function() {
			
			var agent = navigator.userAgent;
			
			return {
  
				"android" : agent.indexOf('Android') > -1 || agent.indexOf('Linux') > -1,          // android终端或者uc浏览器
				"gecko"   : agent.indexOf('Gecko') > -1 && agent.indexOf('KHTML') == -1,           // 火狐内核 
				"iMac"    : !!agent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),                        // iMac终端
				"iPad"    : agent.indexOf('iPad') > -1,                                            // 是否iPad
				"iPhone"  : agent.indexOf('iPhone') > -1 || agent.indexOf('Mac') > -1,             // 是否为iPhone或者QQHD浏览器
				"mobile"  : !!agent.match(/AppleWebKit.*Mobile.*/)||!!agent.match(/AppleWebKit/),  // 是否为移动终端
				"presto"  : agent.indexOf('Presto') > -1,                                          // opera内核
				"trident" : agent.indexOf('Trident') > -1,                                         // IE内核                
				"webKit"  : agent.indexOf('AppleWebKit') > -1,                                     // 苹果、谷歌内核                
				"weixin"  : agent.indexOf('MicroMessenger') > -1                                   // 是否微信浏览器
			}
		}()
	};

	/**
	 * class Cookie
	 * @function  get  获取Cookie
	 * @function  set  设置Cookie
	 * @function  del  删除Cookie
	 */		
	var	Cookie = {
			
		get: function(name) {
			
			var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
			if (arr != null)  return unescape(arr[2]); return null;
		},
		
		set: function(name, value) {
			
			var Days = 30;            //此 cookie 将被保存 30 天
			var exp  = new Date();    //new Date("December 31, 9998");
			exp.setTime(exp.getTime() + Days*24*60*60*1000);
			document.cookie = name + "=" + escape (value) + ";expires=" + exp.toGMTString();				
		},
		
		del: function(name) {
			
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval=getCookie(name);
			if (cval!=null)  document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
		}
	};
		
	/**
	 * class Url
	 * @function  back      返回上一页
	 * @function  getParam  获取URL参数
	 * @function  refresh   刷新当前页
	 */				
	var Url = {
				
		back: function() {
			
			var backUrl = document.referrer;
			
			if (backUrl)  window.location.href = backUrl;
		},
		
		getParam: function(val) {
			
			var str = window.location.href.split("?");
			
			if (str.length > 1) {
				
				var arrBuf = str[1].split("&");
				
				for (var i = 0; i < arrBuf.length; i++) {
					
					var arrTmp = arrBuf[i].split("=");
					
					if (arrTmp[0] === val)    return arrTmp[1];
				}
			}
		},
		
		refresh: function() {
			
			window.location.href = window.location.href;
		}
	};

	/**
	 * class Validate
	 * @function  isDate
	 * @function  isDateTime
	 * @function  isIDCard 
	 * @function  isMail
	 * @function  isMobile
	 * @function  isPassword
	 * @function  isPostCode
	 * @function  isDateTime
	 * @function  isUrl
	 */					
	var Validate = {
			
		isNull : function(val){
			if(!val || val == ''){
				return true;
			}
			return false;
		},

		isDate: function(val) {  // 格式：YYYY-MM-DD
			
			return /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/.test(val);
		},
		
		isDateTime: function(val) {  // 格式：YYYY-MM-DD hh:mm
			
			return /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])\s+([0-1]\d|2[0-3])\:[0-5]\d$/.test(val);
		},

		isIDCard: function(val) {
		
			if (/^\d{15}(\d{2}[A-Za-z0-9])?$/.test(val))    return true;
			else                                            return false;								
		},

		isMail: function(val) {
			
			if (/^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/.test(val))    return true;
			else                                                               return false;
		},
		
		isMobile: function(val) {
			
			if (/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/.test(val) && val.length === 11)    return true;
			else                                                                                                 return false;
		},

		isPassword: function(val) {
			
			if (!/^\d+$/.test(val) && !/^[A-Za-z]+$/.test(val)) {
				
				if (/[a-zA-Z0-9]{6,16}/.test(val) && (val.length >= 6 && val.length <= 20 ))    return true;
				else                                                                            return false;
								
			} else {
				
				return false;
			}
		},
		
		isPostCode: function(val) {
			
			if (/^[1-9][0-9]{5}$/.test(val))    return true;
			else                                return false;
		},
		
		isUrl: function(val) {
		
			if (/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\"\"])*$/.test(val))    return true;
			else                                                                                          return false;				
		}			
	};
	
	// Return
	return {
		
		'Browser'  : Browser,
		'Cookie'   : Cookie,
		'Url'      : Url,
		'Validate' : Validate
	};
}));