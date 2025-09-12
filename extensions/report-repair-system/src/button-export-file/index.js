import InterfaceComponent from './interface.vue';

export default {
	id: 'export_file_to_pdf',
	name: 'Export file to pdf',
	icon: 'edit_document',
	description: 'Export current item data to PDF via API',
	component: InterfaceComponent,
	options: [
		{
			field: 'hover_text',
			name: 'Hover Text',
			type: 'string',
			meta: {
				interface: 'input',
				note: 'Text to display on hover',
			},
			schema: {
				default_value: 'Export to PDF',
			},
		},
		// url api to export pdf
		{
			field: 'api_url',
			name: 'API URL',
			type: 'string',
			meta: {
				interface: 'input',
				note: 'API endpoint to export PDF',
			},
			schema: {
				default_value: 'http://localhost:3000/export-pdf',
			},
		},
		// PDF handling option
		{
			field: 'pdf_handling',
			name: 'PDF Handling',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				options: {
					choices: [
						{ text: 'Download PDF', value: 'download' },
						{ text: 'Save to Collection Field', value: 'save_field' },
						{ text: 'Save to Files and Link', value: 'save_files' },
					],
				},
				note: 'How to handle the returned PDF',
			},
			schema: {
				default_value: 'download',
			},
		},
		// Field to save PDF URL/ID when using save options
		{
			field: 'save_field',
			name: 'Save Field',
			type: 'string',
			meta: {
				interface: 'input',
				note: 'Field name to save PDF URL or file ID (required when saving)',
				conditions: [
					{
						rule: {
							pdf_handling: {
								_in: ['save_field', 'save_files']
							}
						}
					}
				],
			},
		},
	],
	types: ['string'],
};