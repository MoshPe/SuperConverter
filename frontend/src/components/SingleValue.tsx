import {Box, defineStyle, Field, Input, InputElement} from "@chakra-ui/react";
import {ConvertProps} from "./types";
import {ConvertDistanceUnit} from "../../wailsjs/go/main/App";
import {useCallback, useEffect, useState} from "react";

export default function SingleValue(props: ConvertProps) {
    const [inputValue, setInputValue] = useState<string>("");


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
        if (!inputValue || isNaN(Number(inputValue))) {
            props.setResult("Please enter a valid number");
            return;
        }
        let convertedValue: string;
        convertedValue = (
            await ConvertDistanceUnit(parseFloat(inputValue), props.unit)
        ).Str;
        props.setResult(convertedValue);
    }, [inputValue, props.unit]);

    useEffect(() => {
        props.setHandleConvert(() => handleConvert);
        props.setResult("");
    }, [handleConvert, props.setHandleConvert]);


    return (
        <Field.Root>
            <Box pos="relative" w="full">
                <InputElement placement={"end"} zIndex="0">{props.unit}</InputElement>
                <Input
                    className={"peer"}
                    color={"black"}
                    placeholder=""
                    onChange={(e) =>
                        setInputValue(e.target.value)
                    }
                    mb={5}
                    mt={5}
                />
                <Field.Label css={floatingStyles}>{props.unit}</Field.Label>
            </Box>
        </Field.Root>
    )
}