/**
 * @name loveMsg
 * @description 入口
 */
import dotenv from 'dotenv'
import { goodMorning } from './goodMorning'
import { goodAfternoon } from './goodAfternoon'
import { goodEvening } from './goodEvening'
import { getNbaNews } from './goodNew'
dotenv.config()

export default {
  goodAfternoon,
  goodEvening,
  goodMorning,
  getNbaNews
}
// export default function main() {
//   if (MESSAGE_TYPE === 'goodAfternoon') {
//     // 午安
//     goodAfternoon()
//   }
//   else if (MESSAGE_TYPE === 'goodEvening') {
//     // 晚安
//     goodEvening()
//   }
//   else {
//     // 早安
//     goodMorning()
//   }
// }
