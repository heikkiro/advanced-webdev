import { useState } from "react";
import axios from "axios";

const UpdateUser = ({ onUserUpdated }) => {
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [occupation, setOccupation] = useState("");
    const [premiumUser, setPremiumUser] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpdate = async (event) => {
        event.preventDefault();
        setMessage("");

        const data = {
            username,
            birth_date: birthDate,
            occupation,
        };

        if (premiumUser !== null) {
            data.premium_user = premiumUser;
        }

        try {
            const response = await axios.put(`http://localhost:3000/users/${id}`, data);
            setMessage("User updated successfully: " + response.data.id);
            setId("");
            setUsername("");
            setBirthDate("");
            setOccupation("");
            setPremiumUser(null);
            if (onUserUpdated) onUserUpdated(); // Call for refresh function
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Update User</h2>
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <label className="form-label">User id:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="User ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Birth Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        placeholder="Birth_date (YYYY-MM-DD)"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Occupation:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                    />
                </div>
                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="premiumUser"
                        checked={premiumUser || false}
                        onChange={(e) => setPremiumUser(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="premiumUser">Premium user:</label>
                </div>
                <div className="mb-3">
                    <button type="submit" className="btn btn-secondary">Update</button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default UpdateUser;