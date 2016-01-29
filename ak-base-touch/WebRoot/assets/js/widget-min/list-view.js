!function(t,e){"use strict";"function"==typeof define?define.amd?define(function(t){var i=t("jquery"),a=t("lodash"),s=t("backbone"),n=t("backbone.view"),l=t("template");return e(i,a,s,n,l)}):define.cmd&&define(function(t,i,a){var s=t("jquery"),n=t("lodash"),l=t("backbone"),o=t("backbone.view"),r=t("template");return e(s,n,l,o,r)}):t.listView=e(t.listView)}(this,function(t,e,i,a,s){"use strict";var n={Type:{Waterfall:"waterfall",Pivot:"pivot",Alphabet:"alphabet"}},l=function(){this.type=n.Type.Waterfall,this.apiUrl=this.parentNode=this.$main=this.$list=this.$pullDown=this.$pullDownLabel=this.$pullUp=this.$pullUpLabel=this.topOffset=this.style=this.page=this.params=this.view=null,this.iScroll=null,this.activate=!0,this.page={result:"",pageNo:1,pageSize:0,pageTotal:0,total:0,prev:1,next:1,pageNoField:"",pageSizeField:"",pageTotalField:""},this.doLoad=!0,this.delegatesEvents={},this.renderAfter=null};l.prototype.initConfiguration=function(e){this.view=e,this.setPage(e.getAttr("page")),this.setParams(e.getAttr("params")),this.apiUrl=e.getAttr("apiUrl"),this.style=e.getAttr("style"),this.parentNode=e.getAttr("parentNode");var i=e.getAttr("type");switch(this.$main=t(this.parentNode),this.renderAfter=e.getAttr("renderAfter"),this.doLoad=new Boolean(e.getAttr("doLoad")||this.doLoad),this.style&&this.$main.css(this.style),i&&""!=i&&(this.type=i),this.type){case n.Type.Waterfall:this.initWaterfallMode();break;case n.Type.Pivot:this.initPivotMode();break;case n.Type.Alphabet:this.initAlphabetMode()}},l.prototype.initWaterfallMode=function(){this.$warpiscroll=t("<div>",{id:"warp-iscroll"}),t(this.$warpiscroll,this.parentNode).append(this.bodyContext()),t(this.$warpiscroll,this.parentNode).append(this.pullUpTpl()),this.$warpiscroll.appendTo(this.$main),this.$list=this.$main.find("#events-list"),this.$pullDown=this.$main.find("#pull-down"),this.$pullDownLabel=this.$main.find("#pull-down-label"),this.$pullUp=this.$main.find("#pull-up"),this.$pullUpLabel=this.$main.find("#pull-up-label"),this.topOffset=-this.$pullDown.outerHeight(),this.bindIScroll(),this.setActivate(),this.load()},l.prototype.initPivotMode=function(){this.$warpiscroll=t("<div>",{id:"warp-iscroll"}),t(this.$warpiscroll,this.parentNode).append(this.bodyContext()),this.$warpiscroll.appendTo(this.$main),this.$list=this.$main.find("#events-list"),this.scrollView=this.view.getAttr("scrollView"),this.setActivate(),this.load()},l.prototype.initAlphabetMode=function(){this.$warpiscroll=t("<div>",{id:"warp-iscroll"}),t(this.$warpiscroll,this.parentNode).append(this.bodyContext()),this.$warpiscroll.appendTo(this.$main),this.$list=this.$main.find("#events-list"),this.scrollView=this.view.getAttr("scrollView"),this.setActivate()},l.prototype.renderAfterHandle=function(){switch(this.type){case n.Type.Waterfall:this.renderAfterWaterfallModeHandle();break;case n.Type.Pivot:this.renderAfterPivotModeHandle();break;case n.Type.Alphabet:this.renderAfterAlphabetModeHandle()}},l.prototype.renderAfterWaterfallModeHandle=function(){var e=this;e.resetLoading(e.$pullUp),e.correctView();var i=t(".am-list-item-desced",e.parentNode).length;0==i&&e.$pullUp.remove(),this.page.next==this.page.pageTotal&&this.$pullUpLabel.text("已经到最后了"),this.renderAfter&&this.renderAfter()},l.prototype.renderAfterPivotModeHandle=function(){this.scrollView&&this.scrollView.refresh(),this.renderAfter&&this.renderAfter()},l.prototype.renderAfterAlphabetModeHandle=function(){},l.prototype.handleSwipeUp=function(){var t=this.iScroll,e=t.maxScrollY,i=t.startY,a=200,s=e+a>i?!0:!1;s&&this.page.next<this.page.pageTotal&&(this.setLoading(this.$pullUp),this.page.pageNo=this.page.next+=1,this.loadNextPage(),this.page.next==this.page.pageTotal&&this.$pullUpLabel.text("已经到最后了"))},l.prototype.handleSwipeDown=function(){var t=this.iScroll,e=t.startY;e>0&&this.reload()},l.prototype.pullDownTpl=function(){return'<div class="pull-action loading" id="pull-down"><span class="am-icon-arrow-down pull-label" id="pull-down-label">下拉刷新</span><span class="am-icon-spinner am-icon-spin"></span></div>'},l.prototype.pullUpTpl=function(){return'<div class="pull-action loading" id="pull-up"><span class="am-icon-arrow-down pull-label" id="pull-up-label">上拉加载更多</span><span class="am-icon-spinner am-icon-spin"></span></div>'},l.prototype.bodyContext=function(){return'<ul class="am-list" id="events-list"><li class="am-list-item-desced"><div class="am-list-item-text">正在加载内容...</div></li></ul>'},l.prototype.setLoading=function(t){t.addClass("loading")},l.prototype.resetLoading=function(t){t.removeClass("loading")},l.prototype.bindIScroll=function(){var t=this,e=t.iScroll=new IScroll(t.parentNode,{click:!0}),t=this;e.on("scrollEnd",function(){-1===this.directionY&&t.handleSwipeDown(),1===this.directionY&&t.handleSwipeUp()})},l.prototype.getUrl=function(){var t=[];for(var e in this.params)this.params[e]&&t.push(e+"="+this.params[e]);return t.push(this.page.pageNoField+"="+this.page.pageNo),t.push(this.page.pageSizeField+"="+this.page.pageSize),this.apiUrl+"?"+t.join("&")},l.prototype.renderList=function(t){var e=this.view.getAttr("template"),i=s.compile(e,t);return i},l.prototype.createLoadDataMode=function(){switch(this.type){case n.Type.Waterfall:case n.Type.Pivot:case n.Type.Alphabet:default:return null}},l.prototype.load=function(){var e=this;t.getJSON(e.getUrl()).then(function(t){e.page.pageTotal=t[e.page.pageTotalField];var i=e.renderList(t[e.page.result]);e.$list.html(i),e.renderAfterHandle(),e.correctView()},function(){console.log("Error...")})},l.prototype.reload=function(e){this.setParams(e),this.page.pageNo=1,this.page.pageTotal=0,this.$main=t(this.parentNode),this.$main.html(""),this.$warpiscroll=t("<div>",{id:"warp-iscroll"}),t(this.$warpiscroll,this.parentNode).append(this.bodyContext()),t(this.$warpiscroll,this.parentNode).append(this.pullUpTpl()),this.$warpiscroll.appendTo(this.$main),this.$list=this.$main.find("#events-list"),this.$pullDown=this.$main.find("#pull-down"),this.$pullDownLabel=this.$main.find("#pull-down-label"),this.$pullUp=this.$main.find("#pull-up"),this.$pullUpLabel=this.$main.find("#pull-up-label"),this.topOffset=-this.$pullDown.outerHeight(),this.bindIScroll(),this.load()},l.prototype.loadNextPage=function(){var e=this;t.getJSON(e.getUrl()).then(function(t){e.page.pageTotal=t[e.page.pageTotalField];var i=e.renderList(t[e.page.result]);e.$list.append(i),e.renderAfterHandle(),e.correctView()},function(){console.log("Error...")}).always(function(){e.resetLoading(e.$pullUp)})},l.prototype.correctView=function(){if(this.type!==n.Type.Pivot){var t=this;document.body.style.position="fixed";var e=5,i=setInterval(function(){t.refresh(),--e<=0&&(document.body.style.position="",clearInterval(i))},250)}},l.prototype.refresh=function(){this.iScroll.refresh()},l.prototype.setActivateOn=function(){var t={"transition-duration":".2s","transition-timing-function":"linear",transform:"translate(0px, 0px)"};this.$main.css(t)},l.prototype.setActivateOff=function(){var t=document.body.clientWidth,e={display:"none","transition-duration":"0s","transition-timing-function":"linear",transform:"translate("+t+"px, 0px)"};this.$main.css(e)},l.prototype.onActivate=function(t){var e=this;{if(1!=t)return 0==t?void this.setActivateOff():void 0;this.$main.css("display","block");var i=setTimeout(function(){e.setActivateOn(),clearTimeout(i)},100)}},l.prototype.setActivate=function(){var t=this.view.getAttr("activate");switch(t){case"true":this.setActivateOn();break;case"false":this.setActivateOff()}},l.prototype.setPage=function(e){var i=this;i.page=i.page||{},t.extend(i.page,e)},l.prototype.setParams=function(e){var i=this,a={};t.extend(a,i.params,e),i.params=a},l.prototype.setParam=function(t,e){this.params[t]=e};var o=i.Model.extend({idAttribute:"",defaults:{apiUrl:""}});return a.extend({id:"",model:new o,attrs:{parentNode:null,template:null,page:{result:"",pageNo:0,pageSize:0,pageNoField:"pageNum",pageSizeField:"pageSize",pageTotalField:"lastPageNumber"},params:{}},events:{},setup:function(){var t=this,e=(t.getAttr("parentNode"),t.getAttr("type"),t.getAttr("data"),new l);e.initConfiguration(t),t.setAttr("listView",e),document.addEventListener("touchmove",function(t){t.preventDefault()},!1)},setPage:function(t){this.getAttr("listView").setPage(t)},setParams:function(t){this.getAttr("listView").setParams(t)},setParam:function(t,e){this.getAttr("listView").setParam(t,e)},reload:function(t){this.getAttr("listView").reload(t)},refreshTouchLayout:function(){var t=this.getAttr("listView");t.type==n.Type.Waterfall&&t.refresh()},onActivate:function(t){var e=this.getAttr("listView");e.onActivate(t)}})});