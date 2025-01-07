import makeAnimated from "react-select/animated";
import {useCallback, useEffect, useState} from "react";
import {TUnit} from "./types";
import {Box, Button, Center, Text} from "@chakra-ui/react";
import Select from "react-select";
import GeoConvertComponent from "./GeoConvertComponent";
import DmsConvertComponent from "./DmsConvertComponent";
import SingleValue from "./SingleValue";
import EcefConvertComponent from "./EcefConvertComponent";
import DmmConvertComponent from "./DmmConvertComponent";


const animatedComponents = makeAnimated();

const ConverterApp = () => {
    const [unit, setUnit] = useState<TUnit>("");
    const [result, setResult] = useState<string>("");
    const [handleConvert, setHandleConvert] = useState<() => void>(() => {
    });

    const options = [
        {value: 'km', label: 'Kilometers to Miles'},
        {value: 'miles', label: 'Miles to Kilometers'},
        {value: 'rad', label: 'Radians to Degrees'},
        {value: 'deg', label: 'Degrees to Radians'},
        {value: 'geo_dms', label: 'Geo to Dms'},
        {value: 'geo_ecef', label: 'Geo to ECEF'},
        {value: 'geo_dmm', label: 'Geo to Dmm'},
        {value: 'dms_geo', label: 'Dms to Geo'},
        {value: 'dms_ecef', label: 'Dms to ECEF'},
        {value: 'dms_dmm', label: 'Dms to Dmm'},
        {value: 'ecef_geo', label: 'ECEF to Geo'},
        {value: 'ecef_dms', label: 'ECEF to Dms'},
        {value: 'ecef_dmm', label: 'ECEF to Dmm'},
        {value: 'dmm_geo', label: 'Dmm to Geo'},
        {value: 'dmm_dms', label: 'Dmm to Dms'},
        {value: 'dmm_ecef', label: 'Dmm to ECEF'},
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
        <div className="home-container">
            <Center bg="gray.50" borderRadius={"20px"} boxShadow={"0px 4px 10px rgba(0, 0, 0, 0.3)"}>
                <Box p={8} boxShadow="lg" borderRadius="md" backgroundColor={"white"} width="400px">
                    <Text className={"text-shared text-converter"}>
                        Simple Converter
                    </Text>
                    <Select onChange={(newValue: any) => setUnit(newValue.value)} styles={customStyles} required={true}
                            components={animatedComponents}
                            options={options}></Select>
                    {(unit === "geo_dmm" || unit === "geo_ecef" || unit === "geo_dms") && (
                        <GeoConvertComponent unit={unit} setResult={setResult}
                                             setHandleConvert={stableSetHandleConvert}/>
                    )}
                    {(unit === "dms_geo" || unit === "dms_dmm" || unit === "dms_ecef") && (
                        <DmsConvertComponent unit={unit} setResult={setResult}
                                             setHandleConvert={stableSetHandleConvert}/>
                    )}
                    {(unit === "dmm_geo" || unit === "dmm_dms" || unit === "dmm_ecef") && (
                        <DmmConvertComponent unit={unit} setResult={setResult}
                                             setHandleConvert={stableSetHandleConvert}/>
                    )}
                    {(unit === "ecef_dmm" || unit === "ecef_dms" || unit === "ecef_geo") && (
                        <EcefConvertComponent unit={unit} setResult={setResult}
                                              setHandleConvert={stableSetHandleConvert}/>
                    )}
                    {(unit === "miles" || unit === "km" || unit === "rad" || unit === "deg") && (
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
        </div>
    );
};

export default ConverterApp;
