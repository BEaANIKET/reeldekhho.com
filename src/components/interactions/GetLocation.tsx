// import React, { useEffect, useState } from "react";
// import { LuMapPin } from "react-icons/lu";
// const GetLocation: React.FC = (props) => {
//   console.log(props, 'this is my props');
//   const sellerlongitude = props.latitude;
//   const sellerlatitude = props.longitude
//     // const {createdDate} = props
//   const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
//     null
//   );
//   console.log(location?.lat, location?.lng, 'location lattitude');

//   const [error, setError] = useState<string | null>(null);

//   const getCurrentLocation = () => { 
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const { latitude, longitude } = position.coords;
//           setLocation({ lat: latitude, lng: longitude });
//           setError(null);
//         },
//         (err) => {
//           setError(err.message || "Unable to retrieve your location.");
//         }
//       );
//     } else {
//       setError("Geolocation is not supported by this browser.");
//     }
//   };

//   useEffect(()=>{
//     getCurrentLocation()
//   },[])

//   console.log('please aa ja');

//     console.log(props, 'this is my props');
//   return (
//     // <div className="p-4">
//     //   <button
//     //     onClick={getCurrentLocation}
//     //     className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//     //   >
//     //     Get Current Location
//     //   </button>

//     //   {location && (
//     //     <div className="mt-4 text-gray-800">
//     //       <p>Latitude: {location.lat}</p>
//     //       <p>Longitude: {location.lng}</p>
//     //     </div>
//     //   )}

//     //   {error && (
//     //     <div className="mt-4 text-red-500">
//     //       <p>Error: {error}</p>
//     //     </div>
//     //   )}
//     // </div>

//     <div className="flex justify-between items-center">

//   {/* Right side: Icon with Distance */}
//   <span onClick={() => alert("check last day")} className="flex items-center text-xs">
//     <LuMapPin className="mr-1" style={{height:'22px', width:'22px'}}/> 
//     <span style={{fontSize:'15px', color:'blue'}}>1.4 km</span>
//   </span>
// </div>
//   );
// };

// export default GetLocation;


import React, { useEffect, useState } from "react";
import { LuMapPin } from "react-icons/lu";

interface GetLocationProps {
  lattitude: number;
  longitude: number;
  link: String;
}

const GetLocation: React.FC<GetLocationProps> = ({ link, lattitude, longitude }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setLocation({ lat, lng });
          setError(null);
        },
        (err) => {
          setError(err.message || "Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const calculateDistance = () => {
    if (location) {
      const rad = (deg: number) => (deg * Math.PI) / 180;
      const R = 6371; // Earth's radius in kilometers

      // Use fallback values for latitude and longitude if undefined
      const sellerLat = lattitude
      const sellerLng = longitude

      const dLat = rad(sellerLat - location.lat);
      const dLng = rad(sellerLng - location.lng);

      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(rad(location.lat)) *
        Math.cos(rad(sellerLat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return (R * c).toFixed(2) + " km";
    }
    return "Calculating...";
  };

  const navigate = () => {
    window.open(link);
  };

  return (
    // <div className="flex justify-between items-center">
    //   {/* Right side: Icon with Distance */}
    //   <span
    //     onClick={() => alert("Feature to be implemented!")}
    //     className="flex items-center text-xs"
    //   >
    //     <LuMapPin className="mr-1" style={{ height: "22px", width: "22px" }} />
    //     <span style={{ fontSize: "15px", color: "blue" }}>
    //       {location ? calculateDistance() : error || "Fetching location..."}
    //     </span>
    //   </span>
    // </div>

    <div className="flex justify-between items-center">

      {/* Right side: Icon with Distance */}
      <span className="flex items-center text-xs">
        <LuMapPin onClick={navigate} className="mr-1" style={{ height: '22px', width: '22px' }} />
        <span style={{ fontSize: '15px', color: 'blue' }}>{location ? calculateDistance() : error || "Fetching location..."}</span>
      </span>
    </div>
  );
};

export default GetLocation;
