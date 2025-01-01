import {Box, defineStyle, Field, Input, InputElement} from "@chakra-ui/react";

export default function SingleValue({unit, inputValue, setInputValue}) {

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

    return (
        <Field.Root>
            <Box pos="relative" w="full">
                <InputElement placement={"end"} zIndex="0">{unit}</InputElement>
                <Input
                    className={"peer"}
                    color={"black"}
                    placeholder=""
                    onChange={(e) => setInputValue(e.target.value)}
                    mb={5}
                    mt={5}
                />
                <Field.Label css={floatingStyles}>{unit}</Field.Label>
            </Box>
        </Field.Root>
    )
}