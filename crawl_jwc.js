const axios = require('axios');
const cheerio = require('cheerio');

const prefix = 'http://www.jwc.ecnu.edu.cn/';

function getFullURL(url) {
    return url.startsWith('http') ? url : prefix + url;
}

async function getNewsContent(link) {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    return $('.wp_articlecontent').text().trim();
}

async function getNewsFromPage(pageNumber = 1, maxPages = 10) {
    if (pageNumber > maxPages) {
        return [];
    }

    const url = `http://www.jwc.ecnu.edu.cn/tzggwwxsgg/list${pageNumber}.htm`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const newsItems = [];

    $('.news_list .news').each((idx, element) => {
        const link = getFullURL($(element).find('a').attr('href'));
        const title = $(element).find('.news_title').text().trim();
        const date = $(element).find('.news_date').text().trim();

        if (link.includes('www.jwc.ecnu.edu.cn')) {
            newsItems.push({ title, link, date, sign: '教务' });
        }
    });

    for (const item of newsItems) {
        item.content = await getNewsContent(item.link);
    }

    const nextPageLink = $('.page_nav .next').attr('href');
    if (nextPageLink) {
        const nextPageNumber = parseInt(nextPageLink.split('list')[1].split('.')[0]);
        return newsItems.concat(await getNewsFromPage(nextPageNumber, maxPages));
    }

    return newsItems;
}

async function getNews() {
    return await getNewsFromPage();
}

module.exports = {
    getNews: getNews
};
