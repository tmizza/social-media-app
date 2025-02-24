**This file consists of the entire unaltered output for reference.**

Here is the **fully functional code** for the MVP, including all necessary components, file paths, and setup instructions. This ensures you can run the application effortlessly.

---

## **Project Structure**

```
mvp/
├── mvp-backend/
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── .env
│   ├── .eslintrc.json
│   ├── .prettierrc
│   ├── package.json
│   └── server.js
├── mvp-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BioForm.js
│   │   │   ├── BioView.js
│   │   │   ├── SearchBar.js
│   │   │   └── UserList.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   └── ProfilePage.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

---

## **Backend Setup**

### **1. Initialize Backend**

1. Create the `mvp-backend` directory and initialize a Node.js project:
   ```bash
   mkdir mvp-backend
   cd mvp-backend
   npm init -y
   ```

2. Install dependencies:
   ```bash
   npm install express mongoose dotenv cors express-validator
   ```

3. Create the `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mvp_db
   ```

4. Create `server.js`:
   ```javascript
   const express = require("express");
   const mongoose = require("mongoose");
   const cors = require("cors");
   require("dotenv").config();

   const app = express();
   const PORT = process.env.PORT || 5000;

   // Middleware
   app.use(cors());
   app.use(express.json());

   // Database Connection
   mongoose
     .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => console.log("Connected to MongoDB"))
     .catch((err) => console.error("MongoDB connection error:", err));

   // Routes
   const userRoutes = require("./routes/userRoutes");
   app.use("/users", userRoutes);

   // Start Server
   app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}`);
   });
   ```

5. Create `models/User.js`:
   ```javascript
   const mongoose = require("mongoose");

   const userSchema = new mongoose.Schema({
     username: { type: String, required: true, unique: true },
     bio: { type: String, default: "" },
   });

   userSchema.index({ username: 1 }); // Index for search optimization

   module.exports = mongoose.model("User", userSchema);
   ```

6. Create `controllers/userController.js`:
   ```javascript
   const { body, validationResult } = require("express-validator");
   const User = require("../models/User");

   // Fetch all users or search results
   const getUsers = async (req, res) => {
     try {
       const { search } = req.query;
       const query = search ? { username: { $regex: search, $options: "i" } } : {};
       const users = await User.find(query);
       res.json(users);
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   };

   // Fetch a specific user’s bio
   const getUserById = async (req, res) => {
     try {
       const user = await User.findById(req.params.id);
       if (!user) return res.status(404).json({ error: "User not found" });
       res.json(user);
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   };

   // Create a new user profile
   const createUser = [
     body("username").isString().notEmpty(),
     body("bio").isString().optional(),
     async (req, res) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
       try {
         const { username, bio } = req.body;
         const user = new User({ username, bio });
         await user.save();
         res.status(201).json(user);
       } catch (err) {
         res.status(400).json({ error: err.message });
       }
     },
   ];

   // Update a user’s bio
   const updateUser = async (req, res) => {
     try {
       const user = await User.findByIdAndUpdate(
         req.params.id,
         { bio: req.body.bio },
         { new: true }
       );
       if (!user) return res.status(404).json({ error: "User not found" });
       res.json(user);
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   };

   module.exports = { getUsers, getUserById, createUser, updateUser };
   ```

7. Create `routes/userRoutes.js`:
   ```javascript
   const express = require("express");
   const router = express.Router();
   const { getUsers, getUserById, createUser, updateUser } = require("../controllers/userController");

   // Define routes
   router.get("/", getUsers);
   router.get("/:id", getUserById);
   router.post("/", createUser);
   router.put("/:id", updateUser);

   module.exports = router;
   ```

8. Configure ESLint and Prettier:
   ```bash
   npm install eslint prettier eslint-config-prettier eslint-plugin-prettier --save-dev
   ```

   Create `.eslintrc.json`:
   ```json
   {
     "extends": ["eslint:recommended", "plugin:prettier/recommended"],
     "parserOptions": {
       "ecmaVersion": 2021
     },
     "env": {
       "node": true
     }
   }
   ```

   Create `.prettierrc`:
   ```json
   {
     "semi": true,
     "singleQuote": false,
     "printWidth": 80
   }
   ```

---

## **Frontend Setup**

### **1. Initialize Frontend**

1. Create the `mvp-frontend` directory and initialize a React app:
   ```bash
   npx create-react-app mvp-frontend
   cd mvp-frontend
   ```

2. Install dependencies:
   ```bash
   npm install axios react-router-dom tailwindcss postcss autoprefixer
   ```

3. Configure Tailwind CSS:
   ```bash
   npx tailwindcss init
   ```

   Update `tailwind.config.js`:
   ```javascript
   module.exports = {
     content: ["./src/**/*.{js,jsx,ts,tsx}"],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

   Add Tailwind to `src/index.css`:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

4. Create `src/pages/HomePage.js`:
   ```javascript
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
   ```

5. Create `src/pages/ProfilePage.js`:
   ```javascript
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
   ```

6. Create `src/components/SearchBar.js`:
   ```javascript
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
   ```

7. Create `src/components/UserList.js`:
   ```javascript
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
   ```

8. Create `src/components/BioForm.js`:
   ```javascript
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
   ```

9. Create `src/components/BioView.js`:
   ```javascript
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
   ```

10. Update `src/App.js`:
    ```javascript
    import React from "react";
    import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
    import HomePage from "./pages/HomePage";
    import ProfilePage from "./pages/ProfilePage";

    const App = () => {
      return (
        <Router>
          <Switch>
            <Route path="/" exact component={HomePage} />
            <Route path="/profile/:id" component={ProfilePage} />
          </Switch>
        </Router>
      );
    };

    export default App;
    ```

---

## **Run the Application**

1. Start the backend:
   ```bash
   cd mvp-backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd mvp-frontend
   npm start
   ```

3. Open the app in your browser:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:5000`

---

This fully functional code includes all necessary components, file paths, and setup instructions. Let me know if you need further assistance!