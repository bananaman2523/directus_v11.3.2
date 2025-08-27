module.exports = async function registerHook({ action }, { services, getSchema }) {
	const { ItemsService } = services;

	action('ma_list.items.update', async ({ payload, keys, collection }) => {
		const itemsMAList = new ItemsService('ma_list', { schema: await getSchema() });
		const itemsEquipments = new ItemsService('equipment', { schema: await getSchema() });

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

			const serialNumbers = [];

			for (const field of checkListFields) {
				if (dataMAList[`have_${field.replace('check_list_', '')}`]) {
					const checkList = dataMAList[field];
					if (Array.isArray(checkList)) {
						for (const item of checkList) {
							if (item.serial_number) {
								serialNumbers.push(item.serial_number);
							}
						}
					} else if (checkList && typeof checkList === 'object') {
						if (checkList.serial_number) {
							serialNumbers.push(checkList.serial_number);
						}
					}
				}
			}

			const uniqueSerialNumbers = Array.from(new Set(serialNumbers));

			const existingEquipments = await itemsEquipments.readByQuery({
				fields: ['serial_number', 'product_code', 'product_name', 'model', 'group_product', 'store_name', 'company_name', 'branch', 'branch_code'],
				filter: {
					serial_number: {
						_in: uniqueSerialNumbers
					},
				}
			});

			// Build a Set of existing serial numbers for O(1) lookup
			const existingSerialSet = new Set(existingEquipments.map(eq => eq.serial_number));
			const payloadEquipments = [];

			for (const serial of uniqueSerialNumbers) {
				if (!existingSerialSet.has(serial)) {
					// Find the corresponding item in check_listFields
					let product_code = null;
					let product_name = null;
					let model = null;
					let group_product = null;
					let qr_code = null;

					for (const field of checkListFields) {
						if (dataMAList[`have_${field.replace('check_list_', '')}`]) {
							const checkList = dataMAList[field];
							if (Array.isArray(checkList)) {
								for (const item of checkList) {
									if (item.serial_number === serial) {
										product_code = item.product_code || null;
										product_name = item.product_name || null;
										model = item.product_model || null;
										group_product = item.product_device || null;
										qr_code = item.qr_code || null;
										break;
									}
								}
							} else if (checkList && typeof checkList === 'object') {
								if (checkList.serial_number === serial) {
									product_code = checkList.product_code || null;
									product_name = checkList.product_name || null;
									model = checkList.product_model || null;
									group_product = checkList.product_device || null;
									qr_code = checkList.qr_code || null;
									break;
								}
							}
						}
						if (product_code) break;
					}
					payloadEquipments.push(
						{
							serial_number: serial,
							product_code,
							product_name,
							model,
							group_product,
							store_name: dataMAList.store_name || null,
							company_name: dataMAList.company_name || null,
							branch: dataMAList.branch_name || null,
							branch_code: dataMAList.branch_code || null,
							qr_code
						}
					);
				}
			}
			await itemsEquipments.createMany([
				...payloadEquipments
			]);

		} catch (error) {
			console.error("Error creating record:", error);
		}
	});
};
