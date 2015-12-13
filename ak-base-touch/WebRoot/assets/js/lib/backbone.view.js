/**
 * ViewJS
 * @author <stanley01.he@vipshop.com>
 * @description
 * 
 * 所有Backbone View将继承该类.
 */

	define(function(require,exports,module) {
		
		// Require
		var $ = require('jquery'),
		    _ = require('lodash'),
			Backbone = require('backbone'),
			Template = require("template");
		
		// Define
		var cachedInstances = {};  // 实例缓存
		
		var defaultAttrs = {  // 默认属性
			
			template   : null,          // 模板路径
			parentNode : document.body  // 节点位置
		};
				
		// Return
		return View = Backbone.View.extend({

			/**
			 * @function  get  获取属性
			 * @param  name  {String}  属性名
			 */						
			getAttr: function(name) {
				
				return this.attrs[name] || null;
			},
			
			/**
			 * @function  set  设置属性的值
			 * @param  name  {String}  属性名
			 * @param  name  {Any}     属性名
			 */
			setAttr: function(name, value) {
	
				this.attrs[name] = value;
				
				return this;
			},

			/**
			 * @function  getModel  获取模型
			 * $param  query  {String}  查询链: 'styles.hd.color'
			 */
			getModel: function(query) {
								
				var self = this;
				
				var obj = self.model.toJSON(),
					res = _.get(obj, query);
				
				return res;
			},

			/**
			 * @function  getModel  设置模型
			 * $param  query  {String}  查询链: 'styles.hd.color'
			 * $param  value  {Any}     值
			 */
			setModel: function(query, value) {
				
				var self = this;
				
				var obj = self.model.attributes,
				    ori = _.cloneDeep(obj),  // 对象的修改需深度克隆
					res = _.set(ori, query, value);
									
				self.model.set(res);
			},

			/**
			 * @function  initialize  初始化
			 * @param  options
			 * @returns  {View}
			 */
			initialize: function(options) {
				options || (options = {});
				
				var self = this;
				
				self._extendAttrs(options);  // 组件属性与默认属性融合
				self._stamp();               // 保存实例信息
				self.setup();                // 子类自定义的初始化
								
				return self;
			},

			/**
			 * @function  setup  
			 * @param  options
			 * @returns  {View}
			 */			
			setup: function() {},
						
			/**
			 * @function  render  渲染
			 * @param  type  {String}  prepend | appendTo
			 * @returns  {View}
			 */		
			render: function(calls) {
				
				var self = this;
				
				var path = self.getAttr('template'),
				    data = self.model.toJSON();
				
				var	template = Template.compile(path, data);
				
				self.$el = $(template);
				self.el = template;
				
				var parentNode = self.getAttr('parentNode');
				
				self.delegateEvents(); 
				
				if (parentNode && !self._existDocument(self.el)) {
						
					self.$el.appendTo(parentNode);
				}
				
				if (_.isFunction(calls)) {
					
					calls();
				}
				
					
				return self;
			},
						
			/**
			 * @function  create  移除
			 * @returns  {View}
			 */
			remove: function() {
				
				var self = this;
								
				delete cachedInstances[self.cid];
				
				// 注销所有事件,Zepto的remove只是单纯移除DOM
				self.undelegateEvents().$el.off();
				Backbone.View.prototype.remove.apply(self);
				
				return self;
			},

			/**
			 * @function  create  销毁
			 * @returns  {View}
			 */
			destroy: function() {
				
				var self = this;
	
				for (var p in self) {
				
					if (self.hasOwnProperty(p)) {
				
						delete self[p];
					}
				}
				
				self.destroy = function() {};  // 此方法只能运行一次
				
				return self;
			},
						
			/**
			 * 让 element 与 View 实例建立关联
			 * @private
			 */
			_stamp: function() {
				
				var cid = this.cid;
				
				cachedInstances[cid] = this;
			},

			/**
			 * 让 element 与 View 实例建立关联
			 * @private
			 */			
			_extendAttrs: function(options) {
				
				var self = this;
				
				self.attrs = $.extend(true, {}, defaultAttrs, (self.attrs || {}), options);  // 组件属性与默认属性融合
			},
						
			/**
			 * 判断是否存在document
			 */
			_existDocument: function(element) {
				
				return $.contains(document.documentElement, element);
			}
		});			
	});