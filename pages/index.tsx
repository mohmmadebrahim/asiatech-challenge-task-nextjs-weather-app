import {
  Box,
  Flex,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";
import React, { useState, FormEventHandler, useEffect } from "react";
import bg from "../public/bacakground.png";
import type { GetServerSideProps, NextPage } from "next";
import { checkValidEmail, checkValidPassword, getToken } from "../commons";
import { useRouter } from "next/router";

const Index: NextPage = () => {
  const [show, setShow] = useState<boolean>(false);
  const [password, setPassword] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [signInError, setSignInError] = useState<boolean>(false);
  const routing = useRouter()

  const handlePasswordClick = () => {
    setShow((state) => !state);
  };

  const handleLogin: FormEventHandler<HTMLButtonElement> = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);
    setEmailError(!checkValidEmail(email));
    setPasswordError(!checkValidPassword(password));
    if (emailError || passwordError) return setSignInError(false);

    const makeToken = JSON.stringify({ email: email, password: password })
    localStorage.setItem("token", makeToken)
    routing.push(`/tehran`)
    setSignInError(false)
  };

  useEffect(() => {
    if (getToken()) routing.push(`/tehran`)
  }, [])

  return (
    <Flex
      height="100vh"
      width="100vw"
      position="relative"
      backgroundColor="#fefefe"
    >
      <Head>
        <title>Home</title>
      </Head>

      <Box
        backgroundImage={`url(${bg.src})`}
        backgroundSize="100% 100%"
        backgroundRepeat="no-repeat"
        width="100%"
        maxWidth="55%"
        display={["none", "none", "block"]}
        height="auto"
      ></Box>
      <Flex
        marginY="auto"
        mr="auto"
        ml={["auto", "auto", "20px"]}
        direction="column"
        backgroundColor="#fefefe"
        mx={[2, 3, 4]}
      >
        <Text textAlign="center" fontSize="4xl">
          Log in
        </Text>
        <Flex direction="column">
          <Text textAlign="left" fontSize="medium" marginY="2">
            Email
          </Text>
          <Input
            borderRadius="20px"
            value={email}
            onChange={(e: any) => setEmail(e.target.value)}
            isInvalid={emailError}
            errorBorderColor="crimson"
            type="email"
          />
          <Text textAlign="left" fontSize="medium" marginY="2">
            Password
          </Text>
          <InputGroup>
            <Input
              borderRadius="20px"
              value={password}
              isInvalid={passwordError}
              errorBorderColor="crimson"
              onChange={(e: any) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
            />
            <InputRightElement width="3.5rem">
              <Button h="1.5rem" size="xs" onClick={handlePasswordClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
          {signInError && (
            <Text color="#f80404" mt={5}>
              Error, please enter the correct Email and Password
            </Text>
          )}
          <Button
            size="lg"
            mt={signInError ? "20px" : "40px"}
            backgroundColor="#006eb9"
            borderRadius="20px"
            color="#f7fdfb"
            _hover={{ bg: "#1193ec" }}
            _active={{
              bg: "#1193ec",
              transform: "scale(0.95)",
            }}
            _focus={{
              boxShadow:
                "0 0 1px 2px rgba(88, 144, 255, .75), 0 1px 1px rgba(0, 0, 0, .15)",
            }}
            onClick={handleLogin}
          >
            Login
          </Button>
          <Flex
            gap={["20px", "20px", "40px"]}
            flexDirection={["column", "row", "row"]}
            justifyContent="center"
            alignItems="center"
            mt="25px"
          >
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Index;
