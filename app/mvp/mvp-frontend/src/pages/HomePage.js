import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from "../components/UserList";
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/users?search=${searchTerm}`);
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [searchTerm]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Profiles</h1>
      <SearchBar setSearchTerm={setSearchTerm} />
      <UserList users={users} />
    </div>
  );
};

export default HomePage;