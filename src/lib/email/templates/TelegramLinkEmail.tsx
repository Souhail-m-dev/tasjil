import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import type { SeminarLine } from "./ReceivedEmail";
import type { EmailBrand } from "@/lib/email/brand";

interface TelegramLinkEmailProps {
  firstName: string;
  seminars: SeminarLine[];
  telegramLink: string;
  brand: EmailBrand;
}

export const TelegramLinkEmail = ({
  firstName,
  seminars,
  telegramLink,
  brand,
}: TelegramLinkEmailProps) => {
  const multiple = seminars.length > 1;

  return (
    <Html>
      <Head />
      <Preview>Rejoignez votre groupe Telegram — {seminars[0].title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={salam}>
            Assalâm aleykum wa rahmatullâhi wa barakâtuh,
          </Text>

          <Heading style={h1}>Bienvenue, {firstName}.</Heading>

          <Text style={text}>
            Voici le lien pour rejoindre le <strong>groupe Telegram</strong> dédié à {multiple ? `vos ${brand.unitPlural}` : `votre ${brand.unit}`} :
          </Text>

          <Section style={section}>
            {seminars.map((s, i) => (
              <Text key={i} style={listItem}>
                • {s.title}
              </Text>
            ))}
          </Section>

          <Text style={text}>
            Ce groupe est indispensable pour ne rien manquer : lives, rediffusions, et supports PDF y seront partagés.
          </Text>

          <Section style={buttonContainer}>
            <Link href={telegramLink} style={button}>
              Rejoindre le groupe Telegram
            </Link>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Si vous avez la moindre question, n&apos;hésitez pas à nous contacter en répondant directement à cet email.
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

export default TelegramLinkEmail;

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

const buttonContainer = {
  textAlign: "center" as const,
  margin: "24px 0",
};

const button = {
  backgroundColor: "#0088cc", // Telegram Blue
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
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
