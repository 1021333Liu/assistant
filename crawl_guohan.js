const axios = require('axios');
const cheerio = require('cheerio');

const baseURL = 'https://chinese.ecnu.edu.cn/13093/list';

async function fetchNewsFromPage(pageNumber) {
    const { data } = await axios.get(`${baseURL}${pageNumber}.htm`);
    const $ = cheerio.load(data);
    const newsItems = [];

    $('.news_list.list2 li').each((i, li) => {
        const titleElement = $(li).find('.news_title a');
        const title = titleElement.text().trim();
        const link = titleElement.attr('href');
        const date = $(li).find('.news_meta').text().trim();

        newsItems.push({
            title: title,
            link: link,
            date: date,
            content: '',
            sign: "讲座",
        });
    });

    return newsItems;
}

async function getNews() {
    const totalPages = 4;

    let allNewsItems = [];
    for (let i = 1; i <= totalPages; i++) {
        const newsItems = await fetchNewsFromPage(i);
        allNewsItems = allNewsItems.concat(newsItems);
    }

    return allNewsItems;
}

module.exports = {
    getNews: getNews
};
