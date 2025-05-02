module.exports = async function registerHook({ schedule }, { services, getSchema }) {
	const { ItemsService } = services;
	//59 16 * * *
	schedule('59 16 * * *', async () => {
		try {
			const items = new ItemsService('clouds', { schema: await getSchema() });
			const now = new Date();
			const twoMonthsLater = new Date();
			twoMonthsLater.setMonth(now.getMonth() + 2);

			const clouds_id = await items.readByQuery({
				fields: ['*'],
				filter: {
					_and: [
						{
							start_date: {
								_lte: now.toISOString(),
							},
						},
						{
							due_date: {
								_lte: twoMonthsLater.toISOString(),
							},
						},
						{
							status: {
								_neq: "deactivated"
							},
						},
					],
				},
			});

			const keys = clouds_id.map(cloud => cloud.id);
			const updatedRecord = await items.updateMany(keys, {
				status: "near_expiry",
			});
		} catch (error) {
			console.error('Error updating status:', error);
		}
	});

	schedule('59 16 * * *', async () => {
		try {
			const items = new ItemsService('clouds', { schema: await getSchema() });
			const today = new Date();
			const specificStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0).toISOString();
			const specificEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();

			const clouds_id = await items.readByQuery({
				fields: ['*'],
				filter: {
					_and: [
						{
							start_date: {
								_lte: specificEnd,
							},
						},
						{
							start_date: {
								_gte: specificStart,
							},
						},
						{
							status: {
								_neq: "deactivated"
							},
						},
					],
				},
			});

			const keys = clouds_id.map(cloud => cloud.id);
			const updatedRecord = await items.updateMany(keys, {
				status: "in_use",
			});
		} catch (error) {
			console.error('Error updating status:', error);
		}
	});

	schedule('59 16 * * *', async () => {
		try {
			const items = new ItemsService('clouds', { schema: await getSchema() });
			const today = new Date();
			const specificEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();

			const clouds_id = await items.readByQuery({
				fields: ['*'],
				filter: {
					_and: [
						{
							due_date: {
								_lte: specificEnd,
							},
						},
						{
							status: {
								_neq: "deactivated"
							},
						}
					],
				}
			});

			const keys = clouds_id.map(cloud => cloud.id);
			const updatedRecord = await items.updateMany(keys, {
				status: "expired",
			});
		} catch (error) {
			console.error('Error updating status:', error);
		}
	});
};