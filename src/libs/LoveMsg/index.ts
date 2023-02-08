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
