/**
 * @description 文本卡片模板 title + description
 * https://open.work.weixin.qq.com/api/doc/90000/90135/90236
 */

/**
 * 卡片类型模板定义
 * 模板内容配置
 * 微信通知 textcard类型的description内容限制512个字节
 */

import dayjs from '../../../utils/dayjs'
import { getConfig } from '../../../utils/getConfig'
import { getDaysToBirthday } from '../../../utils/holiday'
import { randomFromArray } from './util'
const CONFIG = getConfig().loveMsg
const selfDuration = getDaysToBirthday(CONFIG.birthday_self)
const wifeDuration = getDaysToBirthday(CONFIG.birthday)
console.log(selfDuration, 'selfDuration')
export const textCardTemplate = (data: TextCardTemplateProps) => {
  const {
    area,
    date,
    weather,
    highest,
    lowest,
    wind,
    windsc,
    humidity,
    week,
    pop,
    pcpn,
    tips,
    lunarInfo,
  } = data
  // 今日、恋爱天数
  const today = `${date.replace('-', '年').replace('-', '月')}日`
  const dateLength = dayjs(date).diff(CONFIG.start_stamp, 'day')

  // 拼接内容
  let description = `${area} | ${today} | ${week}`

  if (CONFIG.date_lunarInfo && lunarInfo) {
    const { festival, lunar_festival, jieqi, lubarmonth, lunarday } = lunarInfo
    // 公历节日、农历节日和二十四节气
    const festival_info = festival ? `| ${festival}` : ''
    const lunar_festival_info = lunar_festival ? `| ${lunar_festival}` : ''
    const jieqi_info = jieqi ? `| ${jieqi}` : ''

    description += ` ${festival_info}
农历 | ${lubarmonth}${lunarday} ${lunar_festival_info} ${jieqi_info}`
  }

  description += `\n今日天气状况：
天气：${weather}
温度：${lowest} ~ ${highest}\n`

  if (weather.includes('雨')) {
    description += `降雨：${pop}% | ${pcpn}mm\n`
  }
  if (pop > 50) {
    description += `今天可能会下雨,小宝贝记得带伞哦\n`
  }
  // 生活指数提示
//   if (CONFIG.weather_tips && tips) {
//     description += `
// ${tips}\n`
//   }

  // 最高温度
  if (CONFIG.weather_tem && highest && +highest.replace('℃', '') <= 3) {
    description += `
哈喽哈喽~这里是来自${CONFIG.boy_name}的爱心提醒哦：
今日最高温度仅为🥶 ${highest}，可冷可冷了~
${CONFIG.girl_name}可要注意保暖哦~\n`
  }
  // 温馨小提示
  description += `
    温馨小tip: 
      距离臭老婆生日还有${wifeDuration}天
      距离小猴子生日还有${selfDuration}天
  `
  // 内容末尾，自定义
  description += `
  [ 点我有惊喜 ] 💚 💖 🐷 🐒${randomFromArray()} `

  const title = `这是我们相识的第 ${dateLength} 天`

  return {
    msgtype: 'textcard',
    textcard: {
      title,
      description,
      //   url: 'https://api.lovelive.tools/api/SweetNothings',
      //   url: 'https://v1.jinrishici.com/all.svg',
      url: `${CONFIG.card_url}`, // 60s看世界
      btntxt: `By${CONFIG.boy_name}`,
    },
  }
}
