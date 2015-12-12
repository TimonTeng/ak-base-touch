{{#each data}}
<div class="each-nav am-u-sm-4 am-text-center">
	{{#compare type '===' 'Button'}}
		<a status="0" data-id="{{id}}" data-type="{{type}}" data-url="{{url}}" action-button-event>
			<span>{{title}}</span>
		</a> 
	{{/compare}}
	
	{{#compare type '===' 'SelectView'}}
		<a status="0" data-id="{{id}}" data-type="{{type}}" data-url="{{url}}" action-selectview-event>
			<span>{{title}}</span>
			<span class="am-icon-caret-down"></span>
		</a> 
	{{/compare}}
	
	{{#compare type '===' 'DoubleSelectView'}}
		<a status="0" data-id="{{id}}" data-type="{{type}}" data-url="{{url}}" action-selectview-event>
			<span>{{title}}</span>
			<span class="am-icon-caret-down"></span>
		</a> 
	{{/compare}}
	
	{{#compare type '===' 'AplhabetSelectView'}}
		<a status="0" data-id="{{id}}" data-type="{{type}}" data-url="{{url}}" action-selectview-event>
			<span>{{title}}</span>
			<span class="am-icon-caret-down"></span>
		</a> 
	{{/compare}}
	
	{{#compare type '===' 'AplhabetDoubleSelectView'}}
		<a status="0" data-id="{{id}}" data-type="{{type}}" data-url="{{url}}" action-selectview-event>
			<span>{{title}}</span>
			<span class="am-icon-caret-down"></span>
		</a> 
	{{/compare}}
</div>
{{/each}}