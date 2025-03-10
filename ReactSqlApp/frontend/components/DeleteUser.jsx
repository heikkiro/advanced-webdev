// NOTE 10.3.2025
// This component has been joined with ReadUsers.jsx component in ReadDeleteUsers.jsx
//

import { useState } from "react";
import axios from "axios";

const DeleteUser = () => {
    const [id, setId] = useState("");
    const [message, setMessage] = useState("");

    const handleDelete = async (event) => {
        event.preventDefault();
        setMessage("");

        try {
            const response = await axios.delete(`http://localhost:3000/users/${id}`);
            setMessage("User deleted successfully: " + response.data.id);
            setId("");
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div>
            <h2>Delete User</h2>
            <form onSubmit={handleDelete}>
                <label>User Id:</label>
                <input
                    type="text"
                    placeholder="User ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    required
                />
                <button type="submit">Delete</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default DeleteUser;