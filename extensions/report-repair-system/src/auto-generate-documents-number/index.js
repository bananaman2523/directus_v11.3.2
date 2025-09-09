module.exports = async function registerHook({ action, filter }, { services, getSchema }) {
	const schema = await getSchema();
	const { ItemsService } = services;
	const itemsReportRepairList = new ItemsService('report_repair_list', { schema });

	filter('report_repair_list.items.create', async ({ collection }) => {
		console.log('12312312312312312312312312312312312312312312331313123123123123');
		console.log(collection);
		console.log('12312312312312312312312312312312312312312312331313123123123123');
		console.log('12312312312312312312312312312312312312312312331313123123123123');

		// // Get the latest document number
		// const latestItem = await itemsReportRepairList.readByQuery({
		// 	sort: ['-document_number'],
		// 	limit: 1,
		// 	fields: ['document_number'],
		// });

		// let nextNumber = 1;
		// if (latestItem && latestItem.length > 0 && latestItem[0].document_number) {
		// 	const latestNumber = parseInt(latestItem[0].document_number, 10);
		// 	if (!isNaN(latestNumber)) {
		// 		nextNumber = latestNumber + 1;
		// 	}
		// }

		// // Format the document number as needed (e.g., zero-padded)
		// const formattedNumber = nextNumber.toString().padStart(6, '0');

		// // Set the document_number field
		// collection.document_number = formattedNumber;
	});
};
