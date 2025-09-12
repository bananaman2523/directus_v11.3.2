import InterfaceComponent from './interface.vue';

export default {
	id: 'checklist_status',
	name: 'Checklist Status',
	icon: 'check_circle',
	description: 'Checklist interface with multiple status options.',
	component: InterfaceComponent,
	options: [
		{
			field: 'template_checklist',
			name: 'Template Checklist (JSON)',
			type: 'json',
			meta: {
				interface: 'code',
				width: 'full',
				options: {
					language: 'json'
				}
			}
		}
	],
	types: ['json'],
};