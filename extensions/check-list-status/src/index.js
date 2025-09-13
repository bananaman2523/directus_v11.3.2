import InterfaceComponent from './interface.vue';

export default {
	id: 'check-list-status',
	name: 'Checklist Status',
	icon: 'check-circle',
	description: 'Custom interface สำหรับแสดงค่า field จาก checklist ที่กำหนด',
	component: InterfaceComponent,
	options: [
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
