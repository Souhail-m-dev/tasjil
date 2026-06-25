import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { BOTH_SEMINARS_PRICE_EUR } from "@/lib/schemas/registration";
import type { EmailBrand } from "@/lib/email/brand";

export interface SeminarLine {
  title: string;
  price?: number | null;
}

interface ReceivedEmailProps {
  firstName: string;
  lastName: string;
  seminars: SeminarLine[];
  paymentMethod: string;
  brand: EmailBrand;
}

export const ReceivedEmail = ({
  firstName,
  lastName,
  seminars,
  paymentMethod,
  brand,
}: ReceivedEmailProps) => {
  const method = (paymentMethod || "").toLowerCase();
  const fullName = `${firstName} ${lastName}`.trim();
  const multiple = seminars.length > 1;
  const total = seminars.length === 2 
    ? BOTH_SEMINARS_PRICE_EUR 
    : seminars.reduce(
        (sum, s) => sum + (typeof s.price === "number" ? s.price : 0),
        0,
      );

  return (
    <Html>
      <Head />
      <Preview>Confirmation de votre inscription</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={salam}>
            Assalâm aleykum wa rahmatullâhi wa barakâtuh,
          </Text>

          <Heading style={h1}>Bârak Allâhu fîk, {firstName}.</Heading>

          <Text style={text}>
            Nous avons bien enregistré l&apos;inscription de <strong>{fullName}</strong>
            {" "}
            {multiple ? `pour les ${brand.unitPlural} suivants` : `pour le ${brand.unit} suivant`} :
          </Text>

          <Section style={section}>
            {seminars.map((s, i) => (
              <Text key={i} style={listItem}>
                • {s.title}
                {s.price != null && !multiple && (
                  <span style={priceTag}> — {s.price} €</span>
                )}
              </Text>
            ))}
          </Section>

          {total > 0 && (
            <Text style={text}>
              Le montant total de votre inscription est de : <strong>{total} €</strong>.
            </Text>
          )}

          <Hr style={hr} />

          {brand.payment ? (
            <>
              <Heading style={h2}>Modalités de paiement</Heading>

              {method === "paypal" && brand.paypalEmail && (
                <Text style={text}>
                  Si vous souhaitez passer par <strong>PayPal</strong>, veuillez s&apos;il
                  vous plaît faire le paiement en <strong>envoi d&apos;argent entre proches</strong>,
                  et <strong>SANS mettre de commentaire</strong> sur PayPal au risque de bloquer
                  le paiement.
                </Text>
              )}

              {brand.paypalEmail && (
                <Text style={text}>
                  <strong>PayPal</strong> — adresse mail pour le paiement :{" "}
                  <a href={`mailto:${brand.paypalEmail}`} style={link}>
                    {brand.paypalEmail}
                  </a>
                </Text>
              )}

              {brand.paypalEmail && (
                <Section style={warnBox}>
                  <Text style={warnText}>
                    ⚠️ <strong>TRÈS IMPORTANT</strong> — effectuez le paiement en{" "}
                    <strong>envoi d&apos;argent entre proches</strong> et{" "}
                    <strong>SANS AUCUN commentaire</strong>, sinon le paiement
                    risque d&apos;être bloqué. 🙏
                  </Text>
                </Section>
              )}

              {brand.revolutHandle && (
                <Text style={text}>
                  <strong>Revolut</strong> : <code style={code}>@{brand.revolutHandle}</code>
                </Text>
              )}

              {brand.whatsapp && (
                <Text style={text}>
                  <strong>En espèces</strong> — merci de prendre contact par WhatsApp
                  sur ce numéro et communiquer votre nom et prénom pour convenir d&apos;une remise en main propre :{" "}
                  <a href={`https://wa.me/${brand.whatsapp.replace(/[^0-9]/g, "")}`} style={link}>
                    {brand.whatsapp}
                  </a>
                </Text>
              )}

              <Hr style={hr} />
            </>
          ) : (
            <>
              <Text style={text}>
                Les modalités de paiement des frais d&apos;inscription vous seront
                communiquées prochainement par notre équipe.
              </Text>

              <Hr style={hr} />
            </>
          )}

          <Text style={text}>
            Pour toute demande ou question particulière, merci de{" "}
            <strong>répondre directement à ce mail</strong>.
          </Text>

          <Text style={footer}>
            Bārak Allāhu fikum  🤲🌹.
            <br />
            {brand.signature}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReceivedEmail;

const main = {
  backgroundColor: "#fcf9f3",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  color: "#202819",
};

const container = {
  margin: "0 auto",
  padding: "32px 24px 48px",
  maxWidth: "580px",
};

const salam = {
  color: "#1e3024",
  fontSize: "14px",
  fontStyle: "italic" as const,
  margin: "0 0 12px",
};

const h1 = {
  color: "#0d1f14",
  fontSize: "22px",
  fontWeight: 700 as const,
  margin: "0 0 18px",
};

const h2 = {
  color: "#0d1f14",
  fontSize: "16px",
  fontWeight: 700 as const,
  margin: "20px 0 10px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
};

const text = {
  color: "#202819",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "10px 0",
};

const warnBox = {
  background: "#fbe9d3",
  border: "1px solid #e2a04a",
  borderLeft: "5px solid #c97a16",
  borderRadius: "8px",
  padding: "12px 16px",
  margin: "6px 0 14px",
};

const warnText = {
  color: "#7a4a0d",
  fontSize: "15px",
  fontWeight: 600 as const,
  lineHeight: "23px",
  margin: 0,
};

const section = {
  padding: "8px 0",
};

const listItem = {
  color: "#202819",
  fontSize: "15px",
  margin: "4px 0",
};

const priceTag = {
  color: "#546b43",
  fontWeight: 700 as const,
};

const hr = {
  borderColor: "#d6cfc0",
  margin: "22px 0",
};

const link = {
  color: "#1e3024",
  textDecoration: "underline",
};

const code = {
  background: "#f3efe5",
  padding: "2px 6px",
  borderRadius: "4px",
  fontFamily: "Menlo, Consolas, monospace",
  fontSize: "14px",
  color: "#0d1f14",
};

const footer = {
  color: "#5e6353",
  fontSize: "13px",
  lineHeight: "20px",
  marginTop: "28px",
};
