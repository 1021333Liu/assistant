const fs = require('fs');
const crawl1 = require('./crawl_comm.js');
const crawl2 = require('./crawl_foreignlanguage.js');
const crawl3 = require('./crawl_guohan.js');
const crawl4 = require('./crawl_history.js');
const crawl5 = require('./crawl_jingsai.js'); // 新添加的爬虫
const crawl6 = require('./crawl_jwc.js');
const crawl7 = require('./crawl_liuxue.js');
const crawl8 = require('./crawl_simian.js');
const crawl9 = require('./crawl_zwx.js');
const { execSync } = require('child_process');


async function main() {
    const allNewsItems = [];

    // 这部分代码结构基本相同，但是添加了新的爬虫调用
    try {
        const newsComm = await crawl1.getNews();
        allNewsItems.push(...newsComm);
        console.log('Completed: Crawl Comm');
    } catch (err) {
        console.error('Error in Crawl Comm:', err);
    }
    //传院官网有时维护

    try {
        const newsForeignLanguage = await crawl2.getNews();
        allNewsItems.push(...newsForeignLanguage);
        console.log('Completed: Crawl Foreign Language');
    } catch (err) {
        console.error('Error in Crawl Foreign Language:', err);
    }

    try {
        const newsGuohan = await crawl3.getNews();
        allNewsItems.push(...newsGuohan);
        console.log('Completed: Crawl Guohan');
    } catch (err) {
        console.error('Error in Crawl Guohan:', err);
    }

    try {
        const newshistory = await crawl4.getNews();
        allNewsItems.push(...newshistory);
        console.log('Completed: Crawl history');
    } catch (err) {
        console.error('Error in Crawl history:', err);
    }

   try {
        const newsJingsai = await crawl5.getNews();
        allNewsItems.push(...newsJingsai);
        console.log('Completed: Crawl Jingsai');
    } catch (err) {
        console.error('Error in Crawl Jingsai:', err);
    }

    try {
        const newsjwc = await crawl6.getNews();
        allNewsItems.push(...newsjwc);
        console.log('Completed: Crawl Jwc');
    } catch (err) {
        console.error('Error in Crawl Jwc:', err);
    }

    try {
        const newsliuxue = await crawl7.getNews();
        allNewsItems.push(...newsliuxue);
        console.log('Completed: Crawl Liuxue');
    } catch (err) {
        console.error('Error in Crawl Liuxue:', err);
    }

    try {
        const newssimian = await crawl8.getNews();
        allNewsItems.push(...newssimian);
        console.log('Completed: Crawl Simian');
    } catch (err) {
        console.error('Error in Crawl Simian:', err);
    }
    
    try {
        const newszwx = await crawl9.getNews();
        allNewsItems.push(...newszwx);
        console.log('Completed: Crawl Zwx');
    } catch (err) {
        console.error('Error in Crawl Zwx:', err);
    }


      // 按日期进行排序
      allNewsItems.sort((a, b) => new Date(b.date) - new Date(a.date));

      // 读取基础的123.json文件内容
      const existingItems = JSON.parse(fs.readFileSync('123.json', 'utf8'));
  
      // 过滤出新的新闻项
      const newItems = allNewsItems.filter(item => 
          !existingItems.some(existItem => existItem.title === item.title && existItem.date === item.date)
      );
  
      // 将新的新闻项保存到newData.json文件中
      fs.writeFileSync('newData.json', JSON.stringify(newItems, null, 2));
      console.log('New news items written to newData.json');
  
      // 合并现有内容与新的新闻项
      const combinedItems = [...existingItems, ...newItems];

      // 对合并后的内容按日期进行排序
      combinedItems.sort((a, b) => new Date(b.date) - new Date(a.date));   

      // 将合并后的内容写回到123.json文件
      fs.writeFileSync('123.json', JSON.stringify(combinedItems, null, 2));
      console.log('All news items written to 123.json');
      //执行修改格式操作
      execSync('node change.js', { stdio: 'inherit' });
      console.log('Executed change.js successfully.');

      
}

main();
