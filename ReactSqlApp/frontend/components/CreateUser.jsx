import React from "react";
import { useState } from "react";
import axios from "axios";

const CreateUser = ({ onUserAdded }) => {
    const [username, setUsername] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [occupation, setOccupation] = useState("");
    const [premiumUser, setPremiumUser] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");

        try {
            const response = await axios.post("http://localhost:3000/users", {
                username,
                birth_date: birthDate,
                occupation,
                premium_user: premiumUser
            });
            setMessage("User created successfully: " + response.data.username);
            setUsername("");
            setBirthDate("");
            setOccupation("");
            setPremiumUser(false);
            if (onUserAdded) onUserAdded(); // Call refresh function
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Create New User</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label" htmlFor="birthDate">Birth Date:</label>
                    <input
                        type="date"
                        className="form-control"
                        id="birthDate"
                        placeholder="Birth_date (YYYY-MM-DD)"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
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
                        required
                    />
                </div>
                <div className="form-check mb-3">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="premiumUser"
                        checked={premiumUser}
                        onChange={(e) => setPremiumUser(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="premiumUser">Premium user</label>
                </div>
                <div>
                    <button id="create-user" type="submit" className="btn btn-primary">Create</button>
                </div>
            </form>
            {message && <p className="mt-3">{message}</p>}
        </div>
    );
}

export default CreateUser;