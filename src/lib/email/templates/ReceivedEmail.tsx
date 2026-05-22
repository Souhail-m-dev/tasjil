import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from "@react-email/components";
import * as React from "react";

interface ReceivedEmailProps {
  firstName: string;
  seminarTitles: string[];
  paymentMethod: string;
}

export const ReceivedEmail = ({
  firstName,
  seminarTitles,
  paymentMethod,
}: ReceivedEmailProps) => {
  const paymentInstructions = () => {
    switch (paymentMethod?.toLowerCase()) {
      case "paypal":
        return "Veuillez effectuer votre paiement via PayPal à l'adresse suivante : [VOTRE_EMAIL_PAYPAL].";
      case "revolut":
        return "Veuillez effectuer votre paiement via Revolut en utilisant ce lien ou numéro : [VOTRE_LIEN_REVOLUT].";
      case "espece":
        return "Le paiement en espèces se fera sur place lors du premier jour du séminaire.";
      default:
        return "Veuillez nous contacter pour finaliser votre paiement.";
    }
  };

  return (
    <Html>
      <Head />
      <Preview>Nous avons reçu votre inscription</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Bonjour {firstName},</Heading>
          <Text style={text}>
            Nous avons bien reçu votre demande d'inscription pour les séminaires suivants :
          </Text>
          <Section style={section}>
            {seminarTitles.map((title, index) => (
              <Text key={index} style={listItem}>
                • {title}
              </Text>
            ))}
          </Section>
          <Hr style={hr} />
          <Heading style={h2}>Instructions de paiement</Heading>
          <Text style={text}>{paymentInstructions()}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Si vous avez des questions, n'hésitez pas à nous contacter.
            À bientôt !
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default ReceivedEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  padding: "17px 0 0",
  margin: "0",
};

const h2 = {
  color: "#333",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "20px 0 10px",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
};

const section = {
  padding: "12px 0",
};

const listItem = {
  color: "#333",
  fontSize: "16px",
  margin: "4px 0",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "24px",
};
