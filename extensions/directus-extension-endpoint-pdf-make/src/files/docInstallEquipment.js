const PdfPrinter = require("pdfmake");
const convertImageToBase64 = require("../convertImage");

function generateTableRows(rowCount) {
    const rows = [];
    for (let i = 1; i <= rowCount; i++) {
        rows.push([
            i.toString(),
            "KAM-MCP-01",
            "Keyboard & Mouse#MICROPACK KM-2003",
            "Nike",
            "AA1234567890", // เปลี่ยน S/N ให้ไม่ซ้ำ
            "ผ่าน",
            "",
            "สมชาย",
            "สมชาย",
        ]);
    }
    return rows;
}

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

        // ✅ ส่วนที่ถูกต้อง ไม่มี content ซ้อนกัน
        { text: "เอกสารจัดเตรียมสินค้า", alignment: "center", style: "header" },
        { text: "เอกสารภายในบริษัท", alignment: "center", style: "normal" },

        {
            table: {
                widths: [70, 70, 70, 70, 70, 70, 70, 70, 70, 70],
                body: [
                    ["บริษัท/ร้าน: ", "Offiedesign", "สาขา: ", "อารีย์", "รหัสสาขา: ", "OFD", "วันจัดเตรียมสินค้า: ", "07/01/2568", "วันแพลนติดตั้ง: ", "12/01/2568"],
                    ["ใบสั่งซื้อเลขที่: ", "P0701256801", "ใบเสนอราคาเลขที่: ", "R0701256801", "เอกสารเลขที่: ", "OFD0701256801", "", "", "", ""]
                ],
            },
            layout: "noBorders",
        },

        {
            table: {
                widths: [30, 50, 180, 50, 100, 50, 100, 70, 70],
                body: [
                    ["ลำดับที่", "รหัสสินค้า", "ชื่อสินค้า", "รุ่น/แบรนด์", "S/N", "สถานะการตรวจสอบ", "หมายเหตุ", "จัดเตรียมโดย", "ตรวจสินค้าโดย"],
                    ...generateTableRows(12), // ✅ สร้าง 10 แถวอัตโนมัติ
                ],
            },
        },
    ],

    pageSize: "A4",
    pageOrientation: "landscape",
    pageMargins: [30, 30, 30, 30], // ปรับขอบด้านบนให้ header ไม่ทับ content
    styles: {
        header: { fontSize: 20, bold: true },
        subheader: { fontSize: 14, bold: true },
        normal: { fontSize: 12 },
    },
});


