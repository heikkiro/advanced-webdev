import { useState } from "react";
import axios from "axios";

const UpdateUser = () => {
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [occupation, setOccupation] = useState("");
    const [premiumUser, setPremiumUser] = useState(false);
    const [message, setMessage] = useState("");

    const handleUpdate = async (event) => {
        event.preventDefault();
        setMessage("");

        try {
            const response = await axios.put(`http://localhost:3000/users/${id}`, {
                username,
                birth_date: birthDate,
                occupation,
                premium_user: premiumUser
            });
            setMessage("User updated successfully: " + response.data.id);
            setId("");
            setUsername("");
            setBirthDate("");
            setOccupation("");
            setPremiumUser("");
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div>
            <h2>Update User</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>User id:</label>
                    <input
                        type="text"
                        placeholder="User ID"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Birth Date:</label>
                    <input
                        type="date"
                        placeholder="Birth_date (YYYY-MM-DD)"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Occupation:</label>
                    <input
                        type="text"
                        placeholder="Occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Premium user:</label>
                    <input
                        type="checkbox"
                        value={premiumUser}
                        onChange={(e) => setPremiumUser(e.target.checked)}
                    />
                </div>
                <div>
                    <button type="submit">Update</button>
                </div>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default UpdateUser;