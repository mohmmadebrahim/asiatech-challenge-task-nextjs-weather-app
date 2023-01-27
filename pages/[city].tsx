import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import NavBar from "../components/NavBar";
import SunContainer from "../components/SunContainer";
import WeatherForecast from "../components/WeatherForecast";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Chart from "../components/Chart";
import { Forecast } from "../types";
import WindContainer from "../components/WindContainer";
import { getToken } from "../commons";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let x = {} as Forecast;
  const { params, query } = context;
  let error = false;
  
  await axios
    .get(
      `${params?.city != "searchByLatLng" ?
        `https://api.openweathermap.org/data/2.5/forecast?q=${params?.city}&units=metric&appid=${process.env.OPEN_WEATHER_API}` :
        `https://api.openweathermap.org/data/2.5/forecast?lat=${query?.lat}&lon=${query?.lng}&units=metric&appid=${process.env.OPEN_WEATHER_API}`}
      `
    )
    .then(async (res) => {
      const now = new Date();
      const offset = now.getTimezoneOffset();
      x = {
        name: res.data.city.name,
        weather: res.data.list[0].weather[0].main,
        temp: res.data.list[0].main.temp,
        humidity: res.data.list[0].main.humidity,
        sunset: res.data.city.sunset,
        sunrise: res.data.city.sunrise,
        visibility: res.data.list[0].visibility,
        windDir: res.data.list[0].wind.deg,
        windSpeed: res.data.list[0].wind.speed,
        time: JSON.stringify(
          new Date(
            now.getTime() + offset * 60 * 1000 + res.data.city.timezone * 1000
          )
        ),
        condition: res.data.list[0].weather[0].main,
        hourlyWeather: res.data.list.slice(1, 8).map((el: any) => {
          return {
            time: el.dt_txt.split(" ")[1].slice(0, -3),
            temp: el.main.temp.toFixed(1),
          };
        }),
        dailyWeather: res.data.list
          .filter((el: any) => el.dt_txt.includes("12:00:00"))
          .map((el: any) => {
            return {
              time: el.dt,
              //time: el.dt_txt.split(" ")[0],
              temp: el.main.temp.toFixed(0),
              condition: el.weather[0].main,
            };
          }),
      };
    })
    .catch(async () => {
      error = true;
    });
  if (error)
    return {
      notFound: true,
    };
  else
    return {
      props: {
        ...x!,
      },
    };
};

const Home: NextPage<Forecast> = ({
  humidity,
  name,
  sunrise,
  sunset,
  temp,
  time,
  hourlyWeather,
  dailyWeather,
  windDir,
  windSpeed,
  condition,
}: Forecast) => {
  const router = useRouter();
  const [city, setCity] = useState(name);
  const [long, setLong] = useState<any>("");
  const [lat, setLat] = useState<any>("");

  useEffect(() => {
    if (!getToken()) router.push(`/unauthorized`)
  }, [])

  function success(pos: GeolocationPosition) {
    const crd = pos.coords;
    setLong(crd.longitude.toString());
    setLat(crd.latitude.toString());
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success);
  }, [long, lat]);

  // useEffect(() => {
  //   if (city) router.push(`/${city}`);
  // }, [city]);

  return (
    <Box bgColor="primary.100" minHeight="100%">
      <Head>
        <title>Weather - {city}</title>
      </Head>
      <NavBar setCity={setCity} city={city} />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <WeatherForecast
          time={time}
          temperature={temp}
          location={name}
          condition={condition}
        />

        <Flex
          direction={{ base: "column", md: "column", lg: "row" }}
          justifyContent={{
            base: "center",
            md: "space-around",
            lg: "space-around",
          }}
          alignItems="center"
          gap={{ base: 10, md: 10, lg: 40 }}
          marginTop={4}
        >
          <Flex direction="column">
            <SunContainer
              sunrise={sunrise!}
              sunset={sunset!}
              humidity={humidity!}
            ></SunContainer>
            <WindContainer windDir={windDir!} windSpeed={windSpeed!} />
          </Flex>
          <Chart hourlyWeather={hourlyWeather!} dailyWeather={dailyWeather!} />
        </Flex>
      </Box>
    </Box>
  );
};

export default Home;
