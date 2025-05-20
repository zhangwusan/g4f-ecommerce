'use client';
import React, {
  useEffect,
  useRef,
  useState,
  ReactNode,
  Children,
  isValidElement,
} from 'react';

type ScrollDirection = 'vertical' | 'horizontal';
type ScrollStyle = 'slide' | 'fade' | 'scale' | 'bounce';

type BannerProps = {
  children: ReactNode;
  interval?: number;
  direction?: ScrollDirection;
  styleType?: ScrollStyle;
};

function BannerItem({ children }: { children: ReactNode }) {
  return (
    <div className="h-10 min-w-full flex items-center justify-center px-4 text-sm font-medium">
      {children}
    </div>
  );
}

function Banner({
  children,
  interval = 3000,
  direction = 'vertical',
  styleType = 'slide',
}: BannerProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef(0);
  const [dimension, setDimension] = useState(0);

  const validChildren = Children.toArray(children).filter(isValidElement);

  useEffect(() => {
    const updateDimension = () => {
      if (!listRef.current) return;
      const firstItem = listRef.current.children[0] as HTMLElement;
      if (firstItem) {
        setDimension(direction === 'vertical' ? firstItem.offsetHeight : firstItem.offsetWidth);
      }
    };

    updateDimension();
    window.addEventListener('resize', updateDimension);
    return () => window.removeEventListener('resize', updateDimension);
  }, [direction, validChildren.length]);

  useEffect(() => {
    const scroll = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % validChildren.length;
      const offset = dimension * indexRef.current;

      if (!listRef.current) return;
      const container = listRef.current;

      switch (styleType) {
        case 'fade':
          container.style.opacity = '0';
          setTimeout(() => {
            container.style.transform =
              direction === 'vertical'
                ? `translateY(-${offset}px)`
                : `translateX(-${offset}px)`;
            container.style.opacity = '1';
            container.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
          }, 100);
          break;
        case 'scale':
          container.style.transform = 'scale(0.95)';
          setTimeout(() => {
            container.style.transform =
              (direction === 'vertical'
                ? `translateY(-${offset}px)`
                : `translateX(-${offset}px)`) + ' scale(1)';
            container.style.transition = 'transform 0.6s ease-in-out';
          }, 50);
          break;
        case 'bounce':
          container.style.transform =
            direction === 'vertical'
              ? `translateY(-${offset}px)`
              : `translateX(-${offset}px)`;
          container.style.transition = 'transform 0.6s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
          break;
        default:
          container.style.transform =
            direction === 'vertical'
              ? `translateY(-${offset}px)`
              : `translateX(-${offset}px)`;
          container.style.transition = 'transform 0.6s ease-in-out';
      }
    }, interval);

    return () => clearInterval(scroll);
  }, [dimension, direction, interval, validChildren.length, styleType]);

  const containerClass =
    direction === 'vertical' ? 'h-10 w-full' : 'h-10 w-full overflow-hidden';
  const listClass =
    direction === 'vertical'
      ? 'flex flex-col'
      : 'flex flex-row whitespace-nowrap';

  return (
    <div
      className={`relative overflow-hidden bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-white ${containerClass}`}
    >
      <div className={listClass} ref={listRef}>
        {validChildren}
      </div>
    </div>
  );
}

Banner.Item = BannerItem;
export default Banner;