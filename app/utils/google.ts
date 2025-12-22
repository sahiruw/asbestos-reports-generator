import { google } from "googleapis";

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
//   sheets
    "https://www.googleapis.com/auth/spreadsheets",
];

const serviceAccount = JSON.parse(
  Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT!, "base64").toString("utf-8")
);

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: SCOPES,
});


export const getGoogleServices = () => {
  const drive = google.drive({ version: "v3", auth });
  const sheets = google.sheets({ version: "v4", auth });
  return { drive, sheets };
};