const axios = require('axios');
const cheerio = require('cheerio');

const baseURL = 'http://www.jiaoliu.ecnu.edu.cn/11184/list';
const prefix = 'http://www.jiaoliu.ecnu.edu.cn/';

async function fetchContent(link) {
    const { data } = await axios.get(link);
    const $ = cheerio.load(data);
    return $('.Article_Content').text().trim();  // 返回详细页面中的内容
}

async function fetchNewsFromPage(pageNumber) {
    const { data } = await axios.get(`${baseURL}${pageNumber}.htm`);
    const $ = cheerio.load(data);
    const newsItems = [];
    const links = new Set();  // 使用 Set 来存储已经见过的链接

    $('div[frag="窗口3"]').find('tr').each((i, tr) => {
        const titleElement = $(tr).find('a');
        const title = titleElement.attr('title');
        const link = prefix + titleElement.attr('href');  // 在链接前添加前缀
        const date = $(tr).find('div').text();

        // 只有当链接之前没有见过时，才添加新的新闻条目
        if (!links.has(link)) {
            newsItems.push({
                title: title,
                link: link,
                date: date
            });

            // 将链接添加到 Set 中
            links.add(link);
        }
    });

    return newsItems;
}

async function getNews() {
    const totalPages = 5;  // 设置总页数为5

    let allNewsItems = [];
    for (let i = 1; i <= totalPages; i++) {
        const newsItems = await fetchNewsFromPage(i);
        allNewsItems = allNewsItems.concat(newsItems);
    }

    // 对于每个新闻项，获取其详细内容
    for (const item of allNewsItems) {
        item.content = await fetchContent(item.link);
        item.sign = "留学";
    }

    return allNewsItems;
}

module.exports = {
    getNews: getNews
};
