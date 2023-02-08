/**
 * @name goodEvening
 * @description 说晚安
 */
import API from '../../api/loveMsg'
import { wxNotify } from '../WxNotify'
import { newsTemplate } from './templates/news'

// 获取新闻
const getNews = async () => {
  try {
    // 每日简报
    // const dailyBriefing = await API.getDailyBriefing()
    // const formateData: TodayHeadlines[] = dailyBriefing.map((n) => ({
    //   ...n,
    //   title: n.title,
    //   description: n.digest,
    //   picUrl: n.imgsrc,
    //   ctime: n.mtime,
    // }))
    // 今日头条
    const todayTopNews = await API.getTianTopNews()
    // 最多8条
    const template = newsTemplate(todayTopNews.slice(0, 8))
    await wxNotify(template)
  }
  catch (error) {
    console.log('goodEvening', error)
  }
}

// 获今日取故事
const getStory = async () => {
  const res = await API.getStorybook()
  // 最长600字, 需要分割res.content 每段不超过600字, 多次发送
  let num = res.content.length / 600
  num = Math.floor(num) + 1
  for (let i = 0; i < num; i++) {
    const content = res.content.slice(i * 600, (i + 1) * 600)
    const template = {
      msgtype: 'text',
      text: {
        content: '',
      },
    }
    if (i === 0) {
      template.text.content = `给臭老婆的今日份睡前晚安故事来喽：
      🌑🌒🌓🌔🌕🌝😛\n
      『${res.title}』
      ${res.content}`
    } else {
      template.text.content = content
    }
    await wxNotify(template)
  }


}

// 执行函数
export const goodEvening = async () => {
  await getStory()
  // await getNews()
}
