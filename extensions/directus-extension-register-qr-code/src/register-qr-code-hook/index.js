module.exports = async function registerHook({ action }, { services, getSchema }) {
	const { ItemsService } = services;

	action('ma_list.items.update', async ({ payload, keys, collection }) => {
		const itemsQRCode = new ItemsService('qr_code', { schema: await getSchema() });
		const itemsMAList = new ItemsService('ma_list', { schema: await getSchema() });

		const status = payload.status;

		if (status !== 'passed') {
			console.error("Payload does not contain 'status'.");
			return;
		}

		try {
			const dataMAList = await itemsMAList.readOne(keys[0], {
				fields: [
					'company_name',
					'store_name',
					'branch_name',
					'branch_code',
					'have_pos_1',
					'check_list_pos_1',
					'have_pos_2',
					'check_list_pos_2',
					'have_kitchen_printer',
					'check_list_kitchen_printer',
					'have_kitchen_printer',
					'check_list_receipt_printer',
					'have_receipt_printer',
					'check_list_label_printer',
					'have_label_printer',
					'check_list_drawer',
					'have_drawer',
					'check_list_scanner',
					'have_scanner',
					'check_list_ups',
					'have_ups',
					'check_list_kiosk',
					'have_kiosk',
					'check_list_printer_queue',
					'have_printer_queue'
				],
			});

			const checkListFields = [
				'check_list_pos_1',
				'check_list_pos_2',
				'check_list_kitchen_printer',
				'check_list_receipt_printer',
				'check_list_label_printer',
				'check_list_drawer',
				'check_list_scanner',
				'check_list_ups',
				'check_list_kiosk',
				'check_list_printer_queue'
			];

			for (const field of checkListFields) {
				if (Array.isArray(dataMAList[field])) {
					for (const item of dataMAList[field]) {
						if (item.qr_code) {
							const qrData = await itemsQRCode.readOne(item.qr_code, { fields: ['is_open'] });
							if (qrData && qrData.is_open === false) {
								await itemsQRCode.updateOne(item.qr_code, {
									is_open: true,
									group_product: item.product_device,
									product_name: item.product_name,
									model: item.product_model,
									serial_number: item.serial_number,
									company_name: dataMAList.company_name,
									store_name: dataMAList.store_name,
									branch_name: dataMAList.branch_name,
									branch_code: dataMAList.branch_code,
								});
							}
						}
					}
				}
			}

		} catch (error) {
			console.error("Error creating record:", error);
		}
	});
};
