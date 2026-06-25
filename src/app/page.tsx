import { getTenant } from "@/lib/tenants";
import SeminaireLanding from "@/components/landings/seminaire-landing";
import InstitutLanding from "@/components/landings/institut-landing";

export default async function Landing() {
  const { slug } = await getTenant();
  return slug === "institut" ? <InstitutLanding /> : <SeminaireLanding />;
}
