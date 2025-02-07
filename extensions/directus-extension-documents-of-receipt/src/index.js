module.exports = async function registerHook({ action }, { services, getSchema }) {
	const { ItemsService } = services;

	action('device_transfer_details.items.create', async ({ payload, key, collection }) => {
		const prefix = "R"
		const date = new Date()

		const items = new ItemsService('device_transfer_details', { schema: await getSchema() });
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');

		const formattedDate = `${year}${month}${day}`;

		try {
			const generateNumber = await items.readByQuery({
				fields: ['*'],
				filter: {
					document_number: {
						_contains: `${prefix}${formattedDate}`,
					},
				},
			});
			const sequence = String(generateNumber.length+1).padStart(2, '0');

			const updatedRecord = await items.updateOne(key, {
				document_number: `${prefix}${formattedDate}${sequence}`,
			});
			console.log("Record created successfully:", updatedRecord);
		} catch (error) {
			console.error("Error creating record:", error);
		}
	});
};
