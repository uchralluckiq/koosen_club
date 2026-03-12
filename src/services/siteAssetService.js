import { siteAssets } from '../mockdata/siteAssets'

const USE_BACKEND = false
const API_BASE_URL = '/api'

const delay = (data, ms = 200) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms))

/**
 * Resolve asset URL by key from mock data.
 */
function getMockUrl(key) {
  const row = siteAssets.find((a) => a.key === key)
  return row ? row.url : null
}

export const siteAssetService = {
  /**
   * Get site asset URL by key.
   * Keys: home_background, login_background, site_logo
   * @param {string} key
   * @returns {Promise<string|null>}
   */
  async getUrl(key) {
    if (USE_BACKEND) {
      const response = await fetch(`${API_BASE_URL}/site-assets/${key}`)
      if (!response.ok) throw new Error('Failed to fetch site asset')
      const data = await response.json()
      return data?.url ?? null
    }
    const url = getMockUrl(key)
    return delay(url)
  },

  /**
   * Get home page background image URL.
   * @returns {Promise<string|null>}
   */
  async getHomeBackgroundUrl() {
    return this.getUrl('home_background')
  },

  /**
   * Get login page background image URL.
   * @returns {Promise<string|null>}
   */
  async getLoginBackgroundUrl() {
    return this.getUrl('login_background')
  },

  /**
   * Get site logo image URL (header).
   * @returns {Promise<string|null>}
   */
  async getLogoUrl() {
    return this.getUrl('site_logo')
  },
}
