import React, { memo, useEffect, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";
import './MapChart.style.css';
import { geoPath, geoEqualEarth } from "d3-geo";
import axios from 'axios';
import { feature } from "topojson-client";
import { Box } from "@chakra-ui/layout";


const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const rounded = (num : number) => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const MapChart = ({ setTooltipContent, selectedCountries, width, height }:any) => {
  var returnStyle = (countryName:string) => {
    var results = {}
    if(selectedCountries.includes(countryName)){
      results = {
        default: {
          fill: "#FF7F71",
          outline: "none"
        },
        hover: {
          fill: "#FF7F71",
          outline: "none"
        },
        pressed: {
          fill: "#FF7F71",
          outline: "none"
        }
      }
    }else results = {
      default: {
        fill: "#98EF9E",
        outline: "none"
      },
      hover: {
        fill: "#FF7F71",
        outline: "none"
      },
      pressed: {
        fill: "#FF7F71",
        outline: "none"
      }
    }
    return results;
  }
  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  function handleZoomIn() {
    if (position.zoom >= 6) return;
    setPosition(pos => ({ coordinates: [pos.coordinates[0], pos.coordinates[1]*1.5], zoom: pos.zoom * 2 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 0.05) return;
    setPosition(pos => ({ coordinates: [pos.coordinates[0], pos.coordinates[1]/3], zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position:any) {
    setPosition(position);
  }

  function handleGeographyClick(geography:any) {
    // { type: "Feature",  properties: {...}, geometry: {...} }
    const projection: ()=> any = () => geoEqualEarth()
                        .translate([width/2, height/2])
                        .scale(160)
    const path = geoPath().projection(projection())
    const centroid = projection().invert(path.centroid(geography));
    // calculate zoom level
    const bounds = path.bounds(geography);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    const zoom = 0.9 / Math.max(dx / width, dy / height);
    setPosition({
      coordinates: centroid,
      zoom: zoom,
    });
  }

  useEffect(()=>{
    if (selectedCountries[0]==="World"){
      setPosition({
        coordinates: [0,0],
        zoom: 0.06,
      });
    }else{
      axios.get(geoUrl)
      .then(response => {
        const world = response.data
        const features : any = feature(world, world.objects[Object.keys(world.objects)[0]])
        handleGeographyClick(features.features.find((geo:any) => geo.properties.NAME === selectedCountries[0]));
      })
    }
  }, []);
  return (
    <>
      <Box _light={{bg: '#003570'}} _dark={{bg: ''}}>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }} width={width} height={height}>
        <ZoomableGroup 
          zoom={position.zoom}
          center={position.coordinates as [number, number]}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) => 
              geographies.map(geo => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    const { NAME, POP_EST, GDP_MD_EST } = geo.properties;
                    setTooltipContent(`${NAME}: - Population: ${rounded(POP_EST)} - GDP: ${rounded(POP_EST)}`);
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("");
                  }}
                  style={returnStyle(geo.properties.NAME)}
                />
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      </Box>
      <div className="controls">
        <button onClick={handleZoomIn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button onClick={handleZoomOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </>
  );
};

export default memo(MapChart);