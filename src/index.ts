import dotenv from 'dotenv'
import LoveMsg from './libs/LoveMsg'
const { goodAfternoon, goodEvening, goodMorning, getNbaNews } = LoveMsg
const schedule = require('node-schedule');
dotenv.config()
// getNbaNews()

// 早安
goodMorning()
// goodEvening()

schedule.scheduleJob('1 30 8 * * *', () => {
  // schedule.scheduleJob('1 * * * * *', () => {
  goodMorning()
});
// 午安
// schedule.scheduleJob('1 1 13 * * *', () => {
//   // getNbaNews()
//   goodAfternoon()
// });
// 晚安
schedule.scheduleJob('1 30 22 * * *', () => {
  goodEvening()
})
// 早安、午安、晚安 => 由环境变量控制
// LoveMsg()
