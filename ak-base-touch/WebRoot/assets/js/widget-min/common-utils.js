define(["jquery","handlebars"],function(a,t){return{mcache:{mcache_data_v_1_0:{version:1},put:function(a,t){this.mcache_data_v_1_0||(this.mcache_data_v_1_0={}),this.mcache_data_v_1_0[a]=t},get:function(a){return this.mcache_data_v_1_0[a]},remove:function(a){this.mcache_data_v_1_0[a]=null,delete this.mcache_data_v_1_0[a]},size:function(){var a=0;for(var t in this.mcache_data_v_1_0)a++;return a},clear:function(){this.mcache_data_v_1_0={}}},template:function(a){if(void 0!=a.heplers&&null!=a.heplers)for(var e=0;e<a.heplers.length;e++)t.registerHelper(a.heplers[e].name,a.heplers[e].fun);var n=this.mcache.get(a.path);n||(n=this.load(a.path).get(0).innerHTML,this.mcache.put(a.path,n));var c=t.compile(n);return c(a.data)},load:function(t,e){var n=this.random();t+="?rnd="+n,this.ajaxSyncOn();var c=a("<div>",{});return a(c).load(t,e),this.ajaxSyncOff(),c},post:function(t,e,n){a.post(t,e,n)},get:function(t,e,n){var c=this.random();t+="?rnd="+c,a.get(t,e,n)},random:function(){return Math.random()},ajaxSyncOn:function(){a.ajaxSetup({async:!1})},ajaxSyncOff:function(){a.ajaxSetup({async:!0})}}});