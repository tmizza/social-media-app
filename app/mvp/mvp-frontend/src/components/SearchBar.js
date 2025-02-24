import React from "react";

const SearchBar = ({ setSearchTerm }) => {
  return (
    <input
      type="text"
      placeholder="Search users..."
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full p-2 border border-gray-300 rounded mb-4"
    />
  );
};

export default SearchBar;