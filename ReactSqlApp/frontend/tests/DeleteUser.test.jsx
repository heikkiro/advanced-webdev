import React from "react";
import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import axios from "axios";
import { it, expect, vi } from "vitest";
import ReadDeleteUsers from '../components/ReadDeleteUsers';

vi.mock("axios");

// Luodaan satunnainen käyttäjänimi ja -tiedot
const username = (Math.random() + 1).toString(36).substring(7);
const year = Math.floor(Math.random() * (2010 - 1930 + 1)) + 1930;
const month = ('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2);
const day = ('0' + (Math.floor(Math.random() * 28) + 1)).slice(-2);
const birthDate = `${year}-${month}-${day}`;
const occupation = (Math.random() + 1).toString(36).substring(7);

it("deletes the correct user", async () => {

    // Mockataan ensimmäinen axios.get, joka palauttaa käyttäjän
    axios.get.mockResolvedValueOnce({ data: [{ id: 1, username, occupation, birthDate }] });

    // Mockataan axios.delete
    axios.delete.mockResolvedValue({});

    // Mockataan toinen axios.get, joka palauttaa tyhjän listan
    axios.get.mockResolvedValueOnce({ data: [] });

    await act(async () => {
        render(<ReadDeleteUsers refresh={true} />);
    });

    // Odotetaan, että käyttäjä ilmestyy listalle
    await waitFor(() => {
        expect(screen.getByText(username)).toBeInTheDocument();
    });

    // Etsitään käyttäjän rivi ja delete-nappi
    const userRow = screen.getByText(username).closest("tr");

    const deleteButton = within(userRow).getByText("Delete");

    // Klikataan delete-nappia act() sisällä
    await act(async () => {
        fireEvent.click(deleteButton);
    });

    // Odotetaan, että axios.delete kutsutaan
    await waitFor(() => {
        expect(axios.delete).toHaveBeenCalledWith("http://localhost:3000/users/1");
    });

    // Varmistetaan, että axios.get on kutsuttu uudelleen ja palauttaa tyhjän listan
    await waitFor(() => {
        expect(axios.get).toHaveBeenCalledTimes(2); // Varmistetaan, että axios.get on kutsuttu kaksi kertaa
    });

    // Odotetaan, että käyttäjä poistetaan listalta
    await waitFor(() => {
        expect(screen.queryByText(username)).toBeNull();
    });

    // Lisää vielä yksi tarkistus varmistaaksesi, että lista on todella tyhjä
    await waitFor(() => {
        expect(screen.queryAllByText(username).length).toBe(0);
    });
});