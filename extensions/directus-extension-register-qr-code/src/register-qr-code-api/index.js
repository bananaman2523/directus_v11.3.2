export default (router, { services, getSchema }) => {

	const { ItemsService } = services;

	router.post('/register', async (req, res) => {
		const itemsQRCode = new ItemsService('qr_code', { schema: await getSchema() });
		const itemsMAList = new ItemsService('ma_list', { schema: await getSchema() });
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

		function extractId(qrCode) {
			if (!qrCode) return null;
			const match = qrCode.match(/([0-9a-fA-F\-]{36})$/);
			return match ? match[1] : qrCode;
		}

		for (const field of checkListFields) {
			if (Array.isArray(dataMAList[field])) {
				for (const item of dataMAList[field]) {
					const qrCodeId = extractId(item.qr_code);
					if (qrCodeId) {
						const qrData = await itemsQRCode.readOne(qrCodeId, { fields: ['is_open'] });
						if (qrData && qrData.is_open === false) {
							await itemsQRCode.updateOne(qrCodeId, {
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
					'group_product',
					'product_name',
					'model',
					'serial_number',
					'company_name',
					'store_name',
					'branch_name',
					'branch_code',
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