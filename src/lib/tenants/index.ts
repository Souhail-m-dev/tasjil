import { headers } from "next/headers";
import type { TenantConfig } from "./types";
import { seminaire } from "./seminaire";
import { institut } from "./institut";

export type { TenantConfig, TenantTheme } from "./types";

const TENANTS: TenantConfig[] = [seminaire, institut];
const DEFAULT_TENANT = seminaire;

export function tenantByHost(host: string | null | undefined): TenantConfig {
  if (!host) return DEFAULT_TENANT;
  const h = host.split(":")[0].toLowerCase();
  return TENANTS.find((t) => t.hosts.includes(h)) ?? DEFAULT_TENANT;
}

export function tenantBySlug(slug: string | null | undefined): TenantConfig {
  return TENANTS.find((t) => t.slug === slug) ?? DEFAULT_TENANT;
}

/** Resolve the active tenant for the current server request from the Host header.
 *  On localhost (no host match) the NEXT_PUBLIC_TENANT env overrides, else default. */
export async function getTenant(): Promise<TenantConfig> {
  const h = await headers();
  const host = h.get("host");
  const byHost = tenantByHost(host);
  if (byHost !== DEFAULT_TENANT) return byHost;

  const envSlug = process.env.NEXT_PUBLIC_TENANT;
  if (envSlug) return tenantBySlug(envSlug);
  return DEFAULT_TENANT;
}
