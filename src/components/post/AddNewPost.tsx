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
import { createPost } from "../../service/post";
import { alert } from "../../utils/alerts";

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

interface AddPostProps {
  onPostAdded?: () => void;
}

// Comic Book Design System Tokens
const inputClass =
  "w-full px-3 py-2 text-sm font-bold border-4 border-black rounded-none bg-white text-black placeholder-gray-500 focus:outline-none focus:bg-yellow-50 focus:ring-0 transition shadow-[2px_2px_0px_0px_#000]";

const labelClass =
  "block text-xs font-black text-black uppercase tracking-wider mb-1 bg-yellow-300 border-2 border-black inline-block px-2 py-0.5 shadow-[2px_2px_0px_0px_#000]";

const AddPost: React.FC<AddPostProps> = ({ onPostAdded }) => {
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
      const res = await createPost(formData);

      // alert("POST PUBLISHED TO THE UNIVERSE!");
      // alert.fire({
      //   title: "Success!",
      //   text: "POST PUBLISHED TO THE UNIVERSE!",
      //   icon: "success",
      //   confirmButtonText: "Cool",
      // });
      alert.fire({
        title: "POST PUBLISHED TO THE UNIVERSE!",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      console.log(res.message);
      if (onPostAdded) onPostAdded();

      clearForm();
    } catch (error: any) {
      console.error("Error creating post:", error);

      const err = error.response?.data?.error || "Something went wrong!";
      const reason = error.response?.data?.reason || "Unknown reason.";
      // alert(`${err} (${reason})`);
      alert.fire({
        title: `${err}`,
        text: `${reason}`,
        icon: "error",
        confirmButtonText: "Fix it",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setPostType("LOST");
    setPetName("");
    setBreed("");
    setColor("");
    setLocation("");
    setDate("");
    setReward("");
    setPhones([""]);
    setEmails([""]);
    setImage(null);
    setImagePreview(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col gap-6 p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000]"
    >
      {/* Status Toggle */}
      <div>
        <div className="mb-2">
          <label className={labelClass}>Post Status</label>
        </div>
        <div className="flex border-4 border-black shadow-[4px_4px_0px_0px_#000]">
          {["LOST", "FOUND"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPostType(type)}
              className={`flex-1 py-3 text-base font-black tracking-widest uppercase transition-all ${
                postType === type
                  ? type === "LOST"
                    ? "bg-red-500 text-white border-r-0 last:border-r-0"
                    : "bg-green-500 text-white border-l-0 first:border-l-0"
                  : "bg-white text-black hover:bg-yellow-100"
              } ${type === "LOST" ? "border-r-4 border-black" : ""}`}
            >
              {type === "LOST" ? "🚨 LOST" : "🔍 FOUND"}
            </button>
          ))}
        </div>
      </div>

      {/* Pet Details Group Panel */}
      <div className="border-4 border-black p-4 bg-sky-100 shadow-[4px_4px_0px_0px_#000] relative">
        <span className="absolute -top-3 left-3 bg-black text-white text-xs font-black px-2 py-0.5 uppercase tracking-wider">
          Pet Profile
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
          <div>
            <label className="block text-xs font-black text-black mb-1 uppercase">
              Name
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="e.g. Buddy"
              // required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-black mb-1 uppercase">
              Breed
            </label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder="e.g. Retriever"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-black mb-1 uppercase">
              Color
            </label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="e.g. Golden / White"
              required
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Location Section */}
      <div>
        <div className="mb-2">
          <label className={labelClass}>Last Seen Location</label>
        </div>
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
            placeholder="Type cross-streets, landmarks, or hit the map..."
            required
            className={inputClass}
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border-4 border-black shadow-[4px_4px_0px_0px_#000] max-h-48 overflow-y-auto text-sm font-bold">
              {suggestions.map((item, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectLocation(item)}
                  className="px-3 py-2 cursor-pointer bg-white hover:bg-yellow-200 border-b-2 border-black last:border-0 text-black"
                >
                  <span className="font-black block">
                    {buildThreePartAddressString(item)}
                  </span>
                  <span className="block text-xs text-gray-600 truncate font-normal">
                    {item.display_name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Map Canvas Frame */}
        <div
          className="mt-3 rounded-none border-4 border-black shadow-[4px_4px_0px_0px_#000]"
          style={{ height: "240px", zIndex: 0, position: "relative" }}
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
        <p className="text-xs font-bold text-gray-700 mt-1 italic">
          💥 Click directly inside the radar grid map above to pin exact
          coordinates.
        </p>
      </div>

      {/* Date & Reward */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="mb-1">
            <label className={labelClass}>Last Seen Date</label>
          </div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className={inputClass}
          />
        </div>
        <div>
          <div className="mb-1">
            <label className={labelClass}>Bounty Reward ($)</label>
          </div>
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
        <div className="mb-1">
          <label className={labelClass}>Hotline Phone(s)</label>
        </div>
        <div className="flex flex-col gap-2">
          {phones.map((phone, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  handleListChange(i, e.target.value, phones, setPhones)
                }
                placeholder={`Line #${i + 1}`}
                required={i === 0}
                className={inputClass}
              />
              {phones.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListField(i, phones, setPhones)}
                  className="px-3 py-1 font-black text-xs text-white bg-red-500 border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:bg-red-600 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  Drop
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListField(phones, setPhones)}
            className="self-start text-xs text-black hover:text-blue-600 font-black flex items-center gap-1 uppercase tracking-wider underline decor-2 decoration-black"
          >
            ➕ Add Alternate Line
          </button>
        </div>
      </div>

      {/* Emails */}
      <div>
        <div className="mb-1">
          <label className={labelClass}>Secure Email(s)</label>
        </div>
        <div className="flex flex-col gap-2">
          {emails.map((email, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) =>
                  handleListChange(i, e.target.value, emails, setEmails)
                }
                placeholder={`Inbound Dispatch #${i + 1}`}
                // required={i === 0}
                className={inputClass}
              />
              {emails.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListField(i, emails, setEmails)}
                  className="px-3 py-1 font-black text-xs text-white bg-red-500 border-2 border-black uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:bg-red-600 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  Drop
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListField(emails, setEmails)}
            className="self-start text-xs text-black hover:text-blue-600 font-black flex items-center gap-1 uppercase tracking-wider underline decor-2 decoration-black"
          >
            ➕ Add Alternate Dispatch
          </button>
        </div>
      </div>

      {/* Image Upload Box */}
      <div>
        <div className="mb-1">
          <label className={labelClass}>Visual Evidence File</label>
        </div>
        <label className="flex flex-col items-center justify-center w-full h-32 border-4 border-dashed border-black rounded-none cursor-pointer bg-amber-50 hover:bg-yellow-100 transition shadow-[4px_4px_0px_0px_#000]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-black mb-1 stroke-[2.5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16l4-4m0 0l4 4m-4-4v8M4 8a4 4 0 014-4h8a4 4 0 014 4v1"
            />
          </svg>
          <span className="text-xs font-black uppercase text-black tracking-wider px-4 text-center">
            {image
              ? `Selected: ${image.name}`
              : "💥 CLICK TO IMPORT TRANSMISSION PHOTO"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {imagePreview && (
          <div className="mt-4 p-2 bg-yellow-200 border-4 border-black shadow-[4px_4px_0px_0px_#000] inline-flex items-center gap-4">
            <img
              src={imagePreview}
              alt="Evidence Target View"
              className="w-20 h-20 rounded-none object-cover border-2 border-black"
            />
            <div className="text-xs font-black text-black uppercase tracking-tight max-w-xs">
              <p className="text-amber-800">Target Image Cached</p>
              <p className="truncate font-mono">{image?.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Main Submit Action */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-yellow-400 text-black border-4 border-black text-base font-black uppercase tracking-widest rounded-none shadow-[6px_6px_0px_0px_#000] hover:bg-yellow-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {isSubmitting
          ? "⚡ COMMITTING FLASH TRANSMISSION..."
          : "📣 BROADCAST POST"}
      </button>
    </form>
  );
};

export default AddPost;
