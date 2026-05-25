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

interface PaymentConfirmedEmailProps {
  firstName: string;
  lastName: string;
  seminars: SeminarLine[];
}

export const PaymentConfirmedEmail = ({
  firstName,
  lastName,
  seminars,
}: PaymentConfirmedEmailProps) => {
  const fullName = `${firstName} ${lastName}`.trim();
  const multiple = seminars.length > 1;

  return (
    <Html>
      <Head />
      <Preview>Inscription confirmée</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={salam}>
            Assalâm aleykum wa rahmatullâhi wa barakâtuh,
          </Text>

          <Heading style={h1}>Bârak Allâhu fîk, {firstName}.</Heading>

          <Text style={text}>
            Votre paiement a bien été reçu. L&apos;inscription de{" "}
            <strong>{fullName}</strong>{" "}
            {multiple ? "aux séminaires suivants est confirmée" : "au séminaire suivant est confirmée"} :
          </Text>

          <Section style={section}>
            {seminars.map((s, i) => (
              <Text key={i} style={listItem}>
                • {s.title}
              </Text>
            ))}
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            Si vous payez en <strong>plusieurs fois</strong>, n&apos;oubliez pas
            de régler vos échéances afin de faciliter l&apos;organisation et de
            respecter vos engagements.
          </Text>

          <Text style={text}>
            Vous recevrez prochainement un lien pour rejoindre le{" "}
            <strong>groupe privé Telegram</strong> où toutes les informations,
            les lives, les rediffusions, etc. seront communiqués.
          </Text>

          <Text style={text}>
            Pour toute question, contactez-nous par mail en{" "}
            <strong>répondant directement à ce message</strong>.
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

export default PaymentConfirmedEmail;

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
