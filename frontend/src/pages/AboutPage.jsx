import {
  Avatar,
  Heading,
  Text,
  Link,
  VStack,
  HStack,
  Icon,
  Flex,
  Spacer,
  Tooltip,
} from "@chakra-ui/react";
import { useUserStore } from "../store/user";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

const AboutPage = () => {
  const { user } = useUserStore();

  return (
    <Flex direction="column" minHeight="90vh">
      <VStack spacing={4} align="center" flex="1">
        <Avatar size="2xl" name={user?.name} src={user?.avatar_url} />
        <Heading as="h1" size="xl">
          About the Developer
        </Heading>
        <Text as="b" fontSize="xl" textAlign="center">
          {user?.bio}
        </Text>

        <Text fontSize="lg">
          Hi, I&apos;m {user?.name}, a passionate software developer with
          experience in building web applications using modern technologies like
          React, Node.js, and MongoDB.
        </Text>
        <Text fontSize="lg" textAlign="center">
          I am particularly interested in both frontend and backend
          technologies, always eager to learn and implement new tools and
          frameworks. My goal is to create seamless and efficient user
          experiences while maintaining robust and scalable backend systems.
        </Text>
      </VStack>
      <Spacer />
      <HStack spacing={4} justify="center">
        <Tooltip label="GitHub Profile" aria-label="GitHub Tooltip">
          <Link href={user?.html_url} isExternal>
            <Icon as={FaGithub} boxSize={6} />
          </Link>
        </Tooltip>
        <Tooltip label="LinkedIn Profile" aria-label="LinkedIn Tooltip">
          <Link href="https://linkedin.com/in/jeevan-george-antony/" isExternal>
            <Icon as={FaLinkedin} boxSize={6} />
          </Link>
        </Tooltip>
        <Tooltip label="Send Email" aria-label="Email Tooltip">
          <Link href={`mailto:antony.jeevangeorge@gmail.com`} isExternal>
            <Icon as={FaEnvelope} boxSize={6} />
          </Link>
        </Tooltip>
      </HStack>
    </Flex>
  );
};

export default AboutPage;
