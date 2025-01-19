import {useCallback, useEffect, useState} from "react";
import {Box, defineStyle, Field, Input, InputElement, Text} from "@chakra-ui/react";
import './GeoConvertComponent.css'
import {ConvertProps} from "./types";
import {main} from "../../wailsjs/go/models";
import {CalculateAzimuth, DistanceBetweenTwoPoints} from "../../wailsjs/go/main/App";
import Geo = main.Geo;

const enum BetweenPoints {
    AZ = "az_two_points",
    DISTANCE = "distance",
}

export default function CalculateBetweenPoints(props: ConvertProps) {
    const [latitude1, setLatitude1] = useState<number>(0);
    const [longitude1, setLongitude1] = useState<number>(0);
    const [latitude2, setLatitude2] = useState<number>(0);
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
            Alt: 0,
            Lat: latitude1,
            Lng: longitude1,
        });
        const geo2: Geo = new Geo({
            Alt: 0,
            Lat: latitude2,
            Lng: longitude2,
        });

        let convertedValue: number;

        switch (props.unit) {
            case BetweenPoints.AZ:
                convertedValue = await CalculateAzimuth(geo1, geo2)
                props.setResult(`Azimuth: ${convertedValue}°`);
                break;
            case BetweenPoints.DISTANCE:
                convertedValue = await DistanceBetweenTwoPoints(geo1, geo2);
                props.setResult(`Distance: ${convertedValue} meters`);
                break;
            default:
                props.setResult(`Selected unit is not supported`);
                break;
        }



    }, [latitude1, longitude1, latitude2, longitude2, props.unit]);

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
            </Box>
        </Field.Root>
    )
}
