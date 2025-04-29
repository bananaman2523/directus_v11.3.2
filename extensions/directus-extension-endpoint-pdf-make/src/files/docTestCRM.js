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

        { text: "เอกสารการฝึกอบรมผู้ใช้งานระบบ CRM", alignment: "center", style: "header" },
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
            table: {
                widths: [90, 130, '*', 30],
                body: [
                    [
                        { "text": "หัวข้อ", "alignment": "center", "bold": true },
                        { "text": "รายละเอียด", "alignment": "center", "bold": true, "colSpan": 2 },
                        { "text": "" },
                        { "text": "สถานะ", "alignment": "center", "bold": true }
                    ],
                    [
                        { "text": "สอนการใช้งานระบบสำหรับ\nพนักงานหน้าร้าน", "alignment": "center", "rowSpan": 17, margin: [0, 180] },
                        { "text": "การทำงานของ LINE Member", "alignment": "left", "rowSpan": 2 },
                        { "text": "การเชื่อมต่อ LINE Member กับระบบ CRM ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "การผูกบัญชี LINE กับโปรไฟล์สมาชิกในระบบ CRM", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "การใช้งาน Back Office ของระบบ CRM", "alignment": "left", "rowSpan": 3 },
                        { "text": "การเข้าสู่ระบบ Back Office ด้วยบัญชีผู้ดูแล", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "การจัดการข้อมูลหลัก เช่น รายชื่อลูกค้า, การตั้งค่าการใช้งานระบบ, และการกำหนดสิทธิ์การใช้งาน", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        {},
                        {},
                        { "text": "การดูข้อมูลสมาชิกและตรวจสอบกิจกรรมต่างๆ ของสมาชิก", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        {},
                        { "text": "การสร้างหรือสมัครสมาชิก, สร้างกลุ่มตามระดับ, สร้างกลุ่มเพื่อส่งคูปอง", "alignment": "left", "rowSpan": 3 },
                        { "text": " วิธีการสมัครสมาชิกใหม่ในระบบ: กรอกข้อมูลพื้นฐาน เช่น ชื่อ, เบอร์โทร, อีเมล", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การสร้างกลุ่มสมาชิกตามระดับ เช่น ระดับ Silver, Gold, Platinum", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        {},
                        {},
                        { "text": " การตั้งค่ากลุ่มสมาชิกเพื่อส่งคูปองเฉพาะกิจ เช่น คูปองโปรโมชั่นเฉพาะระดับ Gold", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        {},
                        { "text": "การแก้ไขคะแนนหลังบ้านและข้อมูล\nสมาชิก, สร้างกลุ่มตามระดับ, สร้างกลุ่มเพื่อส่งคูปอง", "alignment": "left", "rowSpan": 2 },
                        { "text": " การปรับแก้คะแนนสะสมของสมาชิก เช่น เพิ่ม/ลดคะแนนด้วยเหตุผลเฉพาะ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การแก้ไขข้อมูลส่วนตัว เช่น เบอร์โทรศัพท์, ที่อยู่ หรือข้อมูลอื่นๆ ผ่าน Back Office", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        {},
                        { "text": " การเพิ่มสโตร์หลังบ้าน, การสร้างกฎแลกคะแนน", "alignment": "left", "rowSpan": 2 },
                        { "text": " การเพิ่มข้อมูลสโตร์ใหม่ในระบบ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " การสร้างกฎการแลกคะแนน เช่น 100 คะแนน = ส่วนลด 50 บาท", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": " ", "alignment": "left" },
                        { "text": " การสร้างคูปองส่วนลด, การส่งคูปองให้สมาชิก", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": " ", "alignment": "left" },
                        { "text": " การเพิ่ม Top Up และรายงานการเติม Top Up", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": " ", "alignment": "left" },
                        { "text": " การดูรายงาน Top Up", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": " ", "alignment": "left" },
                        { "text": " การดูรายงานภาครวมของสมาชิก", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                    [
                        { "text": " ", "alignment": "left" },
                        { "text": " การใช้งานการเปลี่ยนแปลงเบอร์สมาชิก, การลบสมาชิก", "alignment": "left", "colSpan": 2 },
                        { "text": " ", "alignment": "left" },
                        { "text": " " }
                    ],
                ],
            },
            margin: [0, -10],
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
