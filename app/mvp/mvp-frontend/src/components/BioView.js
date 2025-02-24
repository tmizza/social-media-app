import React from "react";

const BioView = ({ bio, onEdit }) => {
  return (
    <div>
      <p className="mb-4">{bio}</p>
      <button onClick={onEdit} className="p-2 bg-green-500 text-white rounded">
        Edit Bio
      </button>
    </div>
  );
};

export default BioView;