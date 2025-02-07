module.exports = async function registerHook({ action }, { services, getSchema }) {
    const { ItemsService } = services;

    function replaceDocumentNumber(input, newValue) {
        if (typeof input !== 'string') {
            throw new Error("Invalid input, expected a string.");
        }
        return input.replace(/R/g, newValue);
    }

    action('device_transfer_details.items.update', async ({ payload, key, collection }) => {
        console.log(payload);

        const itemsDeviceExchange = new ItemsService('device_exchange_details', { schema: await getSchema() });
        const itemsProductRequest = new ItemsService('product_request_details', { schema: await getSchema() });

        const documentNum = payload.document_number;

        if (!documentNum) {
            console.error("Payload does not contain 'document_number'.");
            return;
        }

        try {
            const updatedStringDeviceExchange = replaceDocumentNumber(documentNum, 'C');

            await itemsDeviceExchange.createOne({
                document_number: `${updatedStringDeviceExchange}`,
                have_data: false,
            });

            const updatedString = replaceDocumentNumber(documentNum, 'S');

            await itemsProductRequest.createOne({
                document_number: `${updatedString}`,
                have_data: false,
            });

        } catch (error) {
            console.error("Error creating record:", error);
        }
    });
};
