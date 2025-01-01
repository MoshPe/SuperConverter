import {useState} from 'react';
import {Box, Button, Center, Text} from "@chakra-ui/react";
import Select from "react-select";
import './App.css';
import makeAnimated from 'react-select/animated';
import {ConvertDistanceUnit} from "../wailsjs/go/main/App";
import SingleValue from "./components/SingleValue";
import GeoComponent from "./components/GeoComponent";

const animatedComponents = makeAnimated();

const ConverterApp = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [unit, setUnit] = useState<"km" | "miles" | "geo">("km");
    const [result, setResult] = useState<string>("");

    const options = [
        {value: 'km', label: 'Kilometers to Miles'},
        {value: 'miles', label: 'Miles to Kilometers'},
        {value: 'geo', label: 'Geographic Geographic'},
    ]

    const customStyles = {
        option: (provided: any, state: any) => ({
            ...provided,
            color: 'black', // Change text color based on selection
            backgroundColor: state.isSelected ? '#6df110' : provided.backgroundColor, // Background color when selected
            padding: '10px',
        }),
        control: (provided: any) => ({
            ...provided,
            borderColor: '#3182ce', // Border color for the dropdown control
        }),
    };

    const handleConvert = async () => {
        if (!inputValue || isNaN(Number(inputValue))) {
            setResult("Please enter a valid number");
            return;
        }
        let convertedValue: string;
        convertedValue = (await ConvertDistanceUnit(parseFloat(inputValue), unit)).Str
        setResult(convertedValue);
    };

    return (
        <Center h="100vh" bg="gray.50">
            <Box p={8} boxShadow="lg" borderRadius="md" bg="white" width="400px">
                <Text className={"text-shared text-converter"}>
                    Simple Converter
                </Text>
                <Select onChange={(newValue: any) => setUnit(newValue.value)} styles={customStyles} required={true}
                        components={animatedComponents}
                        options={options}></Select>
                {unit === "geo" && (
                    <GeoComponent unit={unit} inputValue={inputValue} setInputValue={setInputValue}/>
                )}
                {(unit === "miles" || unit === "km") && (
                    <SingleValue unit={unit} inputValue={inputValue} setInputValue={setInputValue}  />
                )}
                <Button colorScheme="light" width="100%" onClick={handleConvert}>
                    Convert
                </Button>
                {result && (
                    <Text className={"text-shared text-result"}>
                        Result: {result}
                    </Text>
                )}
            </Box>
        </Center>
    );
};

export default ConverterApp;
