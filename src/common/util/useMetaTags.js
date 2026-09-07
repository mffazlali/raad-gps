import { useEffect, useState } from 'react'

const useMetaTags = ({ title, description }) => {
  const [meta, setMeta] = useState({ title, description })

  useEffect(() => {
    const prevTitle = document.title
    document.title = meta.title
    let metaDescription = document.head.children.description
    if (metaDescription == null) {
      metaDescription = document.createElement('meta')
      metaDescription.name = 'description'
      document.head.append(metaDescription)
    }
    metaDescription.content = meta.description
    return () => {
      document.title = prevTitle
    }
  }, [meta])

  return [meta, setMeta]
}

export { useMetaTags }
