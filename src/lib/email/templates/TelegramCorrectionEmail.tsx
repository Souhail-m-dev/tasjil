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
import type { EmailBrand } from "@/lib/email/brand";

interface TelegramCorrectionEmailProps {
  firstName: string;
  seminars: SeminarLine[];
  brand: EmailBrand;
}

export const TelegramCorrectionEmail = ({
  firstName,
  seminars,
  brand,
}: TelegramCorrectionEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Information importante concernant le groupe Telegram</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={salam}>
            Assalâm aleykum wa rahmatullâhi wa barakâtuh,
          </Text>

          <Heading style={h1}>Une précision, {firstName}.</Heading>

          <Text style={text}>
            Vous êtes inscrit(e) au {brand.unit} :
          </Text>

          <Section style={section}>
            {seminars.map((s, i) => (
              <Text key={i} style={listItem}>
                • {s.title}
              </Text>
            ))}
          </Section>

          <Text style={text}>
            Le lien du groupe Telegram communiqué dans notre précédent email
            était une erreur de notre part. <strong>Merci de ne pas le rejoindre.</strong>
          </Text>

          <Text style={text}>
            Le lien du groupe Telegram dédié à ce {brand.unit} vous sera envoyé en
            temps voulu, in shâ&apos; Allah.
          </Text>

          <Hr style={hr} />

          <Text style={text}>
            Nous vous prions de nous excuser pour la confusion. Pour toute
            question, répondez directement à cet email.
          </Text>

          <Text style={footer}>
            Qu&apos;Allah vous facilite l&apos;apprentissage profitable.
            <br />
            Bārak Allāhu fikum  🤲🌹.
            <br />
            {brand.signature}
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TelegramCorrectionEmail;

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

const text = {
  color: "#202819",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "10px 0",
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

const footer = {
  color: "#5e6353",
  fontSize: "13px",
  lineHeight: "20px",
  marginTop: "28px",
};
