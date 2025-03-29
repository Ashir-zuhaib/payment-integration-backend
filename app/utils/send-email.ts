// import nodemailer from "nodemailer";

// /**
//  * Sends a verification token to a user's email address.
//  * @param {string} email - The recipient's email address.
//  * @param {string} token - The verification token.
//  * @returns {Promise<void>}
//  */
// export const sendVerificationToken = async (email: string, token: string): Promise<void> => {
//   try {
//     // Configure the Nodemailer transport
//     const transporter = nodemailer.createTransport({
//       host: "smtp.example.com", // Replace with your SMTP host (e.g., Gmail, Outlook, etc.)
//       port: 587, // Use 465 for secure (SSL), or 587 for TLS
//       secure: false, // Set true for SSL; false for TLS
//       auth: {
//         user: "your-email@example.com", // Replace with your email address
//         pass: "your-email-password",   // Replace with your email password or app password
//       },
//     });

//     // Email options
//     const mailOptions = {
//       from: '"Your App Name" <your-email@example.com>', // Sender address
//       to: email, // Recipient address
//       subject: "Email Verification", // Subject line
//       html: `
//         <p>Hello,</p>
//         <p>Please use the following verification token to verify your email address:</p>
//         <p><b>${token}</b></p>
//         <p>If you did not request this, please ignore this email.</p>
//       `,
//     };

//     // Send email
//     await transporter.sendMail(mailOptions);
//     console.log(`Verification email sent to ${email}`);
//   } catch (error) {
//     console.error("Error sending verification token:", error);
//     throw new Error("Failed to send verification email. Please try again later.");
//   }
// };
