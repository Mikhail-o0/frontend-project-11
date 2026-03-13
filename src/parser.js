const parseRSS = (xmlString) => {
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml')

  const parseError = xmlDoc.querySelector('parsererror')
  if (parseError) {
    throw new Error('parse')
  }

  const channel = xmlDoc.querySelector('channel')
  if (!channel) {
    throw new Error('parse')
  }

  const feedTitle = channel.querySelector('title')?.textContent || ''
  const feedDescription = channel.querySelector('description')?.textContent || ''

  const items = xmlDoc.querySelectorAll('item')
  const posts = Array.from(items).map((item) => ({
    title: item.querySelector('title')?.textContent || '',
    description: item.querySelector('description')?.textContent || '',
    link: item.querySelector('link')?.textContent || '',
  }))

  return {
    feed: {
      title: feedTitle,
      description: feedDescription,
    },
    posts,
  }
}

export default parseRSS
