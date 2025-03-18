import { browser } from 'k6/browser';
import { check, sleep } from 'k6';

const appAddress = 'http://localhost:5173';

export const options = {
    scenarios: {
        browser: {
            executor: 'shared-iterations',
            vus: 5,
            iterations: 10,
            maxDuration: '2m',
            options: {
                browser: {
                    type: 'chromium',
                },
            },
        },
    },
};

export default async function () {
    const page = await browser.newPage();

    try {
        await page.goto(appAddress);

        // Luo satunnainen käyttäjänimi
        const username = Math.random().toString(36).substring(7);
        const birthDate = "1990-01-01";
        const occupation = "Tester";

        // Täytä lomake
        await page.waitForSelector('#create-user-form input[placeholder="Username"]');
        await page.locator('#create-user-form input[placeholder="Username"]').type(username);
        await page.locator('#create-user-form input[id="birthDate"]').type(birthDate);
        await page.locator('#create-user-form input[placeholder="Occupation"]').type(occupation);
        await page.locator('#create-user-form #premiumUser').click();
        await page.locator('button.btn-primary').click();

        // Odota taulukon päivittymistä ja etsi lisätty käyttäjä
        let userFound = false;
        const maxRetries = 10;

        for (let retry = 0; retry < maxRetries; retry++) {
            //console.log(`Odota taulukon sisältöä... Yritetään ${retry + 1}/${maxRetries}`);

            // Hae koko taulukon sisältö tekstinä
            const tableText = await page.locator('table tbody').textContent();
            //console.log(`Taulukon sisältö:\n${tableText}`);

            // Tarkista löytyykö lisätty käyttäjänimi taulukon sisällöstä
            if (tableText.includes(username)) {
                userFound = true;
                break;
            }

            sleep(1);
        }

        // Varmista, että käyttäjä lisättiin
        check(userFound, {
            'User was added': (found) => found === true,
        });

    } finally {
        await page.close();
    }

    sleep(1);
}
