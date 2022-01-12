import { Button } from "@chakra-ui/button";
import { ArrowForwardIcon, RepeatIcon } from "@chakra-ui/icons";
import { Badge, Box, Center, Spacer, Stack } from "@chakra-ui/layout";
import { Checkbox, Text, RadioGroup, SimpleGrid } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Bargroup from "../Bargroup";
import { barGroupDrillDownMockData, barGroupMockData } from "../Bargroup/mockData";
import FlipCard from "../FlipCard";
import Geomap from "../Geomap";
import ThresholdGraph from "../Threshold";
import { thresholdMockData } from "../Threshold/mockData";

const mockQuestions = [
  {
    question: "What country has worse air quality on average?",
    options: ["France", "Brazil"],
    countries: ["France", "Brazil"],
    answer: "Brazil",
    answerType: "bargroup",
    title: 'Air Quality between France and Brazil',
    yAxisTitle: 'Air Quality Index',
    seriesName: 'Air Quality Index',
    data: 'AirBetweenFraBrz',
    showMap: true,
  },
  {
    question: "During year 2020, was the temperature change ever below 1°C?",
    options: ["Yes", "No"],
    countries: ["World", "World"],
    answer: "No",
    answerType: "threshold",
    title: 'Average Temperature Change in the World',
    yAxisTitle: 'Temperature Change °C',
    seriesName: 'Temperature Change',
    data: 'HistoricTemperature',
    showMap: true,
  },
  {
    question: "What activity creates more Carbon Emissions in g within the UK?",
    options: ["92 hours of Netlfix", "Year of Running Average Household"],
    countries: ['United Kingdom', 'United Kingdom'],
    answer: "Year of Running Average Household",
    answerType: "bargroup",
    title: 'Carbon Emissions in g',
    yAxisTitle: 'CO2/g',
    seriesName: 'Carbon Emissions',
    data: 'EmissionsNtflHouse',
    showMap: true,
  },
  {
    question: "Was the CO2 production higher in 2018 (without Pandemic) or 2020 (during Pandemic)?",
    options: ["2018", "2020"],
    countries: ["World", "World"],
    answer: "2020",
    answerType: "threshold",
    title: 'Average Carbon Production Change in the World',
    yAxisTitle: 'CO2/a mole fraction in dry air, parts per million (ppm)',
    seriesName: 'ppm',
    data: 'HistoricCarbon',
    showMap: true,
  },
  
];

export interface DrillDownData {
    name: string;
    id: string;
    data: (string | number)[][];
}

export interface BarGoupdData {
    name: string;
    y: any;
    drilldown: string | null;
}

export default () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState(mockQuestions);
  const [data, setData] = useState({
    AirBetweenFraBrz: {data: [] as unknown as BarGoupdData[], drilldownData: [] as unknown as DrillDownData[]},
    EmissionsNtflHouse: {data: [] as unknown as BarGoupdData[], drilldownData: [] as unknown as DrillDownData[]},
    HistoricTemperature: {data: [] as unknown as number[][]},
    HistoricCarbon: {data: [] as unknown as number[][]},
  });

  useEffect(()=>{
    let headers = {
        "Content-Type": "application/json",
    };

    Promise.all([

        axios.post("http://localhost:8000/api/streaming-emissions", JSON.stringify({ hours: 92 }), {headers}),
        axios.post("http://localhost:8000/api/household-emissions", {}, {headers}),
        
        axios.post("http://localhost:8000/api/air-quality", JSON.stringify({"city":"paris", "measure":"pm10"}), {headers}),
        axios.post("http://localhost:8000/api/air-quality", JSON.stringify({"city":"paris", "measure":"uvi"}), {headers}),
        // axios.post("http://localhost:8000/api/air-quality", JSON.stringify({"city":"paris", "measure":"so2"}), {headers}),
        // axios.post("http://localhost:8000/api/air-quality", JSON.stringify({"city":"paris", "measure":"no2"}), {headers}),
        axios.post("http://localhost:8000/api/air-quality", JSON.stringify({"city":"paris", "measure":"o3"}), {headers}),
        axios.post("http://localhost:8000/api/air-quality", JSON.stringify({"city":"sao-paulo", "measure":"pm10"}), {headers}),
        axios.post("http://localhost:8000/api/air-quality", JSON.stringify({"city":"sao-paulo", "measure":"uvi"}), {headers}),
        // axios.post("http://localhost:8000/api/air-quality", JSON.stringify({"city":"sao-paulo", "measure":"so2"}), {headers}),
        // axios.post("http://localhost:8000/api/air-quality", JSON.stringify({"city":"sao-paulo", "measure":"no2"}), {headers}),
        axios.post("http://localhost:8000/api/air-quality", JSON.stringify({"city":"sao-paulo", "measure":"o3"}), {headers}),

        axios.get("http://localhost:8000/api/historic-temperature", {}),
        axios.get("http://localhost:8000/api/historic-carbon", {}),
    ]).then(([
        ntlfEmiss, HouseEmiss,
        AirFrance, AirFranceUVI, 
        // AirFranceSO, AirFranceNO, 
        AirFranceO, AirBrazil, AirBrazilUVI, 
        // AirBrazilSO, AirBrazilNO, 
        AirBrazilO,
        histTemp, histCarbon
        ]) => {
        setData({
            'AirBetweenFraBrz' : {
                data: [
                    {
                        name: "France",
                        y: AirFrance.data,
                        drilldown: "France"
                    },
                    {
                        name: "Brazil",
                        y: AirBrazil.data,
                        drilldown: "Brazil"
                    },
                ], 
                drilldownData: [
                  {
                    name: "France",
                    id: "France",
                    data: [
                      // ["Carbon Monoxide", AirFranceCO.data],
                      ["Ultra Violet Index", AirFranceUVI.data],
                      // ["Sulfur Dioxide", AirFranceSO.data],
                      // ["Nitrogen Dioxide", AirFranceNO.data],
                      ["Ozone", AirFranceO.data],
                    ]
                  },
                  {
                    name: "Brazi;",
                    id: "Brazil",
                    data: [
                      // ["Carbon Monoxide", AirBrazilCO.data],
                      ["Ultra Violet Index", AirBrazilUVI.data],
                      // ["Sulfur Dioxide", AirBrazilSO.data],
                      // ["Nitrogen Dioxide", AirBrazilNO.data],
                      ["Ozone", AirBrazilO.data],
                    ]
                  },
                ]
            },
            'EmissionsNtflHouse': {
                data: [
                    {
                        name: "92 hours of Netflix",
                        y: ntlfEmiss.data.data.total | 2352,
                        drilldown: "Netflix"
                    },
                    {
                        name: "Household",
                        y: HouseEmiss.data.data.categories["Total"] | 745503,
                        drilldown: "Household"
                    }
                ],
                drilldownData: [
                    {
                        name: "Netflix",
                        id: "Netflix",
                        data: [
                          ["Data Centres", ntlfEmiss.data.data["Data Centres"] | 23.52],
                          ["Home Router", ntlfEmiss.data.data["Home Router"] | 893.76],
                          ["Screens", ntlfEmiss.data.data["Screens"] | 1081.92],
                          ["TV Peripheral", ntlfEmiss.data.data["TV Peripheral"] | 117.60000000000001],
                          ["Transmission Network", ntlfEmiss.data.data["Transmission Network"] |235.20000000000002],
                        ]
                    },
                    {
                        name: "Household",
                        id: "Household",
                        data: [
                            ["Cold appliances", HouseEmiss.data.data.categories?.["Cold appliances"] | 120771.486],
                            ["Cooking", HouseEmiss.data.data.categories?.["Cooking"] | 102879.414],
                            ['Lighting', HouseEmiss.data.data.categories?.["Lighting"] | 114807.462],
                            ['Technology', HouseEmiss.data.data.categories?.["Technology"] | 152828.115],
                            ['Washing', HouseEmiss.data.data.categories?.["Washing"] | 101388.40800000001],
                            ['Other', HouseEmiss.data.data.categories?.["Other"] | 152828.115],
                        ]
                    },
                ]
            },
            'HistoricTemperature': { data: histTemp.data?.result?.map((data:any) => [Number(data.time), Number(data.station)]) },
            'HistoricCarbon' : { data: histCarbon.data?.co2?.map((data:any) => [new Date(Number(data.year), Number(data.month), Number(data.day)), Number(data.trend)]) }
        });
        setDataLoaded(true);
    });
  }, []);

  const validateAnswer = () => {
    if (questions[questionNumber].answer === selectedAnswer) {
      setIsCorrect(true);
      setScore(score + 1);
    } else {
      setIsCorrect(false);
    }
  };

  const onStartClick = () => {
    if(dataLoaded){
        setTestStarted(true);
        setToggle(false);
    }
  };

  const onSubmitClick = () => {
    setToggle(true);
    validateAnswer();
  };

  const onResetClick = () => {
    setTestStarted(false);
    setToggle(true);
    setQuestionNumber(0);
    setSelectedAnswer("");
    setIsCorrect(false);
    setScore(0);
    setQuestions(mockQuestions);
  }

  const onNextClick = () => {
    setToggle(false);
    setSelectedAnswer("");
    if (questionNumber + 1 >= questions.length) {
      setTestStarted(false);
    } else {
      setQuestionNumber(questionNumber + 1);
    }
  };

  const onRadioButtonClick = (option: string) => {
    setSelectedAnswer(option);
  };

  const Front: React.FC = () => (
    <Box width={"100%"} height={"100%"} textAlign={"center"}>
      <Box>{questions[questionNumber].question}</Box>

      <SimpleGrid columns={3} spacing={10}>
        <Box>
            {questions[questionNumber].showMap && <Geomap width={40} height={35} selectedCountries={[questions[questionNumber].countries[0]]} />}
        </Box>
        <Box>
          <Stack spacing={5} direction="column" marginTop={"50"}>
            {questions[questionNumber].options.map((option: string) => (
              <Checkbox
                key={option}
                value={option}
                colorScheme={"blue"}
                onChange={() => onRadioButtonClick(option)}
                isChecked={selectedAnswer === option}
              >
                {option}
              </Checkbox>
            ))}
          </Stack>
        </Box>
        <Box>
          {questions[questionNumber].showMap && <Geomap width={40} height={35} selectedCountries={[questions[questionNumber].countries[1]]} />}
        </Box>
      </SimpleGrid>
      <Button
        onClick={onSubmitClick}
        position={"inherit"}
        margin={5}
        disabled={selectedAnswer === ""}
      >
        Submit
      </Button>
    </Box>
  );

  const Back: React.FC = () => (
    <Box width={"100%"} height={"100%"} textAlign={"center"}>
      {isCorrect ? (
        <Badge colorScheme="green">Success</Badge>
      ) : (
        <Badge colorScheme="red">Failure</Badge>
      )}
      <Text>
        {" The correct answer is: " + questions[questionNumber].answer}
      </Text>
      {questions[questionNumber].answerType == "threshold" ? (
        <ThresholdGraph 
            width={null} 
            height={400} 
            title={questions[questionNumber].title}
            yAxisTitle={questions[questionNumber].yAxisTitle}
            seriesName={questions[questionNumber].seriesName}
            data={questions[questionNumber].data==='HistoricTemperature'
            ? data['HistoricTemperature'].data
            : questions[questionNumber].data==='HistoricCarbon'
            ? data['HistoricCarbon'].data
            : thresholdMockData
            }
            seriesType={questions[questionNumber].data==='HistoricTemperature'
            ? 'linear'
            : 'datetime'
            }
        />
      ) : (
        <Bargroup 
            width={null} 
            height={400}
            title={questions[questionNumber].title}
            yAxisTitle={questions[questionNumber].yAxisTitle}
            seriesName={questions[questionNumber].seriesName}
            data={
                questions[questionNumber].data==='AirBetweenFraBrz'
                ? data['AirBetweenFraBrz'].data
                : questions[questionNumber].data==='EmissionsNtflHouse'
                ? data['EmissionsNtflHouse'].data
                : barGroupMockData
            }
            drilldownData={
                questions[questionNumber].data==='AirBetweenFraBrz'
                ? data['AirBetweenFraBrz'].drilldownData
                : questions[questionNumber].data==='EmissionsNtflHouse'
                ? data['EmissionsNtflHouse'].drilldownData
                : barGroupDrillDownMockData
            }
        />
      )}

      <Button onClick={onNextClick} position={"inherit"} margin={5}>
        Next
      </Button>
    </Box>
  );

  return (
    <>
      <div>
        {!testStarted ? (
          <FlipCard toggle={toggle}>
            <FlipCard.Back>
              <Box width={"100%"} height={"100%"} textAlign={"center"}>
                <Button
                  position={"inherit"}
                  marginY={"15%"}
                  colorScheme="green"
                  variant="solid"
                  size="lg"
                  height="48px"
                  width="200px"
                  rightIcon={<ArrowForwardIcon />}
                  onClick={onStartClick}
                  isLoading={!dataLoaded}
                >
                  Start
                </Button>
              </Box>
            </FlipCard.Back>
            <FlipCard.Front>
              <Box width={"100%"} height={"100%"} textAlign={"center"}>
                <Badge> Test score: {score} </Badge>
                <Spacer />
                <Button
                    position={"inherit"}
                    marginY={"15%"}
                    colorScheme="green"
                    variant="solid"
                    size="lg"
                    height="48px"
                    width="200px"
                    rightIcon={<RepeatIcon />}
                    onClick={onResetClick}
                >
                    Reset
                </Button>
              </Box>
            </FlipCard.Front>
          </FlipCard>
        ) : (
          <FlipCard toggle={toggle}>
            <FlipCard.Front>
              <Front />
            </FlipCard.Front>
            <FlipCard.Back>
              <Back />
            </FlipCard.Back>
          </FlipCard>
        )}
      </div>
    </>
  );
};
