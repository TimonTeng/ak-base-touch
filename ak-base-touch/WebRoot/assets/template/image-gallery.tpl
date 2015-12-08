<header data-am-widget="header" class="am-header">
      <div class="am-header-left am-header-nav">
          <a href="#left-link" data-am-modal-close> 
			<img class="am-header-icon-custom" src="data:image/svg+xml;charset=utf-8,&lt;svg xmlns=&quot;http://www.w3.org/2000/svg&quot; viewBox=&quot;0 0 12 20&quot;&gt;&lt;path d=&quot;M10,0l2,2l-8,8l8,8l-2,2L0,10L10,0z&quot; fill=&quot;%23fff&quot;/&gt;&lt;/svg&gt;" alt=""/>
          	&nbsp;&nbsp;&nbsp;&nbsp;
          </a>
      </div>
      <h1 class="am-header-title">{{title}}</h1>
</header>
<div style="position:relative;top:20%;" class="am-text-middle">
	<div data-am-widget="slider" class="am-slider am-slider-b2">
	  <ul class="am-slides">
	  	  {{#each data}}
		      <li>
				<img src="{{image}}">
		      </li>
	  	  {{/each}}
	  </ul>
	</div>
</div>
 
<div style="position: absolute; bottom: 0px; padding : 0 0 15px 15px; width : 100%;" >
	<a><img src="assets/i/dz.png" width="24" height="24"></a>
	<i class="am-margin-left-lg"></i>
	<a><img src="assets/i/pl.png" width="24" height="24"></a>
	<a class="am-fr am-cf" href="assignmentDetail.html?homeworkId={{id}}">
		<label class="am-text-default am-text-white">详情</label>&nbsp;&nbsp;
		<label class="am-text-white am-text-xl"><i class="am-icon-angle-right"></i>&nbsp;&nbsp;</label>
	</a>
</div>

<div class="am-modal-actions">
  <div class="am-modal-actions-group">
    <ul class="am-list">
      <li class="am-modal-actions-header">保存到手机</li>
      <li class="am-modal-actions-header">发给微信好友</li>
      <li class="am-modal-actions-header">发给车友会好友</li>
      <li class="am-modal-actions-header">收藏</li>
    </ul>
  </div>
  <div class="am-modal-actions-group">
    <button class="am-btn am-btn-secondary am-btn-block" am-imagepanel-close>取消</button>
  </div>
</div>

