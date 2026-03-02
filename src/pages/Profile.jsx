import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { API } from "../services/api"; // central axios instance with auth header
import defaultAvatar from "../assets/default-avatar.png";

// helper to map server relative paths to full URL
const avatarUrl = (path) => {
  if (!path) return defaultAvatar;
  if (path.startsWith("http")) return path;
  const base = API.defaults.baseURL.replace(/\/api$/, "");
  return `${base}${path}`;
};

export default function Profile() {
  const { user, setUser } = useAuth();

  // protect against no-auth state (should be handled by route guard)
  if (!user) return <p>Loading...</p>;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(
    avatarUrl(user?.avatar)
  );

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const uploadPhoto = async () => {
    if (!file) return alert("Please select a photo first");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const res = await API.post(
        `/user/upload-photo/${user._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser(res.data); // update auth context so navbar updates
      setPreview(res.data.avatar || defaultAvatar);
      setFile(null);
      alert("Photo uploaded!");
    } catch (err) {
      console.error("Upload error", err);
      alert("Upload failed. Please try again.");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    try {
      const res = await API.put(`/user/${user._id}`, form);
      setUser(res.data);
      alert("Profile updated successfully");
    } catch (err) {
      console.error("Profile update error", err);
      alert("Error updating profile");
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <img
          src={avatarUrl(preview)}
          alt="profile"
          className="profile-img"
        />

        <input
          type="file"
          onChange={(e) => {
            const selected = e.target.files[0];
            setFile(selected);
            if (selected) {
              setPreview(URL.createObjectURL(selected));
            }
          }}
          accept="image/*"
        />
        <button onClick={uploadPhoto} disabled={!file}>
          Upload Photo
        </button>

        <h2>{user?.name}</h2>
        <p>{user?.email}</p>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Edit name"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Edit email"
        />

        <button onClick={saveProfile}>Save Changes</button>
      </div>
    </div>
  );
}
