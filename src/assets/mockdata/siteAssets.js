/**
 * Site assets (web images) – stored as if in database.
 * Keys: home_background, login_background, site_logo
 * Image files live in ./siteImages/ (koosen.jpg, koosenLogo.png).
 */
import koosenJpg from './siteImages/koosen.jpg'
import koosenLogoPng from './siteImages/koosenLogo.png'

export const siteAssets = [
  { id: 1, key: 'home_background', url: koosenJpg },
  { id: 2, key: 'login_background', url: koosenJpg },
  { id: 3, key: 'site_logo', url: koosenLogoPng },
]
