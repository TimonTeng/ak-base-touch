{{#each data}}
	<div class="am-u-sm-4 am-text-center">
		{{#compare type '===' 'Button'}}
			<div class="am-plugin-actionbar" status="0" data-id="{{id}}" data-type="{{type}}" data-url="{{url}}" action-button-event>
				{{title}}
			</div>
		{{/compare}}
		
		{{#compare type '===' 'SelectView'}}
			<div class="am-plugin-actionbar" status="0" data-id="{{id}}" data-type="{{type}}" data-url="{{url}}" action-selectview-event>
				{{title}}
			</div>
		{{/compare}}
		
		{{#compare type '===' 'DoubleSelectView'}}
			<div class="am-plugin-actionbar" status="0" data-id="{{id}}" data-type="{{type}}" data-url="{{url}}" action-selectview-event>
				{{title}}
			</div>
		{{/compare}}
		
		{{#compare type '===' 'AplhabetSelectView'}}
			<div class="am-plugin-actionbar" status="0" data-id="{{id}}" data-type="{{type}}" data-url="{{url}}" action-selectview-event>
				{{title}}
			</div>
		{{/compare}}
		
		{{#compare type '===' 'AplhabetDoubleSelectView'}}
			<div class="am-plugin-actionbar" status="0" data-id="{{id}}" data-type="{{type}}" data-url="{{url}}" action-selectview-event>
				{{title}}
			</div>
		{{/compare}}
	</div>
{{/each}}