export default (router, { services, getSchema }) => {

	const { ItemsService } = services;

	router.post('/register', async (req, res) => {
		const itemsMAList = new ItemsService('ma_list', { schema: await getSchema() });
		const itemsEquipments = new ItemsService('equipment', { schema: await getSchema() });
		const itemsQRCode = new ItemsService('qr_code', { schema: await getSchema() });

		const payload = req.body;

		if (payload.id === undefined || payload.id === null || payload.id === '') {
			console.error("Payload does not contain 'id'.");
			return;
		}

		const dataMAList = await itemsMAList.readOne(payload.id, {
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
		const qrCodesToUpdate = [];

		async function checkQRCode(qrCodeId) {
			function extractId(qrCode) {
				if (!qrCode) return null;
				const match = qrCode.match(/([0-9a-fA-F\-]{36})$/);
				return match ? match[1] : qrCode;
			}

			const qr_code = extractId(qrCodeId);
			if (!qr_code) return null;

			try {
				const qrData = await itemsQRCode.readOne(qr_code, { fields: ['is_open'] });
				if (qrData && qrData.is_open === false) {
					qrCodesToUpdate.push(qr_code);
				}
				return qr_code
			} catch (error) {
				return null;
			}
		}

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
									qr_code = await checkQRCode(item.qr_code) || null;
									break;
								}
							}
						} else if (checkList && typeof checkList === 'object') {
							if (checkList.serial_number === serial) {
								product_code = checkList.product_code || null;
								product_name = checkList.product_name || null;
								model = checkList.product_model || null;
								group_product = checkList.product_device || null;
								qr_code = await checkQRCode(checkList.qr_code) || null;
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
						qr_code: {
							id: qr_code,
							is_open: true
						}
					}
				);
			}
		}
		await itemsEquipments.createMany([
			...payloadEquipments
		]);

		res.send({ message: 'QR codes updated successfully.' });
	});

	router.get('/product_info/:id', async (req, res) => {
		const itemsQRCode = new ItemsService('qr_code', { schema: await getSchema() });

		if (!req.params.id) {
			console.error("Query parameter 'id' is missing.");
			return res.status(400).send({ message: "Query parameter 'id' is missing." });
		}

		let dataMAList;
		try {
			dataMAList = await itemsQRCode.readOne(req.params.id, {
				fields: [
					'is_open',
					'equipment.product_code',
					'equipment.product_name',
					'equipment.serial_number',
					'equipment.group_product',
					'equipment.model',
					'equipment.qr_code',
					'equipment.store_name',
					'equipment.company_name',
					'equipment.branch',
					'equipment.branch_code'
				],
			});
		} catch (error) {
			return res.status(404).send({ message: 'ไม่พบข้อมูลสินค้า (Product not found).' });
		}

		if (dataMAList.is_open === false) {
			return res.status(403).send({ message: 'QR นี้ยังไม่ได้เปิดใช้งาน (QR code is not activated yet).' });
		}

		res.send({ message: 'Product information retrieved successfully.', data: dataMAList });
	});
};