module.exports = async function registerHook({ action }, { services, getSchema }) {
    const { ItemsService } = services;

    action('delivery_sheet.items.update', async ({ payload, keys, collection }) => {
        const id = keys[0]
        const itemsDeliverySheet = new ItemsService('delivery_sheet', { schema: await getSchema() });
        const data = await itemsDeliverySheet.readOne(id)
        console.log(data);


    });
};
