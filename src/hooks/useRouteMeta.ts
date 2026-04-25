import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

import { SITE_DOMAIN, getRouteMeta } from '../data/siteData'

function applyHeadMeta(name: string, content: string, attr = 'name') {
  const metaAttr = name.startsWith('og:') ? 'property' : attr
  const selector = `meta[${metaAttr}="${name}"]`
  let tag = document.querySelector(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(metaAttr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function applyCanonical(url: string) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function normalizePath(path: string): string {
  if (!path || path === '/') {
    return '/'
  }

  return path.endsWith('/') ? path.slice(0, -1) : path
}

export function useRouteMeta() {
  const location = useLocation()
  const currentPath = normalizePath(location.pathname)
  const meta = getRouteMeta(currentPath)
  const canonical = `${SITE_DOMAIN}${meta.canonical}`

  useEffect(() => {
    document.title = meta.title
    applyHeadMeta('description', meta.description)
    applyHeadMeta('og:title', meta.title)
    applyHeadMeta('og:description', meta.description)
    applyHeadMeta('og:type', 'website')
    applyHeadMeta('og:url', canonical)
    applyCanonical(canonical)
  }, [meta.title, meta.description, canonical])

  return meta
}
