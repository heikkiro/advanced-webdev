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

        // Täytä lomake ja lähetä se
        await page.waitForSelector('#create-user-form input[placeholder="Username"]');
        await page.locator('#create-user-form input[placeholder="Username"]').type(username);
        await page.locator('#create-user-form input[id="birthDate"]').type(birthDate);
        await page.locator('#create-user-form input[placeholder="Occupation"]').type(occupation);
        await page.locator('#create-user-form #premiumUser').click();
        await page.locator('button.btn-primary').click();

        // Odota taulukon päivittymistä ja tarkista, että käyttäjä lisättiin
        let userFound = false;
        let userId = null;
        const maxRetries = 10;

        for (let retry = 0; retry < maxRetries; retry++) {
            const rows = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('table tbody tr')).map(row => ({
                    id: row.cells[0]?.textContent.trim(),
                    username: row.cells[1]?.textContent.trim()
                }));
            });

            for (const row of rows) {
                if (row.username === username) {
                    userFound = true;
                    userId = row.id;
                    break;
                }
            }

            if (userFound) break;
            sleep(1);
        }

        check(userFound, {
            'User was added': (found) => found === true,
        });

        // Poista käyttäjä
        if (userFound && userId) {
            await page.evaluate((username) => {
                const row = Array.from(document.querySelectorAll('table tbody tr'))
                    .find(row => row.cells[1]?.textContent.trim() === username);
                if (row) {
                    const deleteButton = row.querySelector('button.btn-danger');
                    if (deleteButton) deleteButton.click();
                }
            }, username);

            // Odota hetki, että käyttäjä poistuu
            let userDeleted = false;
            for (let retry = 0; retry < maxRetries; retry++) {
                const tableText = await page.locator('table tbody').textContent();
                if (!tableText.includes(username)) {
                    userDeleted = true;
                    break;
                }
                sleep(1);
            }

            check(userDeleted, {
                'User was deleted': (deleted) => deleted === true,
            });
        }

    } finally {
        await page.close();
    }

    sleep(1);
}
