import InterfaceComponent from './interface.vue';

export default {
	id: 'dependent-dropdown',
	name: 'Dependent Dropdown',
	icon: 'arrow_drop_down_circle',
	description: 'Dropdown with options dependent on another field value from collection',
	component: InterfaceComponent,
	options: [
		{
			field: 'collection_parent',
			name: 'Collection',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				placeholder: 'e.g. product_groups'
			}
		},
		{
			field: 'display_field',
			name: 'Display Field',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				placeholder: 'e.g. group_name, product_name'
			}
		},
		{
			field: 'display_value_field',
			name: 'Display Value Field',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'full',
				placeholder: 'e.g. id, group_name'
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
					placeholder: '{ "group": { "_contains": "{{$group_product}}" } }'
				}
			}
		},
		{
			field: 'wait_for_field',
			name: 'Wait for Field',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				placeholder: 'e.g. group_product',
				note: 'Field name to wait for before loading options'
			}
		},
		{
			field: 'wait_message',
			name: 'Wait Message',
			type: 'string',
			meta: {
				interface: 'input',
				width: 'half',
				placeholder: 'Please select group first',
				note: 'Message to show when waiting for dependent field'
			},
			schema: {
				default_value: 'Please select dependent field first'
			}
		}
	],
	types: ['string'],
};