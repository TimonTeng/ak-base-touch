!function(e,t){"use strict";"function"==typeof define?define.amd?define(function(e){var n=e("jquery"),i=e("lodash"),o=e("backbone"),u=e("backbone.view"),d=e("template");return t(n,i,o,u,d)}):define.cmd&&define(function(e,n,i){var o=e("jquery"),u=e("lodash"),d=e("backbone"),r=e("backbone.view"),c=e("template");return t(o,u,d,r,c)}):e.scrollView=t(e.scrollView)}(this,function(e,t,n,i,o){"use strict";var u=n.Model.extend({idAttribute:"",defaults:{}});return i.extend({id:"",model:new u,attrs:{parentNode:null},events:{},setup:function(){document.addEventListener("touchmove",function(e){e.preventDefault()},!1)}})});