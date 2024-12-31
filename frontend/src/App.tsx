import {useState} from 'react';
import {Box, Button, Center, Input, Text} from "@chakra-ui/react";
import Select from "react-select";
import './App.css';
import makeAnimated from 'react-select/animated';
import {ConvertDistanceUnit} from "../wailsjs/go/main/App";

const animatedComponents = makeAnimated();

const ConverterApp = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [unit, setUnit] = useState<"km" | "miles">("km");
    const [result, setResult] = useState<string>("");

    const options = [
        {value: 'km', label: 'Kilometers to Miles'},
        {value: 'miles', label: 'Miles to Kilometers'}
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
        // if (unit === "km") {
        //     convertedValue = `${(parseFloat(inputValue) * 0.621371).toFixed(2)} miles`;
        // } else {
        //     convertedValue = `${(parseFloat(inputValue) * 1.60934).toFixed(2)} km`;
        // }
        convertedValue = (await ConvertDistanceUnit(parseFloat(inputValue), unit)).Str
        setResult(convertedValue);
    };

    return (
        <Center h="100vh" bg="gray.50">
            <Box p={8} boxShadow="lg" borderRadius="md" bg="white" width="400px">
                <Text fontSize="2xl" mb={4} textAlign="center" fontWeight="bold" color="black">
                    Simple Converter
                </Text>
                <Select onChange={(newValue: any) => setUnit(newValue.value)} styles={customStyles} required={true}
                        components={animatedComponents}
                        options={options}></Select>
                <Input
                    color="black"
                    placeholder="Enter value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    mb={4}
                />
                <Button colorScheme="blue" width="100%" onClick={handleConvert}>
                    Convert
                </Button>
                {result && (
                    <Text color={"black"} mt={4} textAlign="center" fontSize="lg" fontWeight="medium">
                        Result: {result}
                    </Text>
                )}
            </Box>
        </Center>
    );
};

export default ConverterApp;
