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
import type { SeminarLine } from "./ReceivedEmail";
import { BOTH_SEMINARS_PRICE_EUR } from "@/lib/schemas/registration";

interface ReminderEmailProps {
  firstName: string;
  lastName: string;
  seminars: SeminarLine[];
  paymentMethod: string;
}

const PAYPAL_EMAIL = "zerroug.djallel@gmail.com";
const REVOLUT_HANDLE = "mohasou69";
const CASH_WHATSAPP = "+33 7 81 69 14 96";

const methodLabels: Record<string, string> = {
  paypal: "PayPal",
  revolut: "Revolut",
  espece: "Espèces / main propre",
};

export const ReminderEmail = ({
  firstName,
  lastName,
  seminars,
  paymentMethod,
}: ReminderEmailProps) => {
  const method = (paymentMethod || "").toLowerCase();
  const fullName = `${firstName} ${lastName}`.trim();
  const multiple = seminars.length > 1;
  const total = seminars.length === 2 
    ? BOTH_SEMINARS_PRICE_EUR 
    : seminars.reduce(
        (sum, s) => sum + (typeof s.price === "number" ? s.price : 0),
        0,
      );
  const chosenLabel = methodLabels[method] ?? "celui indiqué lors de l'inscription";

  return (
    <Html>
      <Head />
      <Preview>Rappel — paiement en attente</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={salam}>
            Assalâm aleykum wa rahmatullâhi wa barakâtuh,
          </Text>

          <Heading style={h1}>Rappel — {firstName} {lastName}</Heading>

          <Text style={text}>
            Pour rappel, l&apos;inscription de <strong>{fullName}</strong>{" "}
            {multiple ? "aux séminaires suivants a bien été enregistrée" : "au séminaire suivant a bien été enregistrée"} :
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

          <Text style={text}>
            Afin de procéder à la <strong>validation de votre inscription</strong>, merci de régler la somme correspondante
            {total > 0 && (
              <>
                {" "}: <strong>{total} €</strong>
              </>
            )}
            .
          </Text>

          <Hr style={hr} />

          <Heading style={h2}>Mode de paiement choisi</Heading>

          <Text style={text}>
            Vous aviez choisi : <strong>{chosenLabel}</strong>.
          </Text>

          {method === "paypal" && (
            <>
              <Text style={text}>
                <strong>PayPal</strong> — adresse mail pour le paiement :{" "}
                <a href={`mailto:${PAYPAL_EMAIL}`} style={link}>
                  {PAYPAL_EMAIL}
                </a>
              </Text>
              <Section style={warnBox}>
                <Text style={warnText}>
                  ⚠️ <strong>TRÈS IMPORTANT</strong> — effectuez le paiement en{" "}
                  <strong>envoi d&apos;argent entre proches</strong> et{" "}
                  <strong>SANS AUCUN commentaire</strong>, sinon le paiement
                  risque d&apos;être bloqué. 🙏
                </Text>
              </Section>
            </>
          )}

          {method === "revolut" && (
            <Text style={text}>
              <strong>Revolut</strong> : <code style={code}>@{REVOLUT_HANDLE}</code>
            </Text>
          )}

          {method === "espece" && (
            <Text style={text}>
              <strong>En espèces</strong> — merci de prendre contact par WhatsApp
              sur ce numéro pour convenir d&apos;une remise en main propre :{" "}
              <a href={`https://wa.me/${CASH_WHATSAPP.replace(/[^0-9]/g, "")}`} style={link}>
                {CASH_WHATSAPP}
              </a>
            </Text>
          )}

          <Hr style={hr} />

          <Heading style={h2}>Autres méthodes de paiement</Heading>

          {method !== "paypal" && (
            <>
              <Text style={text}>
                <strong>PayPal</strong> — adresse mail pour le paiement :{" "}
                <a href={`mailto:${PAYPAL_EMAIL}`} style={link}>
                  {PAYPAL_EMAIL}
                </a>
              </Text>
              <Section style={warnBox}>
                <Text style={warnText}>
                  ⚠️ <strong>TRÈS IMPORTANT</strong> — effectuez le paiement en{" "}
                  <strong>envoi d&apos;argent entre proches</strong> et{" "}
                  <strong>SANS AUCUN commentaire</strong>, sinon le paiement
                  risque d&apos;être bloqué. 🙏
                </Text>
              </Section>
            </>
          )}

          {method !== "revolut" && (
            <Text style={text}>
              <strong>Revolut</strong> : <code style={code}>@{REVOLUT_HANDLE}</code>
            </Text>
          )}

          {method !== "espece" && (
            <Text style={text}>
              <strong>En espèces</strong> — merci de prendre contact par WhatsApp
              sur ce numéro pour convenir d&apos;une remise en main propre :{" "}
              <a href={`https://wa.me/${CASH_WHATSAPP.replace(/[^0-9]/g, "")}`} style={link}>
                {CASH_WHATSAPP}
              </a>
            </Text>
          )}

          <Hr style={hr} />

          <Text style={text}>
            Pour toute question ou demande particulière, merci de{" "}
            <strong>répondre directement à ce mail</strong>.
          </Text>

          <Text style={footer}>
            Bārak Allāhu fikum  🤲🌹.
            <br />
            Dr. AbdelRahman Abou Abdelwahab
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReminderEmail;

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
