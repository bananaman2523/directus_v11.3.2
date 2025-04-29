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

        { text: "เอกสารการทดสอบระบบ POS", alignment: "center", style: "header" },
        { text: "เอกสารภายนอกบริษัท", alignment: "center", style: "normal" },
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
            margin: [0, 2],
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
            margin: [0, -2],
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
            margin: [0, 3],
            layout: "noBorders",
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
                        { "text": "การติดตั้งอุปกรณ์", "alignment": "center", "rowSpan": 25, margin: [0, 240] },
                        { "text": "Pos Monitor 1", "alignment": "left", "rowSpan": 7 },
                        { "text": "ข้อมูลได้รับการอัปเดตให้เป็นปัจจุบัน เช่น โปรโมชั่น, รายละเอียดสินค้า ฯลฯ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "สามารถทำการขาย ตั้งค่าและสิทธิ์ต่างๆ ได้ถูกต้อง", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "ตั้งค่า Store Contact", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "ตั้งค่า Network service", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "ตั้งค่า Network setting", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "ตั้งค่าวันที่และเวลาไทม์โซนให้ถูกต้อง", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "ตั้งค่า Printer Sharing ให้เครื่องพิมพ์ที่ต้องการใช้งาน (ในกรณีใช้งาน)", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "Pos Monitor 2", "alignment": "left", "rowSpan": 2 },
                        { "text": "Logo ของ Brandner มุมขวาของจอถูกต้องและตรงตามแบรนด์", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "รูปภาพสไลด์หรือวีดีโอบนหน้าจอแสดงผลถูกต้อง", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "Drawer", "alignment": "left" },
                        { "text": "เปิด - ปิดจากกุญแจได้ตามปกติ ทดสอบ เปิด - ปิด จากระบบได้ตามปกติ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "Receipt Printer", "alignment": "left", "rowSpan": 4 },
                        { "text": "Logo ของ Brandner บนหัวใบเสร็จถูกต้องและตรงตามแบรนด์", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "Drawer", "alignment": "left" },
                        { "text": "Template ของใบเสร็จตรงกับ Template ปัจจุบัน", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "Drawer", "alignment": "left" },
                        { "text": "บิลมีรายละเอียดตามที่ลูกค้าให้ข้อมูล", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "Drawer", "alignment": "left" },
                        { "text": "เครื่องพิมพ์ทำงานได้ตามปกติ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": " Kitchen Printer", "alignment": "left", "rowSpan": 3 },
                        { "text": "Template ของใบเสร็จตรงกับ Template ปัจจุบัน", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "บิลมีรายละเอียดตามที่ลูกค้าให้ข้อมูล", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": "เครื่องพิมพ์ทำงานได้ตามปกติ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "Lable Printer", "alignment": "left", "rowSpan": 3 },
                        { "text": " Template ของใบเสร็จตรงกับ Template ปัจจุบัน", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " บิลมีรายละเอียดตามที่ลูกค้าให้ข้อมูล", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " เครื่องพิมพ์ทำงานได้ตามปกติ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "Scanner", "alignment": "left" },
                        { "text": " สแกนบาร์โค้ดและแสดงผลลัพธ์ที่ตรงกับข้อมูล", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "UPS", "alignment": "left" },
                        { "text": " มีไฟเข้า สามารถสำรองไฟได้ และไม่ได้เชื่อมต่อกับอุปกรณ์อื่น", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "Ipad Order", "alignment": "left", "rowSpan": 2 },
                        { "text": " สามารถคีย์รายการสินค้าและส่งเข้าครัวได้ตามปกติ", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        {},
                        { "text": " สามารถเชื่อมต่อกับเครื่อง POS ได้", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        {},
                        { "text": "อื่นๆ", "alignment": "left", "colSpan": 2 },
                        {},
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
                        { "text": "ระบบออนไลน์", "alignment": "center", margin: [0, 7] },
                        { "text": "การเชื่อมต่อระบบ Cloud", "alignment": "left" },
                        { "text": "ยอดขายและรายงานต่างๆ จะถูกส่งไปยังระบบออนไลน์เมื่อ การติดตั้งเสร็จสมบูรณ์", "alignment": "left" },
                        { "text": "" }
                    ],
                    [
                        { "text": "Router Wifi", "alignment": "center", "rowSpan": 4, margin: [0, 30] },
                        { "text": "สามารถใช้งานอินเทอร์เน็ตได้ปกติ", "alignment": "left", "colSpan": 2 },
                        { "text": " " },
                        { "text": " " }
                    ],
                    [
                        { "text": " " },
                        { "text": "สามารถกระจายสัญญาณ Wi-Fi ได้ตามปกติ", "alignment": "left", "colSpan": 2 },
                        { "text": " " },
                        { "text": " " }
                    ],
                    [
                        { "text": " " },
                        { "text": "การตั้งค่า DHCP โดยกำหนด IP address ให้ไม่ทับซ้อนกันกับอุปกรณ์อื่น ๆ ในเครือข่าย", "alignment": "left", "colSpan": 2 },
                        { "text": " " },
                        { "text": " " }
                    ],
                    [
                        { "text": " " },
                        { "text": "สามารถเชื่อมต่อกับวง LAN ได้อย่างปกติ", "alignment": "left", "colSpan": 2 },
                        { "text": " " },
                        { "text": " " }
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
