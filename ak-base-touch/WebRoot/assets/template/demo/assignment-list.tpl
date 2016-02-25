{{#if this}}
{{#each this}}
<div class="each-car" data-id="{{id}}">
	<div class="clearfix car-title">
		<span class="title" data-link="assignmentDetail.html?homeworkId={{id}}">{{title}}</span> 
		<span class="praise">
			{{#compare hasPraise '>' '0'}}
				<i class="praise-icon-a"></i>
			{{else}}
				<i class="praise-icon"></i>
			{{/compare}}
			<span>
				<span class="praiseCount_span">{{praiseCount}}</span>
			</span>
		</span>
	</div>
	<ul class="am-avg-sm-3 am-thumbnails" data-link="assignmentDetail.html?homeworkId={{id}}">
	  {{#each mediaList}}
		  <li><img data-original="{{this}}" src="http://img.uni020.com" class="am-img-responsive" data-link="assignmentDetail.html?homeworkId={{../id}}" /></li>
	  {{/each}}	
	</ul>
</div>
{{/each}}
{{else}}
	<div class="activity no-homework">
      <img src="assets/images/empty-sign.png"/>
      <p>目前还没有人发布U记，赶紧去点下面的按钮发布一个吧！</p>
	</div>
{{/if}}   