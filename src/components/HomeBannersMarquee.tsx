import { Link } from 'react-router-dom'
import { useInfiniteMarqueeDrag } from '@/hooks/useInfiniteMarqueeDrag'

export type HomeBannerItem = {
  tag: string
  title: string
  sub: string
  ctaClass: 'home-banner__cta--red' | 'home-banner__cta--orange'
  to: string
  img: string
  imgAlt: string
}

export function HomeBannersMarquee({ banners }: { banners: HomeBannerItem[] }) {
  const {
    marqueeRef,
    trackRef,
    firstSetRef,
    reducedMotion,
    onPointerDown,
    onLinkClickCapture,
  } = useInfiniteMarqueeDrag({
    autoplaySecondsPerPeriod: 44,
    autoplayDirection: 1,
    measurementKey: banners,
  })

  const trackClass = `home-banners__track${reducedMotion ? '' : ' home-banners__track--js'}`

  return (
    <div
      ref={marqueeRef}
      className="home-banners__marquee"
      aria-label="Promoções em faixa contínua; arraste para ver mais ou impulsionar o movimento"
      onPointerDown={onPointerDown}
      role="presentation"
    >
      <div ref={trackRef} className={trackClass}>
        <div ref={firstSetRef} className="home-banners__set">
          {banners.map((b) => (
            <Link
              key={b.title}
              to={b.to}
              className="home-banner"
              onClickCapture={onLinkClickCapture}
            >
              <div className="home-banner__inner">
                <span className="home-banner__tag">{b.tag}</span>
                <p className="home-banner__title">{b.title}</p>
                <p className="home-banner__sub">{b.sub}</p>
                <span className={`home-banner__cta ${b.ctaClass}`}>
                  Pedir agora
                  <span aria-hidden> →</span>
                </span>
              </div>
              <img
                className="home-banner__photo"
                src={b.img}
                alt={b.imgAlt}
                width={200}
                height={140}
                loading="lazy"
              />
              <div className="home-banner__floor" aria-hidden />
            </Link>
          ))}
        </div>
        <div className="home-banners__set" aria-hidden="true">
          {banners.map((b) => (
            <Link
              key={`${b.title}-dup`}
              to={b.to}
              className="home-banner"
              tabIndex={-1}
              onClickCapture={onLinkClickCapture}
            >
              <div className="home-banner__inner">
                <span className="home-banner__tag">{b.tag}</span>
                <p className="home-banner__title">{b.title}</p>
                <p className="home-banner__sub">{b.sub}</p>
                <span className={`home-banner__cta ${b.ctaClass}`}>
                  Pedir agora
                  <span aria-hidden> →</span>
                </span>
              </div>
              <img
                className="home-banner__photo"
                src={b.img}
                alt=""
                width={200}
                height={140}
                loading="lazy"
              />
              <div className="home-banner__floor" aria-hidden />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
