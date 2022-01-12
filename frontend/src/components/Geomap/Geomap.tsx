import React, { useState } from 'react';
import MapChart from './MapChart';
import ReactTooltip from "react-tooltip";


export type GeoMercatorProps = {
  width: number,
  height: number,
  selectedCountries: string[],
};

export default ({width, height, selectedCountries}: GeoMercatorProps) => {
  const [content, setContent] = useState("");
  return (
    <>
        <MapChart 
          setTooltipContent={setContent} 
          selectedCountries={selectedCountries}
          width={width}
          height={height}
        />
        <ReactTooltip>{content}</ReactTooltip>
    </>
  );
};