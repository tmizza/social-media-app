import React from "react";
import { Link } from "react-router-dom";

const UserList = ({ users }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user._id} className="mb-2">
          <Link to={`/profile/${user._id}`} className="text-blue-500 hover:underline">
            {user.username}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default UserList;