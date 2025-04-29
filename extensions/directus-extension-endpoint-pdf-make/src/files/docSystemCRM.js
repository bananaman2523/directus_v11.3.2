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

        { text: "เอกสารการทดสอบระบบ CRM", alignment: "center", style: "header" },
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
                widths: ['auto', '*', 50],
                body: [
                    [
                        { text: "หัวข้อ", alignment: "center", bold: true },
                        { text: "รายละเอียด", alignment: "center", bold: true },
                        { text: "สถานะ", alignment: "center", bold: true },
                    ],
                    [
                        { text: "การเชื่อมต่อระบบ LINE", alignment: "center" },
                        { text: "เชื่อมต่อ Line@ เพื่อสมัครสมาชิกได้", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        { text: "ทดสอบการสร้างสมาชิกและ\nทำธุรกรรมผ่านไลน์", alignment: "center", rowSpan: 19, margin: [0, 170] },
                        { text: " การสมัครผ่าน Line", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "การโชว์ ข้อความยอมรับข้อมูลส่วนบุคคล", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "การโชว์ FAQs", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "การโชว์ หน้าแก้ไขข้อมูลส่วนตัว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "การใส่ข้อมูลส่วนตัว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "การแก้ไขข้อมูลส่วนตัว", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า Profile - ข้อมูลสมาชิกถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า Profile - คะแนนสะสมถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า Profile - คะแนนที่จะหมดอายุถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า Profile - Points คงเหลือถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า Profile - ยอด Top Up ที่ใช้ไปถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า Profile - เงินที่คงเหลือถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า บัตรสมาชิก - ระดับสมาชิกถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า บัตรสมาชิก - ยอด Top Up รวมถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า สิทธิ - โชว์สิทธิที่มีถูกต้องตามระดับสมาชิก", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า คูปอง - โชว์คูปองที่กดแลกถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า คูปอง - โชว์คูปองที่ได้ฟรี หรือบัตรกำนัล ส่วนลดถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า รายละเอียดคูปอง - โชว์รายละเอียดเงื่อนไขการใช้คูปองถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า ประวัติใช้จ่าย - รายละเอียดในการทำธุรกรรมถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                ],
            },
            pageBreak: 'after'
        },
        {
            table: {
                widths: ['auto', '*', 50],
                body: [
                    [
                        { text: "หัวข้อ", alignment: "center", bold: true },
                        { text: "รายละเอียด", alignment: "center", bold: true },
                        { text: "สถานะ", alignment: "center", bold: true },
                    ],
                    [
                        { text: "ทดสอบการสร้างสมาชิกและ\nทำธุรกรรมผ่านไลน์", alignment: "center", rowSpan: 3, margin: [0, 10] },
                        { text: "หน้า ประวัติแลกคูปอง - รายละเอียดในการทำธุรกรรมถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า ประวัติใช้คูปอง - รายละเอียดในการทำธุรกรรมถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
                    [
                        {},
                        { text: "หน้า ประวัติ Top Up - รายละเอียดในการ Top Up ถูกต้อง", alignment: "left" },
                        { text: " ", alignment: "left" },
                    ],
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
