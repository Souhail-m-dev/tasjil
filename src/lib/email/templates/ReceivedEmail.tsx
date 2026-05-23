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

interface ReceivedEmailProps {
  firstName: string;
  lastName: string;
  seminarTitles: string[];
  paymentMethod: string;
}

const PAYPAL_EMAIL = "zerroug.djallel@gmail.com";
const REVOLUT_HANDLE = "mohasou69";
const CASH_WHATSAPP = "+33 7 81 69 14 96";

export const ReceivedEmail = ({
  firstName,
  lastName,
  seminarTitles,
  paymentMethod,
}: ReceivedEmailProps) => {
  const method = (paymentMethod || "").toLowerCase();
  const fullName = `${firstName} ${lastName}`.trim();
  const multiple = seminarTitles.length > 1;

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
            {multiple ? "pour les séminaires suivants" : "pour le séminaire suivant"} :
          </Text>

          <Section style={section}>
            {seminarTitles.map((title, i) => (
              <Text key={i} style={listItem}>
                • {title}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          <Heading style={h2}>Modalités de paiement</Heading>

          {method === "paypal" && (
            <Text style={text}>
              Si vous souhaitez passer par <strong>PayPal</strong>, veuillez s&apos;il
              vous plaît faire le paiement en <strong>envoi d&apos;argent entre proches</strong>,
              et <strong>SANS mettre de commentaire</strong> sur PayPal au risque de bloquer
              le paiement.
            </Text>
          )}

          <Text style={text}>
            <strong>PayPal</strong> — adresse mail pour le paiement :{" "}
            <a href={`mailto:${PAYPAL_EMAIL}`} style={link}>
              {PAYPAL_EMAIL}
            </a>
            <br />
            <em style={subtle}>
              Envoi d&apos;argent entre proches, sans commentaire.
            </em>
          </Text>

          <Text style={text}>
            <strong>Revolut</strong> : <code style={code}>@{REVOLUT_HANDLE}</code>
          </Text>

          <Text style={text}>
            <strong>En espèces</strong> — merci de prendre contact par WhatsApp
            sur ce numéro pour convenir d&apos;une remise en main propre :{" "}
            <a href={`https://wa.me/${CASH_WHATSAPP.replace(/[^0-9]/g, "")}`} style={link}>
              {CASH_WHATSAPP}
            </a>
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Pour toute demande ou question particulière, merci de{" "}
            <strong>répondre directement à ce mail</strong>.
          </Text>

          <Text style={footer}>
            Wa Allâhu al-muwaffiq.
            <br />
            Dr. AbdelRahman Abou Abdelwahab
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

const subtle = {
  color: "#5e6353",
  fontSize: "13px",
};

const section = {
  padding: "8px 0",
};

const listItem = {
  color: "#202819",
  fontSize: "15px",
  margin: "4px 0",
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
