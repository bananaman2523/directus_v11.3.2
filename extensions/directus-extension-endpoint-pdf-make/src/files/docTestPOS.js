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

        { text: "เอกสารการฝึกอบรมผู้ใช้งานระบบ POS", alignment: "center", style: "header" },
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
            margin: [0, -2],
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
                widths: [120, 85, '*', 50],
                body: [
                    [
                        { "text": "หัวข้อ", "alignment": "center", "bold": true },
                        { "text": "รายละเอียด", "alignment": "center", "bold": true, "colSpan": 2 },
                        { "text": "" },
                        { "text": "สถานะ", "alignment": "center", "bold": true }
                    ],
                    [
                        { "text": "ความรู้ การดูแล", "alignment": "center" },
                        { "text": " แนะนำคุณสมบัติต่างๆ ของเครื่อง VIVIPOS และ Printer ต่างๆที่ทางแบรนด์ใช้", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "การแก้ปัญหาเครื่องและ", "alignment": "center" },
                        { "text": " การสังเกต การหาสาเหตุ การแก้ปัญหาอุปกรณ์ Error พื้นฐานที่สามารถแก้ไขได้ด้วยตนเอง", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "อุปกรณ์เบื้องต้น", "alignment": "center" },
                        { "text": " การทำ Preventive Maintenance เบื้องต้น (สำรวจระบบไฟ สำรวจการทำงานของอุปกรณ์ต่างๆ)", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "ความรู้พื้นฐานและการใช้งาน\nทั่วไป", "alignment": "center", "rowSpan": 23, margin: [0, 210] },
                        { "text": "การเข้าสู่ระบบ", "alignment": "left", "rowSpan": 5 },
                        { "text": "การเปิดเครื่องและการเข้าสู่ระบบ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "การตรวจสอบความพร้อมของเครื่องและอุปกรณ์", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "การตรวจสอบความพร้อมของ Printer และกระดาษ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "แนะนำการเปิดลิ้นชัก", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "การเตรียมเงินสำหรับการเปิดร้าน", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "การขาย", "alignment": "left", "rowSpan": 10 },
                        { "text": " การเข้าหน้าเมนูขาย", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การขายแบบปกติและแบบมีส่วนลด", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การขายแบบมีโปรโมชัน", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การขายแบบมีสมาชิก", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การยกเลิกสินค้าบางรายการระหว่างขาย", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การยกเลิกสินค้าทุกรายการ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การทำคืนสินค้าและการยกเลิกการขาย", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การพิมพ์ใบเสร็จย้อนหลัง", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การออกใบกำกับภาษีเต็มรูปแบบ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การตรวจสอบความถูกต้องของรายการสินค้า", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "การขายผ่าน IPAD", "alignment": "left", "rowSpan": 2 },
                        { "text": " วิธีการเข้าหน้า Log In ผ่าน IPAD", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "การเข้าสู่ระบบการขายผ่าน IPAD", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "การดูรายงาน การปิดกะ และการปิดร้าน", "alignment": "left", "rowSpan": 6 },
                        { "text": "การปิดกะ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การนับเงินเพื่อปิดกะ / ปิดร้าน", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การดูรายงานระหว่างวัน", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การพิมพ์รายงาน", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การดูรายงานการปิดร้าน", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การพิมพ์รายงานการปิดร้าน", "alignment": "left" },
                        { "text": "" }
                    ],
                ],
            },
            pageBreak: 'after'
        },
        {
            table: {
                widths: [120, 85, '*', 50],
                body: [
                    [
                        { "text": "หัวข้อ", "alignment": "center", "bold": true },
                        { "text": "รายละเอียด", "alignment": "center", "bold": true, "colSpan": 2 },
                        { "text": "" },
                        { "text": "สถานะ", "alignment": "center", "bold": true }
                    ],
                    [
                        { "text": "การตั้งค่าพื้นฐาน", "alignment": "center", "rowSpan": 5, margin: [0, 40] },
                        { "text": " การสร้างและตั้งค่าฟังก์ชันการทำงานของข้อมูลต่างๆ บนระบบ VIVIPOS", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "", "alignment": "center" },
                        { "text": " ข้อมูลสินค้าขายและการเพิ่ม/แก้ไขสินค้า", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "", "alignment": "center" },
                        { "text": " ข้อมูลโปรโมชั่นส่วนลด", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "", "alignment": "center" },
                        { "text": " ข้อมูลพนักงาน และสิทธิ์การเข้าถึง", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "", "alignment": "center" },
                        { "text": " ข้อมูลตำแหน่งครัว และเครื่องพิมพ์", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "การตั้งค่า Printer", "alignment": "center", "rowSpan": 3, margin: [0, 20] },
                        { "text": " การกำหนดและตั้งค่าระบบ Printer (ใบเสร็จ) ภายในเครื่อง", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "", "alignment": "center" },
                        { "text": " การกำหนดและตั้งค่าระบบ Lable Printer (สติ๊กเกอร์) ภายในเครื่อง", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "", "alignment": "center" },
                        { "text": " ทำความรู้จักและแนะนำ Port การเชื่อมต่อ Printer", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": "ระบบยอดขายออนไลน์\nOnline Cloud", "alignment": "center" },
                        { "text": " แนะนำการดูยอดขายและรายงานต่างๆ บน Web Online", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                ],
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
