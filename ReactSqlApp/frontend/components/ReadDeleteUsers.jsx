import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

const ReadDeleteUsers = ({ refresh }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:3000/users");
            setUsers(response.data);
        } catch (err) {
            setError("Error fetching users: " + (err.response?.data?.error || err.message));
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [refresh]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/users/${id}`);
            fetchUsers();
            setMessage(`User with ID ${id} deleted successfully.`);
        } catch (error) {
            setMessage("Error: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <div className="container mt-4">
            <h2>Users List</h2>
            {error && <p className="text-danger">{error}</p>}
            {message && <p className="text-success">{message}</p>}
            <table className="table table-striped table-bordered">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Occupation</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} > 
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.occupation}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" 
                                onClick={() => handleDelete(user.id)}
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
        </div>
    );
}

export default ReadDeleteUsers;