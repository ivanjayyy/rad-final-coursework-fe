import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// Assuming you have or will create a profile service
import { updateUser } from "../service/user";
import { getMyDetails } from "../service/auth";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // In a real app, you might pass a user ID or token if not handled by axios/fetch interceptors
        const data = await getMyDetails();
        console.log(data);
        setUsername(data.data.username);
        setEmail(data.data.email);
        // setBio(data.bio || "");
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        alert(
          "Session expired or error loading profile. Redirecting to login...",
        );
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleUpdate = async () => {
    if (!username || !email) {
      alert("Username and Email cannot be empty.");
      return;
    }

    try {
      await updateUser(username, email);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>User Profile</h1>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>Username</label>
        <input
          type="text"
          value={username}
          disabled={!isEditing}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", fontWeight: "bold" }}>Email</label>
        <input
          type="email"
          value={email}
          disabled={!isEditing}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div>
        {isEditing ? (
          <>
            <button onClick={handleUpdate} style={{ marginRight: "10px" }}>
              Save Changes
            </button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <button onClick={() => setIsEditing(true)}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
