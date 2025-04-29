const PdfPrinter = require("pdfmake");
const convertImageToBase64 = require("../convertImage");

function generateTableRows(rowCount, data) {
    const mappedStock = data.stock_snapshot.map((item, index) => ({
        id: index + 1,
        product_code: item.productCode,
        counter: item.counter,
        product_brand: item.productBrand,
        serial_number: item.serialNumbers,
        status: item.status,
        device_status: item.device_status,
        po_number: item.po_number,
        checked_by: data.checked_by,
        prepared_by: data.prepared_by,
        group_product: item.productModel,
        description: item.remarks,
        stock_snapshot: data.stock_snapshot,
    }));

    const rows = mappedStock.slice(0, rowCount).map((item) => [
        { text: item.id.toString(), fontSize: 10, alignment: 'center' },
        { text: item.group_product || "N/A", fontSize: 10, margin: [0, -2, 5, 0], lineHeight: 0.7 },
        { text: item.counter, fontSize: 10, alignment: 'center', margin: [0, -2, 0, 0], lineHeight: 0.7 },
        { text: item.product_brand || "N/A", fontSize: 10, margin: [0, -2, 5, 0], lineHeight: 0.7 },
        { text: item.serial_number || "N/A", fontSize: 10, margin: [0, -2, 5, 0], lineHeight: 0.7 },
        { text: item.status || "N/A", fontSize: 10, alignment: 'center', margin: [0, -2, 0, 0], lineHeight: 0.7 },
        { text: item.prepared_by, fontSize: 10, margin: [0, -2, 0, 0], lineHeight: 0.7 },
        { text: item.checked_by, fontSize: 10, margin: [0, -2, 0, 0], lineHeight: 0.7 },
        { text: "", fontSize: 10, margin: [0, -2, 0, 0], lineHeight: 0.7 },
        { text: item.description || "", fontSize: 10, margin: [0, -2, 0, 0], lineHeight: 0.7 }
    ]);

    while (rows.length < rowCount) {
        rows.push([" ", " ", " ", " ", " ", " ", " ", " ", " ", " "]);
    }

    return rows;
}

const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

module.exports = (data) => {
    const itemsPerPage = 15;
    const pages = [];
    const stockData = data.stock_snapshot;

    for (let i = 0; i < stockData.length; i += itemsPerPage) {
        const tableRows = generateTableRows(itemsPerPage, { ...data, stock_snapshot: stockData.slice(i, i + itemsPerPage) });

        const pageContent = [
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
            { text: "เอกสารจัดเตรียมสินค้า", alignment: "center", style: "header" },
            { text: "เอกสารภายในบริษัท", alignment: "center", style: "normal", margin: [0, -6] },
            {
                table: {
                    widths: [45, '*', 20, '*', 44, 70, 70, 70, 70, 70],
                    body: [
                        [
                            { text: "บริษัท/ร้าน: ", alignment: 'left' },
                            { text: data.company_name, color: '#4285f4', bold: true },
                            { text: "สาขา: ", alignment: 'left' },
                            { text: data.branch_name, color: '#4285f4', bold: true },
                            { text: "รหัสสาขา: ", alignment: 'left' },
                            { text: data.branch_code, color: '#4285f4', bold: true },
                            { text: "วันจัดเตรียมสินค้า: ", alignment: 'left' },
                            { text: formatDate(data.product_preparation_date), color: '#4285f4', bold: true },
                            { text: "วันแพลนจัดส่ง: ", alignment: 'left' },
                            { text: formatDate(data.plan_delivery_date), color: '#4285f4', bold: true }
                        ],
                    ],
                },
                layout: "noBorders",
            },
            {
                table: {
                    widths: [45, 80, 60, '*', 44, 70, 70, 70, 70, 70],
                    body: [
                        [
                            { text: "ใบสั่งซื้อเลขที่: ", alignment: 'left' },
                            { text: data.customer_order_number, color: '#4285f4', bold: true },
                            { text: "ใบเสนอราคาเลขที่: ", alignment: 'left' },
                            { text: data.quotation_number_office_design, color: '#4285f4', bold: true },
                            { text: "เอกสารเลขที่: ", alignment: 'left' },
                            { text: data.document_preparation_number, color: '#4285f4', bold: true },
                            "",
                            "",
                            "",
                            ""
                        ]
                    ],
                },
                layout: "noBorders",
            },
            {
                table: {
                    widths: [25, 130, 20, 80, 100, 57, 55, 55, 58, '*'],
                    heights: 17,
                    body: [
                        [
                            { text: "ลำดับที่", alignment: 'center', bold: true, fontSize: 10 },
                            { text: "อุปกรณ์", alignment: 'center', bold: true, fontSize: 10 },
                            { text: "จำนวน", alignment: 'center', bold: true, fontSize: 10 },
                            { text: "รุ่น", alignment: 'center', bold: true, fontSize: 10 },
                            { text: "Serial Number", alignment: 'center', bold: true, fontSize: 10 },
                            { text: "สถานะการตรวจสอบ", alignment: 'center', bold: true, fontSize: 10 },
                            { text: "ตรวจโดยผู้จัดเตรียม", alignment: 'center', bold: true, fontSize: 10 },
                            { text: "ตรวจโดยผู้ตรวจส่ง", alignment: 'center', bold: true, fontSize: 10 },
                            { text: "ตรวจโดยผู้รับ(ลูกค้า)", alignment: 'center', bold: true, fontSize: 10 },
                            { text: "หมายเหตุ", alignment: 'center', bold: true, fontSize: 10 }
                        ],
                        ...tableRows,
                    ],
                },
            },
            {
                table: {
                    widths: ['*'],
                    body: [
                        [
                            { text: "" },
                        ],
                    ],
                },
                layout: "noBorders",
            },
            {
                table: {
                    widths: [458, 'auto', 'auto', 'auto', '*'],
                    body: [
                        [
                            { text: " ", alignment: 'center', bold: true, fontSize: 11 },
                            { text: "...............................", alignment: 'center', bold: false, fontSize: 11 },
                            { text: "...............................", alignment: 'center', bold: false, fontSize: 11 },
                            { text: "...............................", alignment: 'center', bold: false, fontSize: 11 },
                            { text: "**กรุณาเขียนตัวบรรจง**", alignment: 'center', bold: true, fontSize: 11 }
                        ],
                        [
                            { text: " ", alignment: 'center', bold: true, fontSize: 11 },
                            { text: "ตรวจโดยผู้จัดเตรียม", alignment: 'center', bold: true, fontSize: 11 },
                            { text: "ตรวจโดยผู้ตรวจส่ง", alignment: 'center', bold: true, fontSize: 11 },
                            { text: "ตรวจโดยผู้รับ\n(ลูกค้า)", alignment: 'center', bold: true, fontSize: 11 },
                            { text: " ", alignment: 'center', bold: true, fontSize: 11 }
                        ],
                        [
                            { text: "วันที่", alignment: 'right', bold: true, fontSize: 11 },
                            { text: "...............................", alignment: 'center', bold: false, fontSize: 11 },
                            { text: "...............................", alignment: 'center', bold: false, fontSize: 11 },
                            { text: "...............................", alignment: 'center', bold: false, fontSize: 11 },
                            { text: " ", alignment: 'center', bold: true, fontSize: 11 }
                        ]
                    ],
                },
                layout: "noBorders",
            }
        ];

        if (i + itemsPerPage < stockData.length) {
            pageContent.push({ text: "", pageBreak: "after" });
        }

        pages.push(...pageContent);
    }

    return {
        content: pages,
        pageSize: "A4",
        pageOrientation: "landscape",
        pageMargins: [15, 15, 15, 15],
        styles: {
            header: { fontSize: 20, bold: true },
            subheader: { fontSize: 14, bold: true },
            normal: { fontSize: 12 },
        },
    };
};
