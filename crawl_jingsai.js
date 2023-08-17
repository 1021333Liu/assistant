const puppeteer = require('puppeteer');

async function fetchContentDetails(browser, link) {
    const pageDetail = await browser.newPage();
    await pageDetail.goto(link, { waitUntil: 'networkidle0', timeout: 60000 });

    const details = await pageDetail.evaluate(() => {
        const dateElement = document.querySelector('.Article_PublishDate');
        const contentElement = document.querySelector('.wp_articlecontent');

        return {
            date: dateElement ? dateElement.innerText : null,
            content: contentElement ? contentElement.innerText.trim() : null
        };
    });

    await pageDetail.close();
    return details;
}

async function getNews() {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    await page.goto('http://www.cxcy.ecnu.edu.cn/18354/list.htm', { waitUntil: 'networkidle0', timeout: 60000 });

    const data = await page.evaluate(() => {
        let results = [];
        let items = document.querySelectorAll('div[frag="窗口3"] tr');
        items.forEach((item) => {
            let title = item.querySelector('td a').innerText;
            let link = item.querySelector('td a').href;
            results.push({
                title: title,
                link: link
            });
        });

        return results;
    });

    const uniqueData = []; // This will store only unique data items

    for (let item of data) {
        const details = await fetchContentDetails(browser, item.link);

        // Construct the full item here
        const fullItem = {
            ...item,
            date: details.date,
            content: details.content,
            sign: "竞赛"
        };

        // Check if this item already exists in the uniqueData based on title and date
        const exists = uniqueData.some(
            existingItem => existingItem.title === fullItem.title && existingItem.date === fullItem.date
        );

        if (!exists) {
            uniqueData.push(fullItem);
        }
    }

    await browser.close();
    return uniqueData; // Return only the unique data items
}


module.exports = {
    getNews: getNews
};
