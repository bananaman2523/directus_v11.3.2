module.exports = async function registerHook({ action }, { services, getSchema }) {
	const { ItemsService } = services;

	const itemsSupplierInfo = new ItemsService('supplier_info', { schema: await getSchema() });
	const itemsSupplierDetails = new ItemsService('supplier_details', { schema: await getSchema() });
	const itemsSupplierStock = new ItemsService('supplier_stock', { schema: await getSchema() });
	const itemsProductStock = new ItemsService('product_stocks_serial_number', { schema: await getSchema() });
	const itemsProductStockNoneSerial = new ItemsService('product_stocks_none_serial_number', { schema: await getSchema() });

	action('supplier_stock.items.create', async (payload, key, collection) => {
		if (!payload || !payload.payload || !payload.key) {
			console.warn('Missing payload or key in supplier_stock.items.create handler');
			return;
		}
		const payloadProduct = payload.payload;
		const payloadID = payload.key;
		const supplierStockId = payloadProduct.supplier_details;

		async function findSupplier(supplier_id) {
			try {
				const supplier = await itemsSupplierDetails.readOne(supplier_id, { fields: ['supplier'] });
				return supplier.supplier;
			} catch (error) {
				console.error('Error updating supplier stock quantity:', error);
			}
		}

		const supplierId = await findSupplier(supplierStockId);

		try {
			if (payloadProduct.have_serial_number) {
				const serialNumbers = Array.isArray(payloadProduct.serial_numbers)
					? payloadProduct.serial_numbers.filter(serial => serial !== null && serial !== undefined && serial !== '')
					: [];

				await itemsSupplierStock.updateOne(payloadID, {
					qty: serialNumbers.length,
				});

				const productStockEntries = serialNumbers.map(serial => ({
					supplier: supplierId,
					group_product: payloadProduct.group_product,
					product_name: payloadProduct.product_name,
					brand: payloadProduct.brand,
					model: payloadProduct.model,
					product_code: payloadProduct.product_code,
					serial_number: serial,
					supplier_details: payloadProduct.supplier_details,
					device_status: payloadProduct.device_status
				}));

				if (productStockEntries.length > 0) {
					await itemsProductStock.createMany(productStockEntries);
				} else {
					await itemsProductStock.createOne(productStockEntries[0]);
				}
			} else if (!payloadProduct.have_serial_number) {
				const alreadyExists = await itemsProductStockNoneSerial.readByQuery({
					filter: {
						group_product: { _eq: payloadProduct.group_product },
						product_name: { _eq: payloadProduct.product_name },
						brand: { _eq: payloadProduct.brand },
						model: { _eq: payloadProduct.model },
						product_code: { _eq: payloadProduct.product_code },
						device_status: { _eq: payloadProduct.device_status }
					},
					limit: 1
				});

				if (alreadyExists.length > 0) {
					const existingEntry = alreadyExists[0];
					const newQty = existingEntry.qty + payloadProduct.qty_product;
					await itemsProductStockNoneSerial.updateOne(existingEntry.id, { qty: newQty });
				} else if (alreadyExists.length === 0) {
					await itemsProductStockNoneSerial.createOne({
						group_product: payloadProduct.group_product,
						product_name: payloadProduct.product_name,
						brand: payloadProduct.brand,
						model: payloadProduct.model,
						product_code: payloadProduct.product_code,
						qty: payloadProduct.qty_product,
						device_status: payloadProduct.device_status
					});
				}

			}
		} catch (error) {
			console.error('Error updating supplier stock:', error);
		}
	});

	// action('supplier_details.items.create', (payload, key, collection) => {
	// 	console.log('******************************************');
	// 	console.log(payload);
	// 	console.log(collection);
	// 	console.log('******************************************');
	// });
};
