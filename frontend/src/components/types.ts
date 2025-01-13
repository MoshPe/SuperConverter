import React from "react";

export interface ConvertProps {
    unit: TUnit;
    setHandleConvert:  React.Dispatch<React.SetStateAction<() => void>>;
    setResult: (value: string) => void;
}

export interface DmsAngle {
    Deg: number;
    Min: number;
    Sec: number;
}


export type TUnit = "" | "km" | "miles" | "rad" | "deg" | "foot" | "meter" | "geo_dms" | "geo_ecef" | "geo_dmm" | "dms_geo" | "dms_ecef"  | "dms_dmm" | "ecef_geo" | "ecef_dms" | "ecef_dmm" | "dmm_geo" | "dmm_ecef" | "dmm_dms" | "move_location";