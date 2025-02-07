module.exports = async function registerHook({ action }, { services, getSchema }) {
	const { ItemsService } = services;

	function replaceRWithC(input) {
		return input.replace(/R/g, 'C');
	}

	action('device_transfer_details.items.update', async ({ payload, key, collection }) => {
		const items = new ItemsService('device_exchange_details', { schema: await getSchema() });
		const documentNum = payload.document_number

		try {
			const updatedString = replaceRWithC(documentNum);
			const updatedRecord = await items.createOne({
				document_number: `${updatedString}`,
				have_data: false
			});
			console.log("Record created successfully:", updatedRecord);
		} catch (error) {
			console.error("Error creating record:", error);
		}
	});
};
