const PdfPrinter = require("pdfmake");
const convertImageToBase64 = require("../convertImage");

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

        { text: "เอกสารการฝึกอบรมผู้ใช้งานระบบ Queue", alignment: "center", style: "header" },
        { text: "เอกสารภายนอกบริษัท", alignment: "center", style: "normal" },
        {
            table: {
                widths: [420, '*'],
                body: [
                    [
                        { text: "เอกสารเลขที่ : ", alignment: "right" },
                        { text: data.document_delivery_number, alignment: "left", color: "#4285f4", bold: true },
                    ],
                ],
            },
            layout: "noBorders",
        },
        {
            table: {
                widths: [70, 150, 'auto', 130, 'auto', '*'],
                body: [
                    [
                        { text: "บริษัท / ร้าน : ", alignment: "right" },
                        { text: data.company_name, alignment: "left", color: "#4285f4", bold: true },
                        { text: "สาขา : ", alignment: "right" },
                        { text: data.branch_name, alignment: "left", color: "#4285f4", bold: true },
                        { text: "โทร : ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                    ],
                ],
            },
            layout: "noBorders",
            // margin: [0, -2],
        },
        {
            table: {
                widths: [70, 265, 70, '*'],
                body: [
                    [
                        { text: "สถานที่ : ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                        { text: "จำนวนผู้เข้าอบรม : ", alignment: "right" },
                        { text: " ", alignment: "left" }
                    ],
                ],
            },
            // margin: [0, -2],
            layout: "noBorders",
        },
        {
            table: {
                widths: [70, 58, 40, 33, 40, 33, 99, 13, 25, 13, 25],
                body: [
                    [
                        { text: "วันที่ : ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                        { text: "เวลาเริ่มต้น : ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                        { text: "เวลาสิ้นสุด : ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                        { text: "บันทึก VDO การสอนให้ลูกค้า : ", alignment: "right" },
                        { image: "data:image/png;base64," + convertImageToBase64("./images/checkboxFalse.png"), width: 13 },
                        { text: "ทำแล้ว", alignment: "right" },
                        { image: "data:image/png;base64," + convertImageToBase64("./images/checkboxFalse.png"), width: 13 },
                        { text: "ไม่ได้ทำ", alignment: "right" },
                    ],
                ],
            },
            margin: [0, 5],
            layout: "noBorders",
        },
        {
            margin: [0, -15],
            table: {
                widths: [150, '*', 50],
                body: [
                    [
                        { text: "หัวข้อ", alignment: "center", bold: true },
                        { text: "รายละเอียด", alignment: "center", bold: true },
                        { text: "สถานะ", alignment: "center", bold: true },
                    ],
                    [
                        { text: "สอนการใช้งานระบบคิวสำหรับ\nพนักงานหน้าร้าน", alignment: "center", rowSpan: 12, margin: [0, 100] },
                        { text: "สามารถสแกนเข้าคิวแล้วเข้าไปใน Line ได้", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "อธิบายรายละเอียดของปุ่มต่างๆ ในหน้าจอ", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "รับคิว / จองคิว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "พิมพ์บิลซ้ำ", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "เรียกคิว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "การกดเอาคิวเข้าร้าน", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "ยกเลิกคิว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "การเรียกคิวไปต่อแถวใหม่", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "ทดสอบคิวก่อนเปิดร้าน", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "ล้างคิว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "กำหนดคิวเองจากแอป KIOSK และ Staff", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "เช็ก Printer", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        { text: "การใช้งานระบบคิว\nสำหรับลูกค้า", alignment: "center", rowSpan: 4, margin: [0, 23] },
                        { text: "การจองคิว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "การดูการเรียกคิว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "การยกเลิกคิว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "การส่งต่อคิวให้คนอื่น", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        { text: "การดูรายงาน HQ", alignment: "center" },
                        { text: "ดูรายงานจองคิว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                ],
                margin: [0, -25],
            },
        },
        {
            table: {
                widths: [55, 160, 'auto', 120, 20, '*'],
                body: [
                    [
                        { text: "ผู้เข้าอบรม : ", alignment: "right" },
                        { text: ".............................................................................", alignment: "left", bold: false },
                        { text: "ตำแหน่ง : ", alignment: "right" },
                        { text: ".........................................................", alignment: "left", bold: false },
                        { text: "วันที่ : ", alignment: "right" },
                        { text: "..........................................", alignment: "left", bold: false },
                    ],
                    [
                        { text: "ผู้เข้าอบรม : ", alignment: "right" },
                        { text: ".............................................................................", alignment: "left", bold: false },
                        { text: "ตำแหน่ง : ", alignment: "right" },
                        { text: ".........................................................", alignment: "left", bold: false },
                        { text: "วันที่ : ", alignment: "right" },
                        { text: "..........................................", alignment: "left", bold: false },
                    ],
                    [
                        { text: "ผู้เข้าอบรม : ", alignment: "right" },
                        { text: ".............................................................................", alignment: "left", bold: false },
                        { text: "ตำแหน่ง : ", alignment: "right" },
                        { text: ".........................................................", alignment: "left", bold: false },
                        { text: "วันที่ : ", alignment: "right" },
                        { text: "..........................................", alignment: "left", bold: false },
                    ],
                    [
                        { text: "ผู้เข้าอบรม : ", alignment: "right" },
                        { text: ".............................................................................", alignment: "left", bold: false },
                        { text: "ตำแหน่ง : ", alignment: "right" },
                        { text: ".........................................................", alignment: "left", bold: false },
                        { text: "วันที่ : ", alignment: "right" },
                        { text: "..........................................", alignment: "left", bold: false },
                    ],
                    [
                        { text: "ผู้เข้าอบรม : ", alignment: "right" },
                        { text: ".............................................................................", alignment: "left", bold: false },
                        { text: "ตำแหน่ง : ", alignment: "right" },
                        { text: ".........................................................", alignment: "left", bold: false },
                        { text: "วันที่ : ", alignment: "right" },
                        { text: "..........................................", alignment: "left", bold: false },
                    ],
                ],
            },
            margin: [0, 18],
            layout: "noBorders",
        },
        {
            table: {
                widths: [55, 160, 'auto', 120, 20, '*'],
                body: [
                    [
                        { text: "พนักงานผู้สอน : ", alignment: "right" },
                        { text: ".............................................................................", alignment: "left", bold: false },
                        { text: "ตำแหน่ง : ", alignment: "right" },
                        { text: ".........................................................", alignment: "left", bold: false },
                        { text: "วันที่ : ", alignment: "right" },
                        { text: "..........................................", alignment: "left", bold: false },
                    ],
                    [
                        { text: "พนักงานผู้สอน : ", alignment: "right" },
                        { text: ".............................................................................", alignment: "left", bold: false },
                        { text: "ตำแหน่ง : ", alignment: "right" },
                        { text: ".........................................................", alignment: "left", bold: false },
                        { text: "วันที่ : ", alignment: "right" },
                        { text: "..........................................", alignment: "left", bold: false },
                    ],
                ],
            },
            layout: "noBorders",
        },
    ],

    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [30, 30, 30, 20], // เพิ่ม top margin ให้ header ไม่ทับ content
    styles: {
        header: { fontSize: 20, bold: true },
        subheader: { fontSize: 14, bold: true },
        normal: { fontSize: 12 },
    },
});
