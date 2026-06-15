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

interface CourseLinkEmailProps {
  firstName: string;
  seminars: SeminarLine[];
  courseLink: string;
  telegramLink?: string;
  customContent?: string;
}

export const CourseLinkEmail = ({
  firstName,
  seminars,
  courseLink,
  telegramLink,
  customContent,
}: CourseLinkEmailProps) => {
  const multiple = seminars.length > 1;

  return (
    <Html>
      <Head />
      <Preview>Lien du premier cours — {seminars[0].title}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={salam}>
            Assalâm aleykum wa rahmatullâhi wa barakâtuh,
          </Text>

          <Heading style={h1}>Bienvenue, {firstName}.</Heading>

          <Text style={text}>
            Nous sommes heureux de vous compter parmi nous pour {multiple ? "ces séminaires" : "ce séminaire"} :
          </Text>

          <Section style={section}>
            {seminars.map((s, i) => (
              <Text key={i} style={listItem}>
                • {s.title}
              </Text>
            ))}
          </Section>

          {customContent && (
            <Text style={text}>
              {customContent}
            </Text>
          )}

          <Hr style={hr} />

          <Text style={text}>
            Voici le lien pour rejoindre le <strong>premier cours</strong> en direct :
          </Text>

          <Section style={buttonContainer}>
            <Link href={courseLink} style={button}>
              Rejoindre le cours
            </Link>
          </Section>

          {telegramLink && (
            <>
              <Text style={text}>
                N&apos;oubliez pas de rejoindre également le <strong>groupe Telegram</strong> dédié pour ne rien manquer (lives, rediffusions, supports PDF) :
              </Text>
              <Section style={buttonContainer}>
                <Link href={telegramLink} style={secondaryButton}>
                  Rejoindre le groupe Telegram
                </Link>
              </Section>
            </>
          )}

          <Hr style={hr} />

          <Text style={text}>
            Si vous avez la moindre question, n&apos;hésitez pas à nous contacter en répondant directement à cet email.
          </Text>

          <Text style={footer}>
            Qu&apos;Allah vous facilite l&apos;apprentissage profitable.
            <br />
            Bārak Allāhu fikum  🤲🌹.
            <br />
            Dr. AbdelRahman Abou Abdelwahab
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default CourseLinkEmail;

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
  backgroundColor: "#546b43",
  borderRadius: "8px",
  color: "#fbefdf",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const secondaryButton = {
  backgroundColor: "#fbefdf",
  border: "1px solid #546b43",
  borderRadius: "8px",
  color: "#546b43",
  fontSize: "14px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "10px 20px",
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
