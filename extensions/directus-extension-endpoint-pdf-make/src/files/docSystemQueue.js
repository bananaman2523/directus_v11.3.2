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

        { text: "เอกสารการทดสอบระบบ Queue", alignment: "center", style: "header" },
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
                widths: [70, '*'],
                body: [
                    [
                        { text: "สถานที่ : ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                    ],
                ],
            },
            // margin: [0, -2],
            layout: "noBorders",
        },
        {
            table: {
                widths: [70, 130, 'auto', 110, 'auto', '*'],
                body: [
                    [
                        { text: "วันที่ : ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                        { text: "เวลาเริ่มต้น : ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                        { text: "เวลาสิ้นสุด : ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                    ],
                ],
            },
            margin: [0, 5],
            layout: "noBorders",
        },
        {
            table: {
                widths: [150, '*', 50],
                body: [
                    [
                        { text: "หัวข้อ", alignment: "center", bold: true },
                        { text: "รายละเอียด", alignment: "center", bold: true },
                        { text: "สถานะ", alignment: "center", bold: true },
                    ],
                    [
                        { text: "การเชื่อมต่อ LINE Liff กับระบบ Queue", alignment: "center" },
                        { text: "สามารถสแกนเข้าคิวแล้วเข้าไปใน Line ได้", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        { text: "พนักงานจองคิว", alignment: "center", rowSpan: 16, margin: [0, 133] },
                        { text: "หน้าจอพนักงาน สามารถกดจองคิวและระบุจำนวนลูกค้าได้", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "มีป๊อปอัพก่อนกดจองคิวว่าลูกค้าเคยมาทานหรือไม่เคย", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "Printer สามารถปริ๊นท์บัตรคิวได้", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "เห็นรายการคิวลูกค้า", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "เรียกคิว ปัจจุบันจะมีเสียงเรียกคิว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "กดกระดิ่งเรียกเตือนคิวได้", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "เรียกคิวที่ผ่านไปแล้วได้ โดยจะไม่ประกาศเสียง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "สามารพิมพ์บัตรคิวซ้ำได้", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "สามารถกดยกเลิกคิวได้", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "สามารถกดข้ามคิวได้", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "จำนวนเวลารอลูกค้าเข้าร้าน 5 นาทีถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "สามารถกดล้างคิวเมื่อยังไม่กดเข้าร้านได้", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "ข้อมูลแสดงผลจำนวนรวมของคิวแสดงผลถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "ตั้งค่า IP Printer ตรงกับตั้งค่าในแอพ Queue", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "เลข Branch ID ตรงกับสาขาที่ใช้ในการติดตั้ง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้าตั้งค่ามีข้อมูลในการตั้งค่าครบถ้วนสมบูรณ์", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        { text: "ลูกค้ารับคิว", alignment: "center", rowSpan: 7, margin: [0, 60] },
                        { text: "ได้รับข้อความแจ้งลิ้งค์ดูคิว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [{}, { text: "เข้าลิ้งค์ดูคิวของตัวเองได้", alignment: "left" }, { text: " ", alignment: "left" }],
                    [{}, { text: "ได้รับข้อความเรียกเมื่อใกล้ถึงคิว", alignment: "left" }, { text: " ", alignment: "left" }],
                    [{}, { text: "ยกเลิกคิวได้ คิวจะหายไป", alignment: "left" }, { text: " ", alignment: "left" }],
                    [{}, { text: "ส่งต่อให้เพื่อนได้ โดยคิวของตัวเองจะหายไป", alignment: "left" }, { text: " ", alignment: "left" }],
                    [{}, { text: "ข้อความที่แสดงคำแนะนำบนหน้าไลน์ถูกต้อง", alignment: "left" }, { text: " ", alignment: "left" }],
                    [{}, { text: "สามารถกดเลือกสาขาผ่าน Rich Menu ได้และมีสาขาครบถ้วน", alignment: "left" }, { text: " ", alignment: "left" }],
                ],
            },
            pageBreak: 'after'
        },
        {
            table: {
                widths: [150, '*', 50],
                body: [
                    [
                        { text: "หัวข้อ", alignment: "center", bold: true },
                        { text: "รายละเอียด", alignment: "center", bold: true },
                        { text: "สถานะ", alignment: "center", bold: true },
                    ],
                    [
                        { text: "การแสดงผลบนทีวี", alignment: "center", rowSpan: 3, margin: [0, 20] },
                        { text: "การแสดงผลของคิวถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [{}, { text: "สื่อวิดีโอข้อมูลถูกต้อง", alignment: "left" }, { text: " ", alignment: "left" }],
                    [{}, { text: "ดีไซน์, สีแบ็คกราวด์, ตำแหน่งตัวอักษรถูกต้อง", alignment: "left" }, { text: " ", alignment: "left" }]
                ],
            },
        },
        {
            table: {
                widths: ['*'],
                body: [
                    [
                        { text: "บันทึกเพิ่มเติม :  .................................................................................................................................................................................................................................................", alignment: "left" },
                    ],
                    [
                        { text: ".............................................................................................................................................................................................................................................................................", alignment: "left" },
                    ],
                    [
                        { text: ".............................................................................................................................................................................................................................................................................", alignment: "left" },
                    ],
                ],
            },
            margin: [0, 10],
            layout: "noBorders",
        },
        {
            table: {
                widths: [70, 80, 'auto', 80, 'auto', 75, 34, '*'],
                body: [
                    [
                        { text: "พนักงานผู้ให้บริการ : ", alignment: "right" },
                        { text: "......................................", alignment: "left" },
                        { text: "ตำแหน่ง : ", alignment: "right" },
                        { text: "......................................", alignment: "left" },
                        { text: "ผู้รับบริการ : ", alignment: "right" },
                        { text: "......................................", alignment: "left" },
                        { text: "ตำแหน่ง : ", alignment: "right" },
                        { text: "...........................", alignment: "left" },
                    ],
                    [
                        { text: " ", alignment: "right" },
                        { text: "(กรุณาเขียนตัวบรรจง)", alignment: "center", bold: true },
                        { text: " ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                        { text: " ", alignment: "right" },
                        { text: "(กรุณาเขียนตัวบรรจง)", alignment: "left", bold: true, colSpan: 2 },
                        { text: " ", alignment: "left" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                    ],
                    [
                        { text: "วันที่ : ", alignment: "right" },
                        { text: "......................................", alignment: "left" },
                        { text: " ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                        { text: "วันที่ : ", alignment: "right" },
                        { text: "......................................", alignment: "left" },
                        { text: " ", alignment: "right" },
                        { text: " ", alignment: "left", color: "#4285f4", bold: true },
                    ],
                ],
            },
            margin: [0, 5],
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
