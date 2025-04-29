const PdfPrinter = require("pdfmake");
const convertImageToBase64 = require("../convertImage");

function generateTableRows(rowCount, data) {
    const mappedStock = (data.packing_sheet ?? []).flatMap((sheet, sheetIndex) =>
        (sheet.stock ?? []).map((item, stockIndex) => ({
            id: `${stockIndex + 1}`,
            model: item.model || "",
            group_product: item.group_product || "",
            serial_number: item.serial_number || "",
            status: item.status || "",
            remark: item.remark || "",
            checked_by: sheet.checked_by,
            prepared_by: sheet.prepared_by,
        }))
    );

    const rows = mappedStock.slice(0, rowCount).map((item) => [
        item.id.toString(),
        item.group_product,
        1,
        item.model,
        item.serial_number,
        item.prepared_by,
        item.checked_by,
        " ",
        " ",
    ]);

    while (rows.length < rowCount) {
        rows.push([" ", " ", " ", " ", " ", " ", " ", " ", " "]);
    }

    return rows;
}

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

module.exports = (data) => ({
    content: [
        {
            columns: [
                {
                    image: "data:image/png;base64," + convertImageToBase64("./images/logo_officedesign.png"),
                    width: 140,
                },
                {
                    text:
                        "บริษัท ออฟฟิศดีไซน์ จำกัด (สำนักงานใหญ่)\n" +
                        "เลขที่ 304 อาคาร วานิชเพลส อารีย์ ห้องเลขที่ 2208 ชั้นที่ 22\n" +
                        "ถนน พหลโยธิน แขวงสามเสนใน เขตพญาไท กรุงเทพมหานคร 10400\n" +
                        "เลขประจำตัวผู้เสียภาษี 0105547064270\n" +
                        "โทร : 02-623-1515",
                    alignment: "right",
                    fontSize: 10,
                },
            ],
        },

        { text: "เอกสารการส่งมอบสินค้า", alignment: "center", style: "header" },
        { text: "เอกสารภายนอกบริษัท", alignment: "center", style: "normal", margin: [0, -6] },
        {
            table: {
                widths: [780],
                body: [
                    [
                        { text: `เอกสารเลขที่ : ${data.document_delivery_number}`, alignment: "right" },
                    ],
                    // [
                    //     { text: `อ้างอิง ใบวางบิล/ใบส่งของ เลขที่ : ${data.document_delivery_number}`, alignment: "right" },
                    // ],
                ],
            },
            layout: "noBorders",
        },
        {
            table: {
                widths: [45, 100, 20, 180, 20, 100, 50, 100],
                body: [
                    [
                        { text: "บริษัท/ร้าน: ", alignment: "left" },
                        { text: data.document_delivery_number || " ", color: "#4285f4", bold: true },
                        { text: "สาขา: ", alignment: "left" },
                        { text: data.packing_sheet[0].branch_name || " ", color: "#4285f4", bold: true },
                        { text: "โทร: ", alignment: "left" },
                        { text: " ", color: "#4285f4", bold: true },
                        { text: "วันที่ส่งมอบ: ", alignment: "left" },
                        { text: formatDate(data.delivery_date), color: "#4285f4", bold: true },
                    ],
                ],
            },
            layout: "noBorders",
        },

        {
            table: {
                widths: [30, 80, 50, 160, 100, 50, 100, 70, 70],
                body: [
                    [
                        { text: "ลำดับที่", alignment: "center" },
                        { text: "อุปกรณ์", alignment: "center" },
                        { text: "จำนวน", alignment: "center" },
                        { text: "รุ่น", alignment: "center" },
                        { text: "Serial number", alignment: "center" },
                        { text: "ตรวจโดย\nผู้จัดเตรียม", alignment: "center" },
                        { text: "ตรวจโดย\nผู้ตรวจส่ง", alignment: "center" },
                        { text: "ตรวจโดย\nผู้รับ (ลูกค้า)", alignment: "center" },
                        { text: "หมายเหตุ", alignment: "center" },
                    ],
                    ...generateTableRows(15, data),
                ],
            },
        },
    ],

    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [30, 30, 30, 30], // เพิ่ม top margin ให้ header ไม่ทับ content
    styles: {
        header: { fontSize: 20, bold: true },
        subheader: { fontSize: 14, bold: true },
        normal: { fontSize: 12 },
    },
});
