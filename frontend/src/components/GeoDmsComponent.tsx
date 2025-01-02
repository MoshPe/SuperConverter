import {Box, defineStyle, Field, Input, InputElement} from "@chakra-ui/react";
import './GeoDmsComponent.css'
import {useCallback, useEffect, useState} from "react";
import {ConvertProps} from "./types";
import {ConvertGeoToDms} from "../../wailsjs/go/main/App";
import {main} from "../../wailsjs/go/models";
import Geo = main.Geo;
import Dms = main.Dms;

export default function GeoDmsComponent(props: ConvertProps) {
    const [latitude, setLatitude] = useState<number>(0);
    const [longitude, setLongitude] = useState<number>(0);


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
        if (!latitude || !longitude) {
            props.setResult("Please enter a valid number");
            return;
        }

        const geo: Geo = new Geo({
            Alt: 0,
            Lat: latitude,
            Lng: longitude,
        });

        const convertedValue: Dms = (
            await ConvertGeoToDms(geo)
        );
        props.setResult(`${convertedValue.LatNS.Str} ${convertedValue.LonWE.Str}`);
    }, [latitude, longitude, props.unit]);

    useEffect(() => {
        props.setHandleConvert(() => handleConvert);
        props.setResult("");
    }, [handleConvert, props.setHandleConvert]);

    return (
        <Field.Root>
            <Box pos="relative" w="full">
                <Box pos="relative">
                    <InputElement placement={"end"} zIndex="0">°</InputElement>
                    <Input
                        type="number"
                        className={"peer"}
                        color={"black"}
                        placeholder=""
                        onChange={(e) => setLatitude(parseFloat(e.target.value))}
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
                        onChange={(e) => setLongitude(parseFloat(e.target.value))}
                        mb={5}
                        mt={5}
                    />
                    <Field.Label css={floatingStyles}>Longitude</Field.Label>
                </Box>
            </Box>
        </Field.Root>
    )
}