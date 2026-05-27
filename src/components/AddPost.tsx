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

// Fix for default Leaflet marker icon breakdown in React build tools
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const AddPost: React.FC = () => {
  // 1. Form State Management
  const [postType, setPostType] = useState<string>("Lost");
  const [petName, setPetName] = useState<string>("");
  const [breed, setBreed] = useState<string>("");
  const [color, setColor] = useState<string>("");
  const [location, setLocation] = useState<string>(""); // This will hold the actual address string
  const [date, setDate] = useState<string>("");
  const [reward, setReward] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [geoCoordinates, setGeoCoordinates] = useState<[number, number]>([
    6.9271, 79.8612,
  ]); // Default fallback (e.g., Colombo)
  const [isMapLoading, setIsMapLoading] = useState<boolean>(false);

  const [phones, setPhones] = useState<string[]>([""]);
  const [emails, setEmails] = useState<string[]>([""]);

  // 2. Automatically get current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setGeoCoordinates([latitude, longitude]);
          fetchAddressFromCoords(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location permission:", error);
        },
      );
    }
  }, []);

  // 3. Reverse Geocoding Function (Coordinates -> Street Address Name)
  const fetchAddressFromCoords = async (lat: number, lng: number) => {
    setIsMapLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      );
      const data = await response.json();
      if (data && data.display_name) {
        setLocation(data.display_name); // Sets input field to real address name
      } else {
        setLocation(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      }
    } catch (err) {
      console.error("Failed to fetch address:", err);
      setLocation(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
    } finally {
      setIsMapLoading(false);
    }
  };

  // Helper component to center map dynamically when geoCoordinates change
  const ChangeMapCenter = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  };

  // Map click handler
  const MapClickHandler = () => {
    useMapEvents({
      click(e: LeafletMouseEvent) {
        const { lat, lng } = e.latlng;
        setGeoCoordinates([lat, lng]);
        fetchAddressFromCoords(lat, lng);
      },
    });
    return null;
  };

  // Dynamic Input Handlers
  const handleListChange = (
    index: number,
    value: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ): void => {
    const updatedList = [...list];
    updatedList[index] = value;
    setList(updatedList);
  };

  const addListField = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ): void => setList([...list, ""]);
  const removeListField = (
    index: number,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
  ): void => {
    if (list.length > 1) setList(list.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("postType", postType);
    formData.append("petName", petName);
    formData.append("breed", breed);
    formData.append("color", color);
    formData.append("locationName", location); // Text address string
    formData.append("latitude", geoCoordinates[0].toString());
    formData.append("longitude", geoCoordinates[1].toString());
    formData.append("date", date);
    formData.append("reward", reward);
    formData.append("phones", JSON.stringify(phones));
    formData.append("emails", JSON.stringify(emails));
    if (image) formData.append("petImage", image);

    console.log("MERN Payload:", Object.fromEntries(formData));
    alert("Post created successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg my-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
        Create Lost/Found Pet Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Post Type Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={postType}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPostType(e.target.value)
            }
            className="w-full p-2 border rounded-md bg-slate-50"
          >
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>

        {/* Basic Pet Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Pet Name</label>
            <input
              type="text"
              value={petName}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPetName(e.target.value)
              }
              className="w-full p-2 border rounded-md"
              placeholder="Buddy"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Breed</label>
            <input
              type="text"
              value={breed}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setBreed(e.target.value)
              }
              className="w-full p-2 border rounded-md"
              placeholder="Golden Retriever"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <input
              type="text"
              value={color}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setColor(e.target.value)
              }
              className="w-full p-2 border rounded-md"
              placeholder="Golden/White"
              required
            />
          </div>
        </div>

        {/* Location Selector (Input + Interactive Auto-Address Map) */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium">
              Last Seen Location
            </label>
            {isMapLoading && (
              <span className="text-xs text-indigo-600 animate-pulse">
                Fetching address...
              </span>
            )}
          </div>
          <input
            type="text"
            value={location}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setLocation(e.target.value)
            }
            className="w-full p-2 border rounded-md mb-2 text-sm bg-slate-50"
            placeholder="Click on the map to set location..."
            required
          />
          <div className="w-full h-60 rounded-md overflow-hidden border border-slate-300 z-0 relative">
            <MapContainer
              center={geoCoordinates}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={geoCoordinates} />
              <MapClickHandler />
              <ChangeMapCenter center={geoCoordinates} />
            </MapContainer>
          </div>
        </div>

        {/* Date & Reward */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Last Seen Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
              className="w-full p-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reward ($)</label>
            <input
              type="number"
              value={reward}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setReward(e.target.value)
              }
              className="w-full p-2 border rounded-md"
              placeholder="0"
            />
          </div>
        </div>

        {/* Contact Phone Numbers */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Contact Phone(s)
          </label>
          {phones.map((phone, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="tel"
                value={phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleListChange(index, e.target.value, phones, setPhones)
                }
                className="flex-1 p-2 border rounded-md"
                placeholder={`Phone #${index + 1}`}
                required={index === 0}
              />
              {phones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListField(index, phones, setPhones)}
                  className="px-3 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListField(phones, setPhones)}
            className="text-sm text-indigo-600 hover:underline"
          >
            + Add Another Phone
          </button>
        </div>

        {/* Contact Emails */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Contact Email(s)
          </label>
          {emails.map((email, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleListChange(index, e.target.value, emails, setEmails)
                }
                className="flex-1 p-2 border rounded-md"
                placeholder={`Email #${index + 1}`}
                required={index === 0}
              />
              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListField(index, emails, setEmails)}
                  className="px-3 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListField(emails, setEmails)}
            className="text-sm text-indigo-600 hover:underline"
          >
            + Add Another Email
          </button>
        </div>

        {/* Image Picker & Preview Box */}
        <div>
          <label className="block text-sm font-medium mb-1">Pet Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-1 border rounded-md bg-slate-50 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {imagePreview && (
            <div className="mt-3 w-44 h-44 border rounded-md overflow-hidden bg-slate-50 flex items-center justify-center shadow-inner">
              <img
                src={imagePreview}
                alt="Pet Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200"
        >
          Publish Post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
