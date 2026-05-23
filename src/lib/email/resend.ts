import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;

declare global {
  var resendClient: Resend | undefined;
}

const getResend = () => {
  if (!RESEND_API_KEY) {
    console.error("[Resend] RESEND_API_KEY missing");
    return null;
  }
  if (global.resendClient) return global.resendClient;
  const client = new Resend(RESEND_API_KEY);
  if (process.env.NODE_ENV !== "production") {
    global.resendClient = client;
  }
  return client;
};

export const resend = getResend();
