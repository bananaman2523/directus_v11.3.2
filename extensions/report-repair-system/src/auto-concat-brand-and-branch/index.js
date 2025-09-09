module.exports = async function registerHook({ action, filter }, { services, getSchema }) {
	const { ItemsService } = services;
	const itemsReportRepairList = new ItemsService('report_repair_list', { schema: await getSchema() });

	action('report_repair_list.items.update', async ({ payload, keys, collection }) => {
		if (payload.brand || payload.branch) {
			const id = typeof keys === 'object' && keys !== null ? keys.id || Object.values(keys)[0] : keys;
			const currentItem = await itemsReportRepairList.readOne(id);
			if (!payload.brand) {
				payload.brand = currentItem.brand || '';
			}
			if (!payload.branch) {
				payload.branch = currentItem.branch || '';
			}
			const brand = payload.brand;
			const branch = payload.branch;
			const concatField = `${brand} (${branch})`.trim();

			await itemsReportRepairList.updateOne(id, { brand_and_branch: concatField });
		}
	});

	action('report_repair_list.items.create', async ({ payload, key, collection }) => {
		if (payload.brand || payload.branch) {
			const id = key;
			const currentItem = await itemsReportRepairList.readOne(id);
			if (!payload.brand) {
				payload.brand = currentItem.brand || '';
			}
			if (!payload.branch) {
				payload.branch = currentItem.branch || '';
			}
			const brand = payload.brand;
			const branch = payload.branch;
			const concatField = `${brand} (${branch})`.trim();

			await itemsReportRepairList.updateOne(id, { brand_and_branch: concatField });
		}
	});
};
