module.exports = async function registerHook({ action, filter }, { services, getSchema }) {
	const schema = await getSchema();
	const { ItemsService } = services;
	const itemsReportRepairList = new ItemsService('report_repair_list', { schema });

	action('report_repair_list.items.create', async ({ payload, key, collection }) => {
		const now = new Date();
		const year = String(now.getFullYear()).slice(-2); // 2 digits
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const date = String(now.getDate()).padStart(2, '0');
		const prefix = `R${year}${month}${date}`;

		// Query หาจำนวนใบที่ document_number contain prefix
		const { data: itemsToday } = await itemsReportRepairList.readByQuery({
			filter: {
				document_number: {
					_contains: prefix
				}
			}
		});
		const count = String((itemsToday?.length || 0) + 1).padStart(2, '0');

		const documentNumber = `${prefix}${count}`;

		await itemsReportRepairList.updateOne(key, {
			document_number: documentNumber,
		});
	});
};