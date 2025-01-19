import {useCallback, useEffect, useState} from "react";
import {Box, defineStyle, Field, Input, InputElement, Text} from "@chakra-ui/react";
import './GeoConvertComponent.css'
import {ConvertProps} from "./types";
import {main} from "../../wailsjs/go/models";
import {CalculateAzimuthAndElevation} from "../../wailsjs/go/main/App";
import Geo = main.Geo;
import Angle = main.Angle;

export default function AzElBetweenPoints(props: ConvertProps) {
    const [latitude1, setLatitude1] = useState<number>(0);
    const [altitude1, setAltitude1] = useState<number>(0);
    const [longitude1, setLongitude1] = useState<number>(0);
    const [latitude2, setLatitude2] = useState<number>(0);
    const [altitude2, setAltitude2] = useState<number>(0);
    const [longitude2, setLongitude2] = useState<number>(0);

    const floatingStyles = defineStyle({
        pos: "absolute",
        bg: "bg",
        marginTop: "20px",
        px: "0.5",
        top: "-3",
        insetStart: "2",
        fontWeight: "semibold",
        pointerEvents: "none",
        transition: "position",
        color: "fg",
        _peerPlaceholderShown: {
            color: "fg.muted",
            top: "2.5",
            insetStart: "3",
        },
        _peerFocusVisible: {
            color: "fg",
            top: "-3",
            insetStart: "2",
        },
    })

    const handleConvert = useCallback(async () => {
        if (!latitude1 || !longitude1 || !latitude2 || !longitude2) {
            props.setResult("Please enter a valid number");
            return;
        }

        const geo1: Geo = new Geo({
            Alt: altitude1,
            Lat: latitude1,
            Lng: longitude1,
        });
        const geo2: Geo = new Geo({
            Alt: altitude2,
            Lat: latitude2,
            Lng: longitude2,
        });

        let convertedValue: Angle;

        convertedValue = await CalculateAzimuthAndElevation(geo1, geo2)
        props.setResult(`Azimuth: ${convertedValue.Azimuth}°\n Elevation ${convertedValue.Elevation}`);
 
    }, [latitude1, longitude1, latitude2, longitude2, altitude1, altitude2, props.unit]);

    useEffect(() => {
        props.setHandleConvert(() => handleConvert);
        props.setResult("");
    }, [handleConvert, props.setHandleConvert]);

    return (
        <Field.Root>
            <Box pos="relative" w="full">
                <Text className={"text-shared text-converter"} fontSize={"medium"} textAlign={"left"}
                      fontWeight={"medium"}>
                    Pivot Point
                </Text>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">°</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setLatitude1(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Latitude</Field.Label>
                </Box>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">°</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setLongitude1(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Longitude</Field.Label>
                </Box>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">meters</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        defaultValue={0}
                        placeholder=""
                        onChange={(e) =>
                            setAltitude1(parseFloat(e.target.value))
                        }
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Altitude</Field.Label>
                </Box>
                <Text className={"text-shared text-converter"} fontSize={"medium"} textAlign={"left"}
                      fontWeight={"medium"}>
                    Reference Point
                </Text>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">°</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setLatitude2(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Latitude</Field.Label>
                </Box>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">°</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setLongitude2(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Longitude</Field.Label>
                </Box>
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">meters</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        defaultValue={0}
                        placeholder=""
                        onChange={(e) =>
                            setAltitude2(parseFloat(e.target.value))
                        }
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Altitude</Field.Label>
                </Box>
            </Box>
        </Field.Root>
    )
}
