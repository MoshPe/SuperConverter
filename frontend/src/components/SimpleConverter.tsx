import makeAnimated from "react-select/animated";
import {useCallback, useEffect, useState} from "react";
import {TUnit} from "./types";
import {Box, Button, Center, Text} from "@chakra-ui/react";
import Select from "react-select";
import GeoDmsComponent from "./GeoDmsComponent";
import DmsGeoComponent from "./DmsGeoComponent";
import SingleValue from "./SingleValue";


const animatedComponents = makeAnimated();

const ConverterApp = () => {
    const [unit, setUnit] = useState<TUnit>("");
    const [result, setResult] = useState<string>("");
    const [handleConvert, setHandleConvert] = useState<() => void>(() => {
    });

    const options = [
        {value: 'km', label: 'Kilometers to Miles'},
        {value: 'miles', label: 'Miles to Kilometers'},
        {value: 'geo_dms', label: 'Geo to Dms'},
        {value: 'geo_ecef', label: 'Geo to ECEF'},
        {value: 'geo_dmm', label: 'Geo to Dmm'},
        {value: 'dms_geo', label: 'Dms to Geo'},
        {value: 'dms_ecef', label: 'Dms to ECEF'},
        {value: 'dms_dmm', label: 'Dms to Dmm'},
        {value: 'ecef_geo', label: 'ECEF to Geo'},
        {value: 'ecef_dms', label: 'ECEF to Dms'},
        {value: 'ecef_dms', label: 'ECEF to Dmm'},
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
            marginBottom: '10px',
        }),
    };

    const stableSetHandleConvert = useCallback(setHandleConvert, []);

    useEffect(() => {
        setHandleConvert(() => {
            return () => {
                setResult("Please pick a conversion type");
            };
        });
    }, []);

    return (
        <Center h="100vh" bg="gray.50">
            <Box p={8} boxShadow="lg" borderRadius="md" bg="white" width="400px">
                <Text className={"text-shared text-converter"}>
                    Simple Converter
                </Text>
                <Select onChange={(newValue: any) => setUnit(newValue.value)} styles={customStyles} required={true}
                        components={animatedComponents}
                        options={options}></Select>
                {unit === "geo_dms" && (
                    <GeoDmsComponent unit={unit} setResult={setResult} setHandleConvert={stableSetHandleConvert}/>
                )}
                {unit === "dms_geo" && (
                    <DmsGeoComponent unit={unit} setResult={setResult} setHandleConvert={stableSetHandleConvert}/>
                )}
                {(unit === "miles" || unit === "km") && (
                    <SingleValue unit={unit} setResult={setResult} setHandleConvert={stableSetHandleConvert}/>

                )}
                <Button colorScheme="light" width="100%" onClick={handleConvert}>
                    Convert
                </Button>
                {result && (
                    <Text className={"text-shared text-result"}>
                        {result.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br/>
                            </span>
                        ))}
                    </Text>
                )}

            </Box>
        </Center>
    );
};

export default ConverterApp;
