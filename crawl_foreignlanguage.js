const axios = require('axios');
const cheerio = require('cheerio');

const baseURL = 'http://www.fl.ecnu.edu.cn/11684/list';
const prefix = 'http://www.fl.ecnu.edu.cn/';

async function fetchContent(link) {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    return $('div[frag="窗口3"] .Article_Content').text().trim();
}

async function fetchNewsFromPage(pageNumber) {
    const { data } = await axios.get(`${baseURL}${pageNumber}.htm`);
    const $ = cheerio.load(data);
    const newsItems = [];
    const links = new Set();

    $('div[id="wp_news_w3"] table tr').each((i, tr) => {
        const titleElement = $(tr).find('a');
        const title = titleElement.text().trim();
        const link = prefix + titleElement.attr('href');
        const date = $(tr).find('div').text().trim();

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
    const totalPages = 5;

    let allNewsItems = [];
    for (let i = 1; i <= totalPages; i++) {
        const newsItems = await fetchNewsFromPage(i);
        allNewsItems = allNewsItems.concat(newsItems);
    }

    for (const item of allNewsItems) {
        item.content = await fetchContent(item.link);
        item.sign = '外语';
    }

    return allNewsItems;
}

module.exports = {
    getNews: getNews
};
