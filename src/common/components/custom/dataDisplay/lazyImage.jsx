import {Suspense, useState, useEffect} from 'react'

const LazyImage = ({src, alt, className, title = ''}) => {
  const [imageSrc, setImageSrc] = useState(null)

  useEffect(() => {
    if (typeof src === 'function') {
      try {
        src()?.then(module => {
          setImageSrc(module.default)
        })
      } catch (e) {

      }
    } else {
      setImageSrc(src)
    }
  }, [src])

  return (
    <Suspense fallback={<div className={className} />}>
      {imageSrc && <img src={imageSrc} alt={alt} className={className} title={title} />}
    </Suspense>
  )
}

export default LazyImage
