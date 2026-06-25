import { Resend } from "resend";

declare global {
  var resendClients: Map<string, Resend> | undefined;
}

const clients = global.resendClients ?? new Map<string, Resend>();
if (process.env.NODE_ENV !== "production") global.resendClients = clients;

export function resendForKey(key: string): Resend {
  let client = clients.get(key);
  if (!client) {
    client = new Resend(key);
    clients.set(key, client);
  }
  return client;
}
