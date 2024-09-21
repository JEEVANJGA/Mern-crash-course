import { useEffect, useState } from "react";
import { Box, Avatar, Heading, Text, Link, VStack, Spinner } from "@chakra-ui/react";
import axios from "axios";

const AboutPage = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGitHubData = async () => {
            try {
                const response = await axios.get("https://api.github.com/users/JEEVANJGA");
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching GitHub data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGitHubData();
    }, []);

    if (loading) {
        return (
            <Box p={5} textAlign="center">
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={5}>
            <VStack spacing={4} align="center">
                <Avatar size="2xl" name={userData.name} src={userData.avatar_url} />
                <Heading as="h1" size="xl">
                    About the Developer
                </Heading>
                <Text fontSize="lg" textAlign="center">
                    Hi, I&apos;m {userData.name}, a passionate software developer with
                    experience in building web applications using modern technologies like
                    React, Node.js, and MongoDB.
                </Text>
                <Text fontSize="lg" textAlign="center">
                    You can find more about my work on my{" "}
                    <Link color="teal.500" href={userData.html_url} isExternal>
                        GitHub profile
                    </Link>
                    .
                </Text>
            </VStack>
        </Box>
    );
};

export default AboutPage;
