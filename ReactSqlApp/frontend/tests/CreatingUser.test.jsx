import React from "react";
import { render, screen, fireEvent, waitFor, within, act } from "@testing-library/react";
import axios from "axios";
import { describe, it, expect, vi, beforeEach } from "vitest";
import CreateUser from '../components/CreateUser';
//import ReadDeleteUsers from '../components/ReadDeleteUsers';  // EI KÄYTETÄ

vi.mock("axios");

// Luodaan satunnainen käyttäjänimi testeille
const username = (Math.random() + 1).toString(36).substring(7);
const year = Math.floor(Math.random() * (2010 - 1930 + 1)) + 1930;
const month = ('0' + (Math.floor(Math.random() * 12) + 1)).slice(-2);
const day = ('0' + (Math.floor(Math.random() * 28) + 1)).slice(-2);
const birthDate = `${year}-${month}-${day}`;
const occupation = (Math.random() + 1).toString(36).substring(7);

describe("CreateUser Component", () => {
    beforeEach(() => {
        // Clear mocks before each test to avoid interaction between tests
        vi.clearAllMocks();
    });

    it("Adds a new user", async () => {
        axios.post.mockResolvedValue({ data: { username } });
        axios.get.mockResolvedValueOnce({ data: [{ id: 1, username, occupation, birthDate }] });

        render(<CreateUser />);

        fireEvent.change(screen.getByPlaceholderText("Username"), { target: { value: username } });
        fireEvent.change(screen.getByPlaceholderText("Birth_date (YYYY-MM-DD)"), { target: { value: birthDate } });
        fireEvent.change(screen.getByPlaceholderText("Occupation"), { target: { value: occupation } });

        fireEvent.click(screen.getByText("Create"));

        await waitFor(() => {
            expect(screen.getByText(`User created successfully: ${username}`)).toBeInTheDocument();
        });
    });

    //  TÄMÄ TESTI EI MILLÄÄN TOIMI YHDESSÄ TÄTÄ EDELTÄVÄN TESTIN KANSSA
    //  ERIKSEEN TOIMII, MUTTA EI YHDESSÄ.
    //  EI TOIMI EDES SUORAAN TIETOKANTAAN YHDISTETTYNÄ ILMAN AXIOS.MOCKEJA
    /*
    it("deletes the correct user", async () => {
        console.log("🟢 Testi alkaa");

        // Mockataan ensimmäinen axios.get, joka palauttaa käyttäjän
        axios.get.mockResolvedValueOnce({ data: [{ id: 1, username, occupation }] });
        console.log("🟢 Mockattu ensimmäinen axios.get");

        // Mockataan axios.delete
        axios.delete.mockResolvedValue({});
        console.log("🟢 Mockattu axios.delete");

        // Mockataan toinen axios.get, joka palauttaa tyhjän listan
        axios.get.mockResolvedValueOnce({ data: [] });
        console.log("🟢 Mockattu toinen axios.get");

        await act(async () => {
            render(<ReadDeleteUsers refresh={true} />);
        });
        console.log("🟢 Komponentti renderöity");

        // Odotetaan, että käyttäjä ilmestyy listalle
        await waitFor(() => {
            expect(screen.getByText(username)).toBeInTheDocument();
        });
        console.log("🟢 Käyttäjä näkyy listalla");

        // Etsitään käyttäjän rivi ja delete-nappi
        const userRow = screen.getByText(username).closest("tr");
        console.log("🔵 Käyttäjän rivi:", userRow?.innerHTML);

        const deleteButton = within(userRow).getByText("Delete");
        console.log("🟢 Delete-nappi löytyi:", deleteButton?.outerHTML);

        // Klikataan delete-nappia act() sisällä
        await act(async () => {
            fireEvent.click(deleteButton);
        });
        console.log("🟢 Delete-nappi klikattu");

        // Odotetaan, että axios.delete kutsutaan
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalledWith("http://localhost:3000/users/1");
        });
        console.log("🟢 axios.delete kutsuttu");

        // Varmistetaan, että axios.get on kutsuttu uudelleen ja palauttaa tyhjän listan
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(2); // Varmistetaan, että axios.get on kutsuttu kaksi kertaa
        });
        console.log("🟢 Varmistettu, että axios.get on kutsuttu kaksi kertaa");

        // Odotetaan, että käyttäjä poistetaan listalta
        await waitFor(() => {
            expect(screen.queryByText(username)).toBeNull();
        });
        console.log("🟢 Käyttäjä poistettu listalta");

        // Lisää vielä yksi tarkistus varmistaaksesi, että lista on todella tyhjä
        await waitFor(() => {
            expect(screen.queryAllByText(username).length).toBe(0);
        });
        console.log("🟢 Varmistettu, että käyttäjä on poistettu listalta");
    });
    */
});
