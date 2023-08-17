const axios = require('axios');
const cheerio = require('cheerio');

const baseURL = 'https://zhwx.ecnu.edu.cn/xsgg/list';
const prefix = 'https://zhwx.ecnu.edu.cn/';

async function fetchContent(link) {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    return $('.wp_articlecontent').text().trim();
}

async function fetchNewsFromPage(pageNumber) {
    const { data } = await axios.get(`${baseURL}${pageNumber}.htm`);
    const $ = cheerio.load(data);
    const newsItems = [];
    const links = new Set();

    $('.ac-xul li').each((i, li) => {
        const titleElement = $(li).find('.li-dtt a').first();
        const title = titleElement.attr('title');
        const link = prefix + titleElement.attr('href');
        const date = $(li).find('.li-date span').text().trim() + '-' + $(li).find('.li-date p').text().trim();

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
    let allNewsItems = [];
    for (let i = 1; i <= 5; i++) {
        const newsItems = await fetchNewsFromPage(i);
        allNewsItems.push(...newsItems);
    }

    // Populate content for each news item
    for (const item of allNewsItems) {
        const content = await fetchContent(item.link);
        item.content = content;
        item.sign = "中文系";
    }

    return allNewsItems;
}

module.exports = {
    getNews: getNews
};
