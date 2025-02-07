import nodemailer from "nodemailer"

export default ({ filter, action }, { services }) => {
    const { ItemsService } = services;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ronnakornniseansut@gmail.com",
            pass: "doyhhqqwfaqpakmk",
        },
    });
    action("productlist.items.create", async ({ payload, key, collection }) => {
        if (collection === "productlist") {
            const mailOptions = {
                from: "pattarapll28.29@gmail.com",
                to: "pattarapll64.23@gmail.com",
                subject: "New Item Created",
                text: `A new item has been created in the ${collection} collection.`,
            };

            try {
                await transporter.sendMail(mailOptions);
                console.log("Email sent successfully");
            } catch (error) {
                console.error("Error sending email:", error);
            }
        }
    });
};
