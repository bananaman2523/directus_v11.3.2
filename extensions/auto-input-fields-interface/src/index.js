import InterfaceComponent from './interface.vue';

export default {
	id: 'auto-input-fields',
	name: 'Auto Input Fields',
	icon: 'auto_fix_high',
	description: 'Auto fill input field with data from another collection',
	component: InterfaceComponent,
	options: [
		{
			field: 'collection_parent',
			name: 'Collection',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				placeholder: 'e.g. product_groups',
				note: 'Collection name to fetch data from'
			}
		},
		{
			field: 'display_field',
			name: 'Display Field',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				placeholder: 'e.g. name, title, group_name',
				note: 'Field name to display as auto-filled value'
			}
		},
		{
			field: 'filter',
			name: 'Filter',
			type: 'json',
			meta: {
				interface: 'code',
				width: 'full',
				options: {
					language: 'json',
					placeholder: '{ "status": { "_eq": "active" }, "group": { "_eq": "{{$group_field}}" } }'
				},
				note: 'Filter conditions. Use {{$field_name}} to reference form field values'
			}
		},
		{
			field: 'wait_for_field',
			name: 'Wait for Field',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				placeholder: 'e.g. group_id, category',
				note: 'Field name to wait for input before auto-filling. Leave empty to auto-fill immediately'
			}
		}
	],
	types: ['string'],
};