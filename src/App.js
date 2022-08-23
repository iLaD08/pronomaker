import React, { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import {
  useColorModeValue,
  Text,
  Box,
  Stack,
  Flex,
  Heading,
  Center,
  Button,
  Badge,
} from "@chakra-ui/react";
import API from "./api.js";
import "./App.css";

const App = () => {
  const [matches, setMatches] = useState([]);
  const [description, setDescription] = useState();
  const [languages, setLanguages] = useState("en");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/matches/list`)
      .then((res) => {
        setMatches(res.data);
        setLoading(!loading);
      })
      .catch((err) => console.error(err));
  }, []);

  const getDecription = (link) => {
    setLoading(true);
    API.get(`/matches/get/${link}`)
      .then((res) => {
        setDescription(res.data);
        setLoading(false);
        setLanguages("en");
        document.querySelector(".matches").style.display = "none";
      })
      .catch((err) => console.error(err));
  };

  const switchLanguage = () => {
    if (languages === "en") setLanguages("fr");
    else setLanguages("en");
  };

  const goBack = () => {
    document.querySelector(".matches").style.display = "block";
    setDescription();
  };

  return (
    <Box minH={"100vh"} bg={useColorModeValue("gray.50", "gray.800")}>
      <Flex m="0px 0px 10px 0px" justify={"center"}>
        <Heading fontSize="6xl" textAlign={"center"} m="0px 0px 10px 0px">
          Prono
        </Heading>
        <Heading fontSize="6xl" color="teal">
          maker
        </Heading>
      </Flex>
      <div className="matches">
        <Center>
          <Stack spacing={3}>
            {!loading ? (
              matches.map((obj, idx) => (
                <Box
                  bg="teal.500"
                  w="80vh"
                  cursor="pointer"
                  p={4}
                  color="white"
                  borderRadius="lg"
                  onClick={() =>
                    getDecription(
                      obj.url.replace(
                        "https://www.ruedesjoueurs.com/pronostic/",
                        ""
                      )
                    )
                  }
                >
                  <Flex align={"center"} justify={"space-around"}>
                    <Text>{obj.time}</Text>
                    <Text fontSize="xl">
                      {obj.firstteam} Vs {obj.secondteam}
                    </Text>
                    <Text color="green.200" fontSize="lg">
                      {parseFloat(obj.firstcote)}
                    </Text>
                    <Text fontSize="lg">{parseFloat(obj.drawcote)}</Text>
                    <Text color="red.200" fontSize="lg">
                      {parseFloat(obj.secondcote)}
                    </Text>
                  </Flex>
                </Box>
              ))
            ) : (
              <BeatLoader color={"#00bfbf"} loading={loading} size={15} />
            )}
          </Stack>
        </Center>
      </div>
      {description ? (
        <Flex direction={"column"} align="center">
          {description.english ? (
            <Text w="75vh" m="2.5vh 0px 15px 0px">
              {languages === "en" ? description.english : description.french}
            </Text>
          ) : (
            <span>nothing is posted yet.</span>
          )}
          <Badge colorScheme="green" m="0px 0px 10px 0px">
            {languages === "en" ? "English" : "French"}
          </Badge>
          <Flex>
            <Button
              m="0px 10px 0px 0px"
              colorScheme="teal"
              variant="solid"
              onClick={() => goBack()}
            >
              Go back
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={() => switchLanguage()}
            >
              Switch language
            </Button>
          </Flex>
        </Flex>
      ) : (
        <div></div>
      )}
    </Box>
  );
};

export default App;
