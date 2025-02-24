import React, { useState } from "react";

const BioForm = ({ bio, onSubmit }) => {
  const [newBio, setNewBio] = useState(bio);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newBio);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <textarea
        value={newBio}
        onChange={(e) => setNewBio(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">
        Save
      </button>
    </form>
  );
};

export default BioForm;