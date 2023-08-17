const axios = require('axios');
const cheerio = require('cheerio');

const baseURL = 'https://si-mian.ecnu.edu.cn/1624/list';
const prefix = 'https://si-mian.ecnu.edu.cn/';

async function fetchContent(link) {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    return $('.Article_Content').text().trim();  // 返回详细页面中的内容
}

async function fetchNewsFromPage(pageNumber) {
    const { data } = await axios.get(`${baseURL}${pageNumber}.htm`);
    const $ = cheerio.load(data);
    const newsItems = [];
    const links = new Set();

    $('.wp_article_list li').each((i, li) => {
        const titleElement = $(li).find('.Article_Title a').first();
        const title = titleElement.attr('title');
        const link = prefix + titleElement.attr('href');
        const date = $(li).find('.Article_PublishDate').text().trim();

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
    for (let i = 1; i <= 5; i++) {  // 这里我们只循环5次来抓取前5页的数据
        const newsItems = await fetchNewsFromPage(i);
        allNewsItems.push(...newsItems);
    }

    // 对于每个新闻项，获取其详细内容
    for (const item of allNewsItems) {
        const content = await fetchContent(item.link);
        item.content = content;
        item.sign = "讲座";
    }

    return allNewsItems;
}

module.exports = {
    getNews: getNews
};
