import React, { useState, useEffect } from "react";
import axios from "axios";
import BioForm from "../components/BioForm";
import BioView from "../components/BioView";

const ProfilePage = ({ match }) => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users/${match.params.id}`);
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, [match.params.id]);

  const handleUpdateBio = async (bio) => {
    try {
      const response = await axios.put(`http://localhost:5000/users/${match.params.id}`, { bio });
      setUser(response.data);
      setIsEditing(false);
      } catch (err) {
        console.error("Error updating bio:", err);
      }
    };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{user ? user.username : "Loading..."}</h1>
      {isEditing ? (
        <BioForm bio={user ? user.bio : ""} onSubmit={handleUpdateBio} />
      ) : (
        <BioView bio={user ? user.bio : ""} onEdit={() => setIsEditing(true)} />
      )}
    </div>
  );
};

export default ProfilePage;