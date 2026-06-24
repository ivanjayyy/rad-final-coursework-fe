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
import { updatePost } from "../service/post";
import { alert } from "../utils/alerts";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// ── Types ─────────────────────────────────────────────────────────────────────

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

interface PetPost {
  _id: string;
  status: "LOST" | "FOUND";
  petName: string;
  breed: string;
  color: string;
  lastSeenLocation: string;
  lastSeenDate: string;
  reward?: string;
  contactPhone: string[] | string;
  contactEmail: string[] | string;
  imageURL?: string;
}

interface UpdatePostProps {
  post: PetPost;
  onSuccess?: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const parseList = (data: string[] | string | undefined): string[] => {
  if (!data) return [""];
  if (Array.isArray(data)) return data.length > 0 ? data : [""];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [""];
  } catch {
    return [data.toString()];
  }
};

const toDateInputValue = (dateStr: string | undefined): string => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toISOString().split("T")[0];
  } catch {
    return "";
  }
};

const ChangeMapCenter = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
};

// ── Comic Theme Styles ────────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2 text-sm border-3 border-black font-bold text-gray-900 placeholder-gray-400 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-yellow-50 focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-0.5 focus:translate-y-0.5 transition-all";

const labelClass =
  "inline-block text-xs font-black text-black uppercase tracking-wider mb-1 bg-yellow-300 border-2 border-black px-2 py-0.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transform -rotate-1";

// ── Component ─────────────────────────────────────────────────────────────────

const UpdatePost: React.FC<UpdatePostProps> = ({ post, onSuccess }) => {
  const [postType, setPostType] = useState<string>(post.status ?? "LOST");
  const [petName, setPetName] = useState<string>(post.petName ?? "");
  const [breed, setBreed] = useState<string>(post.breed ?? "");
  const [color, setColor] = useState<string>(post.color ?? "");
  const [location, setLocation] = useState<string>(post.lastSeenLocation ?? "");
  const [date, setDate] = useState<string>(toDateInputValue(post.lastSeenDate));
  const [reward, setReward] = useState<string>(post.reward ?? "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    post.imageURL ?? null,
  );
  const [phones, setPhones] = useState<string[]>(parseList(post.contactPhone));
  const [emails, setEmails] = useState<string[]>(parseList(post.contactEmail));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [suggestions, setSuggestions] = useState<NominatimResponse[]>([]);
  const [mapCoordinates, setMapCoordinates] = useState<[number, number]>([
    6.9271, 79.8612,
  ]);

  // ── Map helpers ─────────────────────────────────────────────────────────────

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

  useEffect(() => {
    if (!post.lastSeenLocation) return;
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
        post.lastSeenLocation,
      )}&limit=1`,
    )
      .then((r) => r.json())
      .then((data: NominatimResponse[]) => {
        if (data[0]) {
          setMapCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
        }
      })
      .catch(() => {});
  }, []);

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

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
            location,
          )}`,
        );
        const data: NominatimResponse[] = await response.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Autocomplete processing failed:", err);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [location]);

  const handleSelectLocation = (item: NominatimResponse) => {
    setLocation(buildThreePartAddressString(item));
    setMapCoordinates([parseFloat(item.lat), parseFloat(item.lon)]);
    setSuggestions([]);
  };

  // ── List field helpers ───────────────────────────────────────────────────────

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

  // ── Image ────────────────────────────────────────────────────────────────────

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────────

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

    if (image) {
      formData.append("image", image);
    } else if (post.imageURL) {
      formData.append("image", post.imageURL);
    }

    try {
      const res = await updatePost(post._id, formData);
      onSuccess?.();

      // alert("POST UPDATED!");
      alert.fire({
        title: "POST UPDATED!",
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      console.log(res.message);
    } catch (error: any) {
      console.error("Error updating post:", error);

      const err = error.response?.data?.error;
      const reason = error.response?.data?.reason;

      // alert(`${err}: ${reason}`);
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

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="flex flex-col gap-6 p-4 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
    >
      {/* Status Toggle */}
      <div>
        <label className={labelClass}>Post Type</label>
        <div className="flex border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {["LOST", "FOUND"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setPostType(type)}
              className={`flex-1 py-3 text-sm font-black tracking-wider transition-all border-r-4 last:border-r-0 border-black ${
                postType === type
                  ? type === "LOST"
                    ? "bg-red-500 text-white"
                    : "bg-green-500 text-white"
                  : "bg-white text-black hover:bg-yellow-100"
              }`}
            >
              {type === "LOST" ? "🚨 LOST" : "🔍 FOUND"}
            </button>
          ))}
        </div>
      </div>

      {/* Pet Details */}
      <div>
        <div className="mb-2">
          <p className={labelClass}>Pet Details</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-black uppercase text-black mb-1">
              Name
            </label>
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
            <label className="block text-xs font-black uppercase text-black mb-1">
              Breed
            </label>
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
            <label className="block text-xs font-black uppercase text-black mb-1">
              Color
            </label>
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
            <ul className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-h-48 overflow-y-auto text-sm font-bold">
              {suggestions.map((item, i) => (
                <li
                  key={i}
                  onClick={() => handleSelectLocation(item)}
                  className="px-3 py-2 cursor-pointer hover:bg-yellow-200 border-b-2 border-black last:border-b-0"
                >
                  <span className="font-black text-black">
                    {buildThreePartAddressString(item)}
                  </span>
                  <span className="block text-xs text-gray-600 truncate">
                    {item.display_name}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className="mt-4 rounded-none border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
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
        <p className="text-xs font-bold text-gray-700 mt-2 uppercase tracking-tight">
          👉 Click the map to update the pinned location!
        </p>
      </div>

      {/* Date & Reward */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="flex flex-col gap-3">
          {phones.map((phone, i) => (
            <div key={i} className="flex gap-2 items-center">
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
                  className="px-3 py-2 text-xs font-black uppercase text-red-600 bg-white border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListField(phones, setPhones)}
            className="self-start text-xs font-black uppercase bg-blue-400 border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-300 transition-colors flex items-center gap-1"
          >
            <span>+</span> Add Phone
          </button>
        </div>
      </div>

      {/* Emails */}
      <div>
        <label className={labelClass}>Contact Email(s)</label>
        <div className="flex flex-col gap-3">
          {emails.map((email, i) => (
            <div key={i} className="flex gap-2 items-center">
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
                  className="px-3 py-2 text-xs font-black uppercase text-red-600 bg-white border-3 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListField(emails, setEmails)}
            className="self-start text-xs font-black uppercase bg-blue-400 border-2 border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-300 transition-colors flex items-center gap-1"
          >
            <span>+</span> Add Email
          </button>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className={labelClass}>Pet Image</label>

        {imagePreview && (
          <div className="mb-4 flex items-center gap-4 p-3 bg-yellow-50 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img
              src={imagePreview}
              alt="Current"
              className="w-16 h-16 object-cover border-3 border-black shrink-0"
            />
            <div className="min-w-0 font-bold">
              <p className="text-xs font-black text-black uppercase truncate">
                {image ? image.name : "Current image"}
              </p>
              <p className="text-xs text-gray-700 mt-0.5 uppercase tracking-tighter">
                {image ? "💥 NEW IMAGE READY!" : "📷 Upload below to swap"}
              </p>
            </div>
          </div>
        )}

        <label className="flex flex-col items-center justify-center w-full h-24 border-4 border-dashed border-black bg-white cursor-pointer hover:bg-yellow-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-black mb-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M4 16l4-4m0 0l4 4m-4-4v8M4 8a4 4 0 014-4h8a4 4 0 014 4v1"
            />
          </svg>
          <span className="text-xs font-black uppercase text-black">
            {image
              ? image.name
              : imagePreview
                ? "💥 Click to replace image"
                : "💥 Click to upload photo"}
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-4 bg-yellow-400 hover:bg-yellow-300 active:translate-x-1 active:translate-y-1 active:shadow-none font-black uppercase text-black text-base border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting && (
          <svg
            className="animate-spin h-5 w-5 text-black"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {isSubmitting ? "⚡ SAVING CHANGES..." : "⚡ SAVE CHANGES"}
      </button>
    </form>
  );
};

export default UpdatePost;
