import dayjs from 'dayjs'
import { getConfig } from './getConfig'
import calendar from './calendar'
import tz from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
// dayjs.extend(utc);
dayjs.extend(tz);// 中国

const CONFIG = getConfig().loveMsg
const {
  birthday,
  birthday_self,
} = CONFIG
// 得到今年的年月日
dayjs.locale('zh-cn')

const year = dayjs().year()
// 距离女朋友生日还有多少天
export function getDaysToBirthday(date: Date = birthday): number {
  // console.log(new Date())
  // 根据birthday, 得到今年的公历生日日期
  // const birthday_month = dayjs(date).month() + 1
  // const birthday_day = dayjs(date).date()
  // 得到今年的公历生日日期
  // const { date: _date } = calendar.lunar2solar(year, birthday_month, birthday_day, false)
  // 返回距离下次生日还有多少天

  // const duration = dayjs().diff(_date, 'day')
  // console.log('_date', _date, duration);
  // throw new Error("端");

  // return duration < 0 ? Math.abs(duration) : 365 + duration

  return Math.abs(dayjs().diff(date, 'day'))
}
