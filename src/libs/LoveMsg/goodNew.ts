import API from '../../api/loveMsg'
import { newsTemplate } from './templates/news'
import { wxNotify } from '../WxNotify'

export const getNbaNews = async () => {
  const result = await API.getNBANews()
  const template = newsTemplate(result.slice(0, 8))
  await wxNotify({
    ...template
  })

}
