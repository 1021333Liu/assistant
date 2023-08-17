const axios = require('axios');
const cheerio = require('cheerio');
const prefix = "http://www.comm.ecnu.edu.cn/";

async function fetchNewsContent(link) {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    return $("#news_detail_content").text().trim();
}

async function getNews() {
    const url = 'http://www.comm.ecnu.edu.cn/htmlaction.do?method=toGetSubNewsList&menuType=12&pageNo=0';
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const newsItems = [];
    $('.news_area_text').each((idx, element) => {
        const link = prefix + $(element).find('a').attr('href');
        const title = $(element).find('.cur_news').text();
        const date = $(element).find('.newsdate').text().trim();
        newsItems.push({ title, link, date });
    });

    for (const item of newsItems) {
        item.content = await fetchNewsContent(item.link);
        item.sign = '传播学院';
    }

    return newsItems;
}

module.exports = {
    getNews: getNews
};
