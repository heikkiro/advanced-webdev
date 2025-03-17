import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CreateUser from '../components/CreateUser';
import ReadDeleteUsers from '../components/ReadDeleteUsers';

// Create random user information
const username = (Math.random() + 1).toString(36).substring(7);
const occupation = (Math.random() + 1).toString(36).substring(7);
const birthDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

/**
 * Test Case: Adds a new user
 * - Renders the CreateUser component
 * - Fills out the username, birth date, occupation fields
 * - Selects the premium user checkbox
 * - Clicks the "Create" button
 * - Checks if a success message appears with the new user's name
 */
it('adds a new user', async () => {
    // Render the CreateUser component
    render(<CreateUser onUserAdded={() => {}} />);

    // Fill out userinformation
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: username } });
    fireEvent.change(screen.getByPlaceholderText(/Occupation/i), { target: { value: occupation } });
    fireEvent.change(screen.getByLabelText(/Birth Date/i), { target: { value: birthDate } });
    fireEvent.click(screen.getByLabelText(/Premium user/i)); // Click premium-Checkbox

    // Click "Create"-button
    fireEvent.click(screen.getByRole('button', { name: /Create/i }));

    // Wait for confirmation message
    const message = await screen.findByText(`User created successfully: ${username}`);
    expect(message).toBeInTheDocument();
});

/**
 * Test Case: Deletes the correct user
 * - Renders the ReadDeleteUsers component
 * - Waits for the newly created user to appear in the table
 * - Finds the correct row containing that user
 * - Clicks the "Delete" button inside that row
 * - Verifies that the user is removed from the list
 */
it("deletes the correct user", async () => {
    // Render the ReadDeleteUsers component
    render(<ReadDeleteUsers refresh={0} />);

    // Wait for user to appear in the table
    const userRow = await screen.findByText(new RegExp(username, "i"));
    
    // get the row, where the user is
    const tableRow = userRow.closest("tr");

    // Find and click "Delete"-button
    const deleteButton = tableRow.querySelector("button");
    fireEvent.click(deleteButton);

    // Ensure, that user has been deleted from the table
    await waitFor(() => {
        expect(screen.queryByText(new RegExp(username, "i"))).not.toBeInTheDocument();
    });
});