// import React, { useRef, useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   FeatureGroup,
//   Tooltip,
//   Rectangle,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";
// import { EditControl } from "react-leaflet-draw";
// import "leaflet-draw/dist/leaflet.draw.css";
// // import iconUrl from "leaflet/dist/images/marker-icon.png";
// // import iconShadow from "leaflet/dist/images/marker-shadow.png";

// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png",
// });

// export const MapComponent = () => {
//   const ZOOM_LEVEL = 12;
//   const mapRef = useRef(null);

//   const _created = (e) => console.log(e);

//   return (
//     <>
//       <div className="row">
//         <div className="col text-center">
//           <h2>React-leaflet - Draw shapes on map</h2>

//           <MapContainer
//             center={[21.1458, 79.0882]}
//             zoom={ZOOM_LEVEL}
//             ref={mapRef}
//           >
//             <FeatureGroup>
//               <EditControl
//                 position="topright"
//                 onCreated={_created}
//                 draw={{
//                   rectangle: {
//                     shapeOptions: {
//                       clickable: false,
//                     },
//                   },
//                   polyline: false,
//                   circle: false,
//                   marker: false,
//                   polygon: false,
//                   circlemarker: false,
//                 }}
//               />
//             </FeatureGroup>
//             <TileLayer
//               url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=WfQhl5mdinXDiAZpRgeK"
//               attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//             />
//           </MapContainer>
//         </div>
//       </div>
//     </>
//   );
// };

import React, { useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  Tooltip,
  Rectangle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = defaultIcon;

export const MapComponent = ({ updateRectangleCoordinates }) => {
  const featureGroupRef = useRef(null);
  const [coordinates, setCoordinates] = useState({
    latMin: "",
    latMax: "",
    lonMin: "",
    lonMax: "",
  });

  const [rectangleBounds, setRectangleBounds] = useState(null);

  const onCreated = (e) => {
    const layer = e.layer;
    if (layer instanceof L.Rectangle) {
      if (featureGroupRef.current) {
        featureGroupRef.current.eachLayer((layer) => {
          featureGroupRef.current.removeLayer(layer);
        });
      }

      const center = layer.getBounds().getCenter();
      const newBounds = [
        [center.lat - 0.5, center.lng - 0.5],
        [center.lat + 0.5, center.lng + 0.5],
      ];

      layer.setBounds(newBounds);

      if (featureGroupRef.current) {
        featureGroupRef.current.addLayer(layer);
      }

      const newCoordinates = {
        latMin: newBounds[0][0].toString(),
        latMax: newBounds[1][0].toString(),
        lonMin: newBounds[0][1].toString(),
        lonMax: newBounds[1][1].toString(),
      };

      setCoordinates(newCoordinates);
      updateRectangleCoordinates(newCoordinates);
      setRectangleBounds(newBounds);
    }
  };

  return (
    <div>
      <MapContainer
        center={[21.1458, 79.0882]}
        zoom={7}
        style={{ height: "60vh", width: "100%", marginBottom: "20px" }}
        // scrollWheelZoom={false}
        // zoomControl={false}
      >
        <TileLayer
          url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=WfQhl5mdinXDiAZpRgeK"
          attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={onCreated}
            draw={{
              rectangle: {
                shapeOptions: {
                  clickable: false,
                },
              },
              polyline: false,
              circle: false,
              marker: false,
              polygon: false,
              circlemarker: false,
            }}
            edit={{
              remove: false,
              edit: false,
            }}
          />
        </FeatureGroup>
        {rectangleBounds && (
          <Rectangle bounds={rectangleBounds}>
            <Tooltip direction="center" permanent>
              <div>
                <p>Lat Min: {coordinates.latMin}</p>
                <p>Lat Max: {coordinates.latMax}</p>
                <p>Lon Min: {coordinates.lonMin}</p>
                <p>Lon Max: {coordinates.lonMax}</p>
              </div>
            </Tooltip>
          </Rectangle>
        )}
      </MapContainer>
    </div>
  );
};
