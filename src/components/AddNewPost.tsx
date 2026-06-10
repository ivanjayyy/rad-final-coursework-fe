// import React, {
//   useState,
//   useEffect,
//   type ChangeEvent,
//   type FormEvent,
// } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   useMapEvents,
//   useMap,
// } from "react-leaflet";
// import type { LeafletMouseEvent } from "leaflet";
// import "leaflet/dist/leaflet.css";

// import L from "leaflet";
// import icon from "leaflet/dist/images/marker-icon.png";
// import iconShadow from "leaflet/dist/images/marker-shadow.png";
// import { createPost } from "../service/post";

// let DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// const ChangeMapCenter = ({ center }: { center: [number, number] }) => {
//   const map = useMap();
//   useEffect(() => {
//     map.setView(center, 13);
//   }, [center, map]);
//   return null;
// };

// interface AddressDetails {
//   suburb?: string;
//   village?: string;
//   town?: string;
//   city?: string;
//   county?: string;
//   country?: string;
// }

// interface NominatimResponse {
//   display_name: string;
//   lat: string;
//   lon: string;
//   address: AddressDetails;
// }

// const AddPost: React.FC = () => {
//   const [postType, setPostType] = useState<string>("LOST");
//   const [petName, setPetName] = useState<string>("");
//   const [breed, setBreed] = useState<string>("");
//   const [color, setColor] = useState<string>("");
//   const [location, setLocation] = useState<string>("");
//   const [date, setDate] = useState<string>("");
//   const [reward, setReward] = useState<string>("");
//   const [image, setImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [phones, setPhones] = useState<string[]>([""]);
//   const [emails, setEmails] = useState<string[]>([""]);

//   const [suggestions, setSuggestions] = useState<NominatimResponse[]>([]);
//   const [mapCoordinates, setMapCoordinates] = useState<[number, number]>([
//     6.9271, 79.8612,
//   ]);

//   const buildThreePartAddressString = (data: NominatimResponse): string => {
//     if (!data.address)
//       return data.display_name.split(",").slice(0, 3).join(", ");

//     const addr = data.address;
//     const parts: string[] = [];

//     const localPlace = addr.village || addr.town || addr.suburb || addr.city;
//     if (localPlace) parts.push(localPlace);

//     if (addr.county) {
//       const cleanDistrict = addr.county.replace(/\sDistrict$/i, "");
//       parts.push(cleanDistrict);
//     }

//     if (addr.country) parts.push(addr.country);

//     if (parts.length > 0) {
//       return parts.join(", ");
//     }

//     return data.display_name.split(",").slice(0, 3).join(", ");
//   };

//   const MapClickHandler = () => {
//     useMapEvents({
//       async click(e: LeafletMouseEvent) {
//         const { lat, lng } = e.latlng;
//         setMapCoordinates([lat, lng]);

//         try {
//           const response = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
//           );
//           const data: NominatimResponse = await response.json();
//           if (data) {
//             setLocation(buildThreePartAddressString(data));
//           }
//         } catch (err) {
//           console.error("Map click parsing failed:", err);
//         }
//       },
//     });
//     return null;
//   };

//   useEffect(() => {
//     if (location.trim().length < 3) {
//       setSuggestions([]);
//       return;
//     }

//     const wasOptionSelected = suggestions.some(
//       (s) => buildThreePartAddressString(s) === location,
//     );
//     if (wasOptionSelected) return;

//     const delayDebounceFn = setTimeout(async () => {
//       try {
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
//             location,
//           )}`,
//         );
//         const data: NominatimResponse[] = await response.json();
//         setSuggestions(data);
//       } catch (err) {
//         console.error("Autocomplete processing failed:", err);
//       }
//     }, 400);

//     return () => clearTimeout(delayDebounceFn);
//   }, [location]);

//   const handleSelectLocation = (item: NominatimResponse) => {
//     const cleanName = buildThreePartAddressString(item);
//     setLocation(cleanName);
//     setMapCoordinates([parseFloat(item.lat), parseFloat(item.lon)]);
//     setSuggestions([]);
//   };

//   const handleListChange = (
//     index: number,
//     value: string,
//     list: string[],
//     setList: React.Dispatch<React.SetStateAction<string[]>>,
//   ): void => {
//     const updatedList = [...list];
//     updatedList[index] = value;
//     setList(updatedList);
//   };

//   const addListField = (
//     list: string[],
//     setList: React.Dispatch<React.SetStateAction<string[]>>,
//   ) => setList([...list, ""]);

//   const removeListField = (
//     index: number,
//     list: string[],
//     setList: React.Dispatch<React.SetStateAction<string[]>>,
//   ) => {
//     if (list.length > 1) setList(list.filter((_, i) => i !== index));
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       setImage(file);
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const formData = new FormData();

//     formData.append("status", postType);
//     formData.append("petName", petName);
//     formData.append("breed", breed);
//     formData.append("color", color);
//     formData.append("lastSeenLocation", location);
//     formData.append("lastSeenDate", date);
//     formData.append("reward", reward);

//     phones.forEach((phone) => {
//       const trimmedPhone = phone.trim();
//       if (trimmedPhone) {
//         formData.append("contactPhone", trimmedPhone);
//       }
//     });

//     emails.forEach((email) => {
//       const trimmedEmail = email.trim().toLowerCase();
//       if (trimmedEmail) {
//         formData.append("contactEmail", trimmedEmail);
//       }
//     });

//     if (image) formData.append("image", image);

//     try {
//       await createPost(formData);
//       alert("Post created successfully!");
//     } catch (error) {
//       console.error("Error creating post:", error);
//     }
//   };

//   return (
//     <div style={{ maxWidth: "650px", margin: "40px auto", padding: "0 20px" }}>
//       <h2>Create Lost/Found Pet Post</h2>

//       <form
//         onSubmit={handleSubmit}
//         style={{ display: "flex", flexDirection: "column", gap: "20px" }}
//         autoComplete="off"
//       >
//         {/* Status Dropdown */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
//           <label>Status</label>
//           <select
//             value={postType}
//             onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//               setPostType(e.target.value)
//             }
//             style={{ width: "100%" }}
//           >
//             <option value="Lost">Lost</option>
//             <option value="Found">Found</option>
//           </select>
//         </div>

//         {/* Pet Core Details Grid Row */}
//         <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
//           <div
//             style={{
//               flex: "1",
//               minWidth: "150px",
//               display: "flex",
//               flexDirection: "column",
//               gap: "5px",
//             }}
//           >
//             <label>Pet Name</label>
//             <input
//               type="text"
//               value={petName}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setPetName(e.target.value)
//               }
//               placeholder="Buddy"
//               required
//               style={{ width: "100%" }}
//             />
//           </div>
//           <div
//             style={{
//               flex: "1",
//               minWidth: "150px",
//               display: "flex",
//               flexDirection: "column",
//               gap: "5px",
//             }}
//           >
//             <label>Breed</label>
//             <input
//               type="text"
//               value={breed}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setBreed(e.target.value)
//               }
//               placeholder="Golden Retriever"
//               required
//               style={{ width: "100%" }}
//             />
//           </div>
//           <div
//             style={{
//               flex: "1",
//               minWidth: "150px",
//               display: "flex",
//               flexDirection: "column",
//               gap: "5px",
//             }}
//           >
//             <label>Color</label>
//             <input
//               type="text"
//               value={color}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setColor(e.target.value)
//               }
//               placeholder="Golden/White"
//               required
//               style={{ width: "100%" }}
//             />
//           </div>
//         </div>

//         {/* Map / Location Selection Blocks */}
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "5px",
//             position: "relative",
//           }}
//         >
//           <label>Last Seen Location</label>
//           <input
//             type="text"
//             value={location}
//             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//               setLocation(e.target.value)
//             }
//             onKeyDown={(e) => {
//               if (e.key === "Enter" && suggestions.length > 0) {
//                 e.preventDefault();
//                 handleSelectLocation(suggestions[0]);
//               }
//             }}
//             placeholder="Type town or village, or click on map..."
//             required
//             style={{ width: "100%" }}
//           />

//           {/* Autocomplete Dropdown List */}
//           {suggestions.length > 0 && (
//             <ul
//               style={{
//                 position: "absolute",
//                 zIndex: 50,
//                 left: 0,
//                 right: 0,
//                 top: "60px",
//                 background: "white",
//                 border: "1px solid #ccc",
//                 maxHeight: "200px",
//                 overflowY: "auto",
//                 margin: 0,
//                 padding: "5px 0",
//                 listStyle: "none",
//               }}
//             >
//               {suggestions.map((item, index) => (
//                 <li
//                   key={index}
//                   onClick={() => handleSelectLocation(item)}
//                   style={{ padding: "8px 12px", cursor: "pointer" }}
//                 >
//                   <strong>{buildThreePartAddressString(item)}</strong>
//                   <small
//                     style={{
//                       display: "block",
//                       color: "#666",
//                       overflow: "hidden",
//                       textOverflow: "ellipsis",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {item.display_name}
//                   </small>
//                 </li>
//               ))}
//             </ul>
//           )}

//           {/* Leaflet Frame Layout */}
//           <div
//             style={{
//               width: "100%",
//               height: "250px",
//               marginTop: "10px",
//               position: "relative",
//               zIndex: 0,
//             }}
//           >
//             <MapContainer
//               center={mapCoordinates}
//               zoom={13}
//               style={{ height: "100%", width: "100%" }}
//             >
//               <TileLayer
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//               />
//               <Marker position={mapCoordinates} />
//               <MapClickHandler />
//               <ChangeMapCenter center={mapCoordinates} />
//             </MapContainer>
//           </div>
//         </div>

//         {/* Date and Reward Row */}
//         <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
//           <div
//             style={{
//               flex: "1",
//               minWidth: "200px",
//               display: "flex",
//               flexDirection: "column",
//               gap: "5px",
//             }}
//           >
//             <label>Last Seen Date</label>
//             <input
//               type="date"
//               value={date}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setDate(e.target.value)
//               }
//               required
//               style={{ width: "100%" }}
//             />
//           </div>
//           <div
//             style={{
//               flex: "1",
//               minWidth: "200px",
//               display: "flex",
//               flexDirection: "column",
//               gap: "5px",
//             }}
//           >
//             <label>Reward ($)</label>
//             <input
//               type="number"
//               value={reward}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setReward(e.target.value)
//               }
//               placeholder="0"
//               style={{ width: "100%" }}
//             />
//           </div>
//         </div>

//         {/* Contact Dynamic Phone Fields */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//           <label>Contact Phone(s)</label>
//           {phones.map((phone, index) => (
//             <div
//               key={index}
//               style={{ display: "flex", gap: "10px", width: "100%" }}
//             >
//               <input
//                 type="tel"
//                 value={phone}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   handleListChange(index, e.target.value, phones, setPhones)
//                 }
//                 placeholder={`Phone #${index + 1}`}
//                 required={index === 0}
//                 style={{ flex: "1" }}
//               />
//               {phones.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeListField(index, phones, setPhones)}
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => addListField(phones, setPhones)}
//             style={{ alignSelf: "flex-start" }}
//           >
//             + Add Another Phone
//           </button>
//         </div>

//         {/* Contact Dynamic Email Fields */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
//           <label>Contact Email(s)</label>
//           {emails.map((email, index) => (
//             <div
//               key={index}
//               style={{ display: "flex", gap: "10px", width: "100%" }}
//             >
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   handleListChange(index, e.target.value, emails, setEmails)
//                 }
//                 placeholder={`Email #${index + 1}`}
//                 required={index === 0}
//                 style={{ flex: "1" }}
//               />
//               {emails.length > 1 && (
//                 <button
//                   type="button"
//                   onClick={() => removeListField(index, emails, setEmails)}
//                 >
//                   Remove
//                 </button>
//               )}
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={() => addListField(emails, setEmails)}
//             style={{ alignSelf: "flex-start" }}
//           >
//             + Add Another Email
//           </button>
//         </div>

//         {/* Image Input Selection Block */}
//         <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
//           <label>Pet Image</label>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={handleImageChange}
//             style={{ width: "100%" }}
//           />
//           {imagePreview && (
//             <div style={{ marginTop: "10px", width: "150px", height: "150px" }}>
//               <img
//                 src={imagePreview}
//                 alt="Pet Preview"
//                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Submit action block */}
//         <button
//           type="submit"
//           style={{
//             width: "100%",
//             padding: "12px 0",
//             marginTop: "10px",
//             cursor: "pointer",
//           }}
//         >
//           Publish Post
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddPost;

import React, {
  useState,
  useEffect,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import { createPost } from "../service/post";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeMapCenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

interface AddressDetails {
  suburb?: string;
  village?: string;
  town?: string;
  city?: string;
  county?: string;
  country?: string;
}

interface NominatimResponse {
  display_name: string;
  lat: string;
  lon: string;
  address: AddressDetails;
}

const inputClass =
  "w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";

const labelClass =
  "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1";

const AddPost: React.FC = () => {
  const [postType, setPostType] = useState<string>("LOST");
  const [petName, setPetName] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [reward, setReward] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [phones, setPhones] = useState<string[]>([""]);
  const [emails, setEmails] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [suggestions, setSuggestions] = useState<NominatimResponse[]>([]);
  const [mapCoordinates, setMapCoordinates] = useState<[number, number]>([
    6.9271, 79.8612,
  ]);

  const buildThreePartAddressString = (data: NominatimResponse): string => {
    if (!data.address)
      return data.display_name.split(",").slice(0, 3).join(", ");
    const addr = data.address;
    const parts: string[] = [];
    const localPlace = addr.village || addr.town || addr.suburb || addr.city;
    if (localPlace) parts.push(localPlace);
    if (addr.county) parts.push(addr.county.replace(/\sDistrict$/i, ""));
    if (addr.country) parts.push(addr.country);
    return parts.length > 0
      ? parts.join(", ")
      : data.display_name.split(",").slice(0, 3).join(", ");
  };

  const MapClickHandler = () => {
    useMapEvents({
      async click(e: LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        setMapCoordinates([lat, lng]);
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
          );
          const data: NominatimResponse = await response.json();
          if (data) setLocation(buildThreePartAddressString(data));
        } catch (err) {
          console.error("Map click parsing failed:", err);
        }
      },
    });
    return null;
  };

  useEffect(() => {
    if (location.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    const wasOptionSelected = suggestions.some(
      (s) => buildThreePartAddressString(s) === location,
    );
    if (wasOptionSelected) return;

    const delayDebounceFn = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(location)}`,
        );
        const data: NominatimResponse[] = await response.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Autocomplete processing failed:", err);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [location]);

  const handleSelectLocation = (item: NominatimResponse) => {
    setLocation(buildThreePartAddressString(item));
    setMapCoordinates([parseFloat(item.lat), parseFloat(item.lon)]);
    setSuggestions([]);
  };

  const handleListChange = (
    index: number,
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  };

  const addListField = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => setList([...list, ""]);

  const removeListField = (
    index: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    if (list.length > 1) setList(list.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("status", postType);
    formData.append("petName", petName);
    formData.append("breed", breed);
    formData.append("color", color);
    formData.append("lastSeenLocation", location);
    formData.append("lastSeenDate", date);
    formData.append("reward", reward);
    phones.forEach((p) => {
      if (p.trim()) formData.append("contactPhone", p.trim());
    });
    emails.forEach((em) => {
      if (em.trim()) formData.append("contactEmail", em.trim().toLowerCase());
    });
    if (image) formData.append("image", image);

    try {
      await createPost(formData);
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col gap-6"
    >
      {/* Status Toggle */}
      <div>
        <label className={labelClass}>Post Type</label>
        <div className="flex rounded-md overflow-hidden border border-gray-300">
          {["LOST", "FOUND"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPostType(type)}
              className={`flex-1 py-2 text-sm font-semibold transition-colors ${
                postType === type
                  ? type === "LOST"
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Pet Details */}
      <div>
        <p className={labelClass}>Pet Details</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="Buddy"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Breed</label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="Golden Retriever"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Color</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Golden / White"
              required
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>Last Seen Location</label>
        <div className="relative">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && suggestions.length > 0) {
                e.preventDefault();
                handleSelectLocation(suggestions[0]);
              }
            }}
            placeholder="Type a place, or click on the map…"
            required
            className={inputClass}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto text-sm">
              {suggestions.map((item, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectLocation(item)}
                  className="px-3 py-2 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium text-gray-800">
                    {buildThreePartAddressString(item)}
                  </span>
                  <span className="block text-xs text-gray-400 truncate">
                    {item.display_name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className="mt-2 rounded-md overflow-hidden border border-gray-200"
          style={{ height: "220px", zIndex: 0, position: "relative" }}
        >
          <MapContainer
            center={mapCoordinates}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={mapCoordinates} />
            <MapClickHandler />
            <ChangeMapCenter center={mapCoordinates} />
          </MapContainer>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Click the map to pin an exact location.
        </p>
      </div>

      {/* Date & Reward */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Last Seen Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Reward ($)</label>
          <input
            type="number"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </div>
      </div>

      {/* Phone Numbers */}
      <div>
        <label className={labelClass}>Contact Phone(s)</label>
        <div className="flex flex-col gap-2">
          {phones.map((phone, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  handleListChange(i, e.target.value, phones, setPhones)
                }
                placeholder={`Phone #${i + 1}`}
                required={i === 0}
                className={inputClass}
              />
              {phones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListField(i, phones, setPhones)}
                  className="px-3 py-2 text-xs text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition whitespace-nowrap"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListField(phones, setPhones)}
            className="self-start text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
          >
            <span className="text-base leading-none">+</span> Add Phone
          </button>
        </div>
      </div>

      {/* Emails */}
      <div>
        <label className={labelClass}>Contact Email(s)</label>
        <div className="flex flex-col gap-2">
          {emails.map((email, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  handleListChange(i, e.target.value, emails, setEmails)
                }
                placeholder={`Email #${i + 1}`}
                required={i === 0}
                className={inputClass}
              />
              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListField(i, emails, setEmails)}
                  className="px-3 py-2 text-xs text-red-500 border border-red-200 rounded-md hover:bg-red-50 transition whitespace-nowrap"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListField(emails, setEmails)}
            className="self-start text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
          >
            <span className="text-base leading-none">+</span> Add Email
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className={labelClass}>Pet Image</label>
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-400 mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4-4m0 0l4 4m-4-4v8M4 8a4 4 0 014-4h8a4 4 0 014 4v1"
            />
          </svg>
          <span className="text-xs text-gray-500">
            {image ? image.name : "Click to upload a photo"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
        {imagePreview && (
          <div className="mt-3 flex items-center gap-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-16 h-16 rounded-md object-cover border border-gray-200"
            />
            <span className="text-xs text-gray-500 truncate max-w-xs">
              {image?.name}
            </span>
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-md transition-colors"
      >
        {isSubmitting ? "Publishing…" : "Publish Post"}
      </button>
    </form>
  );
};

export default AddPost;