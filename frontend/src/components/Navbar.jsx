import {
  Avatar,
  Button,
  Container,
  Flex,
  HStack,
  IconButton,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { PlusSquareIcon } from "@chakra-ui/icons";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { useUserStore } from "../store/user";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { user } = useUserStore();

  return (
    <Container maxW={"100vw"} px={4}>
      <Flex
        h={16}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexDir={{
          base: "column",
          sm: "row",
        }}
      >
        <Text
          fontSize={{ base: "22", sm: "28" }}
          fontWeight={"bold"}
          textTransform={"uppercase"}
          textAlign={"center"}
          bgGradient={"linear(to-r, cyan.400, blue.500)"}
          bgClip={"text"}
        >
          <Link to="/">Product Store 🛒</Link>
        </Text>
        <HStack spacing={2} alignItems={"center"}>
          <Link to="/create">
            <Button>
              <PlusSquareIcon fontSize={20} />
            </Button>
          </Link>
          <Button onClick={toggleColorMode}>
            {colorMode === "light" ? <IoMoon /> : <LuSun size="20" />}
          </Button>
          <Link to="/about">
            <IconButton
              isRound={true}
              variant="solid"
              aria-label="About the Developer"
              fontSize="20px"
              icon={
                <Avatar size="sm" name={user?.name} src={user?.avatar_url} />
              }
            />
          </Link>
        </HStack>
      </Flex>
    </Container>
  );
};

export default Navbar;
