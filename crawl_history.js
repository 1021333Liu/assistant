const axios = require('axios');
const cheerio = require('cheerio');
const prefix = 'https://history.ecnu.edu.cn/';
const baseURL = 'https://history.ecnu.edu.cn/33433/list';

async function fetchContent(link) {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    const content = $('.wp_articlecontent').text().trim();
    return content;
}

async function fetchNewsFromPage(pageNumber) {
    const { data } = await axios.get(`${baseURL}${pageNumber}.htm`);
    const $ = cheerio.load(data);
    const newsItems = [];
    const links = new Set();

    $('div[frag="窗口7"] .data-list2 li').each((i, li) => {
        const titleElement = $(li).find('a').first();
        const title = titleElement.attr('title');
        const link = prefix + titleElement.attr('href');
        const date = $(li).find('span').text().trim();

        if (!links.has(link)) {
            newsItems.push({
                title: title,
                link: link,
                date: date
            });
            links.add(link);
        }
    });

    return newsItems;
}

async function getNews() {
    const allNewsItems = [];
    for (let i = 1; i <= 5; i++) {
        const newsItems = await fetchNewsFromPage(i);
        allNewsItems.push(...newsItems);
    }

    // Populate contents for each news item
    for (const item of allNewsItems) {
        item.content = await fetchContent(item.link);
        item.sign = "历史系";
    }

    return allNewsItems;
}

module.exports = {
    getNews: getNews
};
