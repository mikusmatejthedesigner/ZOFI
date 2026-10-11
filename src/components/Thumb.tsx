import { thumb, type ThumbSize, type Video } from '../data/catalog'

/** Náhled videa z YouTube (16:9, ořízne černé pruhy). */
export function Thumb({
  video,
  size = 'md',
  className = '',
  eager = false,
}: {
  video: Video
  size?: ThumbSize
  className?: string
  eager?: boolean
}) {
  return (
    <img
      className={`thumb-img ${className}`}
      src={thumb(video, size)}
      alt=""
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
    />
  )
}
