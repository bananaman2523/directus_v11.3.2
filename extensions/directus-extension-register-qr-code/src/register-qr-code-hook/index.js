module.exports = async function registerHook({ action }, { services, getSchema }) {
	const { ItemsService } = services;

	action('ma_list.items.update', async ({ payload, keys }) => {
		const itemsMAList = new ItemsService('ma_list', { schema: await getSchema() });
		const itemsEquipments = new ItemsService('equipment', { schema: await getSchema() });
		const itemsQRCode = new ItemsService('qr_code', { schema: await getSchema() });

		const status = payload.status;

		if (status !== 'passed') {
			console.error("Payload does not contain 'status'.");
			return;
		}

		try {
			const id = typeof keys === 'object' && keys !== null ? keys.id || Object.values(keys)[0] : keys;
			const dataMAList = await itemsMAList.readOne(id, {
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
				fields: ['id', 'serial_number', 'product_code', 'product_name', 'model', 'group_product', 'store_name', 'company_name', 'branch', 'branch_code', 'qr_code.id', 'qr_code.id_manual'],
				filter: {
					serial_number: {
						_in: uniqueSerialNumbers
					},
				}
			});

			// Build a Set of existing serial numbers for O(1) lookup
			const existingSerialSet = new Set(existingEquipments.map(eq => eq.serial_number));
			const payloadEquipments = [];
			const payloadUpdates = [];
			const qrCodesToUpdate = [];

			async function checkQRCode(qrCodeId) {
				function extractId(qrCode) {
					if (!qrCode) return null;
					try {
						const url = new URL(qrCode);
						const segments = url.pathname.split('/');
						const lastSegment = segments.pop() || segments.pop();
						return lastSegment;
					} catch (e) {
						const match = qrCode.match(/([0-9a-fA-F\-]{36})$/);
						return match ? match[1] : qrCode;
					}
				}

				const qr_code_manual = extractId(qrCodeId);
				if (!qr_code_manual) return null;

				try {
					const qrDataArr = await itemsQRCode.readByQuery({
						fields: ['id', 'is_open', 'id_manual'],
						filter: { id_manual: { _eq: qr_code_manual } }
					});
					const qrData = qrDataArr[0];

					if (qrData && qrData.is_open === false) {
						qrCodesToUpdate.push(qrData.id_manual);
					}
					// Return only the UUID id for relation
					return qrData ? qrData.id : null;
				} catch (error) {
					return null;
				}
			}

			for (const serial of uniqueSerialNumbers) {
				// Find the corresponding item in check_listFields
				let product_code = null;
				let product_name = null;
				let model = null;
				let group_product = null;
				let qr_code_id = null;

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
									qr_code_id = await checkQRCode(item.qr_code) || null;
									break;
								}
							}
						} else if (checkList && typeof checkList === 'object') {
							if (checkList.serial_number === serial) {
								product_code = checkList.product_code || null;
								product_name = checkList.product_name || null;
								model = checkList.product_model || null;
								group_product = checkList.product_device || null;
								qr_code_id = await checkQRCode(checkList.qr_code) || null;
								break;
							}
						}
					}
					if (product_code) break;
				}

				if (!existingSerialSet.has(serial)) {
					// Create new equipment
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
							qr_code: qr_code_id // Only store the relation ID
						}
					);

					// Update QR code separately if it exists
					if (qr_code_id) {
						try {
							await itemsQRCode.updateOne(qr_code_id, { is_open: true });
						} catch (error) {
							console.error(`Failed to update QR code ${qr_code_id}:`, error);
						}
					}
				} else {
					// Update existing equipment
					const existingEquipment = existingEquipments.find(eq => eq.serial_number === serial);
					if (existingEquipment) {
						payloadUpdates.push({
							id: existingEquipment.id,
							product_code,
							product_name,
							model,
							group_product,
							store_name: dataMAList.store_name || null,
							company_name: dataMAList.company_name || null,
							branch: dataMAList.branch_name || null,
							branch_code: dataMAList.branch_code || null,
							qr_code: qr_code_id // Only store the relation ID
						});

						// Update QR code separately if it exists
						if (qr_code_id) {
							try {
								await itemsQRCode.updateOne(qr_code_id, { is_open: true });
							} catch (error) {
								console.error(`Failed to update QR code ${qr_code_id}:`, error);
							}
						}
					}
				}
			}

			// Create new equipments
			if (payloadEquipments.length > 0) {
				await itemsEquipments.createMany([
					...payloadEquipments
				]);
			}

			// Update existing equipments
			if (payloadUpdates.length > 0) {
				for (const updateItem of payloadUpdates) {
					const { id, ...updateData } = updateItem;

					// Find the existing equipment to get the old QR code
					const existingEquipment = existingEquipments.find(eq => eq.id === id);

					// Update the equipment
					await itemsEquipments.updateOne(id, updateData);

					// Close the old QR code if it exists and is different from the new one
					if (existingEquipment && existingEquipment.qr_code && existingEquipment.qr_code.id_manual) {
						const oldQrCodeIdManual = existingEquipment.qr_code.id_manual;
						const newQrCodeId = updateData.qr_code;

						// Only close the old QR code if it's different from the new one
						if (oldQrCodeIdManual !== newQrCodeId) {
							try {
								await itemsQRCode.updateByQuery(
									{ filter: { id_manual: { _eq: oldQrCodeIdManual } } },
									{ is_open: false }
								);
							} catch (error) {
								console.error(`Failed to close old QR code ${oldQrCodeIdManual}:`, error);
							}
						}
					}
				}
			}

		} catch (error) {
			console.error("Error creating record:", error);
		}
	});

	action('qr_code.items.update', async ({ keys }) => {
		try {
			const itemsQRCode = new ItemsService('qr_code', { schema: await getSchema() });
			const qrCodeId = typeof keys === 'object' && keys !== null ? keys.id || Object.values(keys)[0] : keys;
			const qrCodeData = await itemsQRCode.readOne(qrCodeId, { fields: ['equipment'] });

			if (qrCodeData && qrCodeData.equipment) {
				await itemsQRCode.updateOne(qrCodeId, { is_open: true });
			} else {
				await itemsQRCode.updateOne(qrCodeId, { is_open: false });
			}
		} catch (error) {
			console.error("Error updating QR code:", error);
		}
	});
};
