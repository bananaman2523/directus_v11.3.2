import InterfaceComponent from './interface.vue';

export default {
	id: 'signature-pad-popup',
	name: 'Signature Pad Popup',
	icon: 'edit',
	description: 'Button popup for signature pad interface with file storage options.',
	component: InterfaceComponent,
	options: [
		{
			field: 'folder',
			name: 'Storage Folder',
			type: 'uuid',
			meta: {
				interface: 'system-folder',
				note: 'Select folder to store signature files (optional)',
			},
		},
		{
			field: 'fileNaming',
			name: 'File Naming',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Timestamp', value: 'timestamp' },
						{ text: 'UUID', value: 'uuid' },
						{ text: 'Custom Name', value: 'custom' },
					],
				},
			},
			schema: {
				default_value: 'timestamp',
			},
		},
		{
			field: 'customFileName',
			name: 'Custom File Name',
			type: 'string',
			meta: {
				interface: 'input',
				note: 'Used when File Naming is set to "Custom Name"',
				conditions: [
					{
						rule: {
							fileNaming: {
								_eq: 'custom',
							},
						},
					},
				],
			},
			schema: {
				default_value: 'signature',
			},
		},
		{
			field: 'format',
			name: 'Image Format',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'PNG', value: 'png' },
						{ text: 'JPEG', value: 'jpeg' },
					],
				},
			},
			schema: {
				default_value: 'png',
			},
		},
		{
			field: 'quality',
			name: 'Image Quality',
			type: 'decimal',
			meta: {
				interface: 'slider',
				options: {
					min: 0.1,
					max: 1,
					step: 0.1,
				},
				note: 'Only applies to JPEG format',
				conditions: [
					{
						rule: {
							format: {
								_eq: 'jpeg',
							},
						},
					},
				],
			},
			schema: {
				default_value: 0.8,
			},
		},
		{
			field: 'clear_button',
			name: 'Clear Button',
			type: 'boolean',
			meta: {
				interface: 'toggle',
				note: 'Show clear button on signature pad',
			},
			schema: {
				default_value: true,
			},
		},
		{
			field: 'edit_button',
			name: 'Edit Button',
			type: 'boolean',
			meta: {
				interface: 'toggle',
				note: 'Show edit button on signature pad',
			},
			schema: {
				default_value: true,
			},
		},
		{
			field: 'watermark_text',
			name: 'Watermark Text',
			type: 'string',
			meta: {
				interface: 'input',
				note: 'Optional text to display as a watermark on the signature image',
			},
			schema: {
				default_value: 'กรุณาเซ็นตัวบรรจง',
			}
		}
	],
	types: ['uuid'],
};