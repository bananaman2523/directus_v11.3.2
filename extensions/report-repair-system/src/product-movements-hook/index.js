module.exports = async function registerHook({ action, filter }, { services, getSchema }) {
	const schema = await getSchema();
	const { ItemsService } = services;
	const itemsReportRepairList = new ItemsService('report_repair_list', { schema });
	const itemsProductStocksSerialNumber = new ItemsService('product_stocks_serial_number', { schema });

	action('report_repair_list.items.update', async ({ payload, keys, collection }) => {
		const id = typeof keys === 'object' && keys !== null ? keys.id || Object.values(keys)[0] : keys;
		const currentItem = await itemsReportRepairList.readOne(id,
			{
				fields:
					[
						'status',
						'brand',
						'branch',
						'device.id',
						'device.group_product',
						'device.product_name',
						'device.model',
						'device.brand',
						'device.serial_number.serial_number',
						'received_the_device',
						'assign_to.first_name',
						'assign_to.last_name'
					]
			}
		);
		if (currentItem.received_the_device !== null && currentItem.branch !== null && currentItem.brand !== null && currentItem.device !== null) {
			const product_id = currentItem.device.id;
			const existingProduct = await itemsProductStocksSerialNumber.readOne(product_id, {
				fields: [
					'movement_products.status', 'movement_products.date', 'position_status'
				],
				deep: {
					movement_products: {
						_sort: ['-date']
					}
				}
			});

			if (
				Array.isArray(existingProduct.movement_products) &&
				existingProduct.movement_products.length > 0 &&
				existingProduct.movement_products[0] &&
				existingProduct.movement_products[0].status !== 'repair_status'
			) {
				const previousMovements = Array.isArray(existingProduct.movement_products) ? existingProduct.movement_products : [];
				const newMovement = {
					status: 'repair_status',
					store: 'OFD',
					date: currentItem.received_the_device,
					product_details: currentItem.device.id,
				};
				await itemsProductStocksSerialNumber.updateOne(product_id, {
					position_status: 'office_design',
					movement_products: [...previousMovements, newMovement]
				});
			} else if (existingProduct.movement_products.length === 0) {
				const previousMovements = Array.isArray(existingProduct.movement_products) ? existingProduct.movement_products : [];
				const newMovement = {
					status: 'repair_status',
					store: 'OFD',
					date: currentItem.received_the_device,
					product_details: currentItem.device.id,
				};
				await itemsProductStocksSerialNumber.updateOne(product_id, {
					position_status: 'office_design',
					movement_products: [...previousMovements, newMovement]
				});
			} else {
				// No action needed if the latest movement is already 'repair_status'
			}
		}
	});
};
