"use client";

import {
  Children,
  cloneElement,
  createRef,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";
import gsap from "gsap";
import "./CardSwap.css";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  customClass?: string;
};

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, className, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ""} ${className ?? ""}`.trim()} />
));
Card.displayName = "Card";

const makeSlot = (i: number, distX: number, distY: number, total: number) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement, slot: ReturnType<typeof makeSlot>, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });

export type CardSwapProps = {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
  className?: string;
};

export default function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
  className,
}: CardSwapProps) {
  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => createRef<HTMLDivElement>()),
    [childArr.length],
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isAnimatingRef = useRef(false);
  const container = useRef<HTMLDivElement>(null);

  const numericHeight = typeof height === "number" ? height : 400;

  useEffect(() => {
    const animationConfig =
      easing === "elastic"
        ? {
            ease: "elastic.out(0.6,0.9)",
            durDrop: 1.4,
            durMove: 1.4,
            durReturn: 1.4,
            promoteOverlap: 0.85,
            returnDelay: 0.05,
          }
        : {
            ease: "power2.inOut",
            durDrop: 0.65,
            durMove: 0.65,
            durReturn: 0.65,
            promoteOverlap: 0.4,
            returnDelay: 0.12,
          };

    const total = refs.length;

    const resetStack = () => {
      order.current = Array.from({ length: total }, (_, i) => i);
      refs.forEach((r, i) => {
        if (r.current) {
          gsap.killTweensOf(r.current);
          placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
        }
      });
    };

    resetStack();

    const swap = () => {
      if (isAnimatingRef.current || order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      if (!elFront) return;

      isAnimatingRef.current = true;
      tlRef.current?.kill();

      const dropDistance = numericHeight * 0.55;
      const currentY = Number(gsap.getProperty(elFront, "y")) || 0;

      const tl = gsap.timeline({
        onComplete: () => {
          isAnimatingRef.current = false;
        },
      });
      tlRef.current = tl;

      tl.to(elFront, {
        y: currentY + dropDistance,
        duration: animationConfig.durDrop,
        ease: animationConfig.ease,
      });

      tl.addLabel("promote", `-=${animationConfig.durDrop * animationConfig.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        if (!el) return;

        const slot = makeSlot(i, cardDistance, verticalDistance, total);
        tl.set(el, { zIndex: slot.zIndex }, "promote");
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: animationConfig.durMove,
            ease: animationConfig.ease,
          },
          `promote+=${i * 0.12}`,
        );
      });

      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
      tl.addLabel("return", `promote+=${animationConfig.durMove * animationConfig.returnDelay}`);
      tl.set(elFront, { zIndex: backSlot.zIndex }, "return");
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: animationConfig.durReturn,
          ease: animationConfig.ease,
        },
        "return",
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    const startInterval = () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(swap, delay);
    };

    const stopInterval = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    startInterval();

    const node = container.current;

    const pause = () => {
      tlRef.current?.pause();
      stopInterval();
    };

    const resume = () => {
      if (tlRef.current?.paused()) {
        tlRef.current.play();
      }
      if (!intervalRef.current) {
        startInterval();
      }
    };

    if (pauseOnHover && node) {
      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);
    }

    return () => {
      stopInterval();
      tlRef.current?.kill();
      isAnimatingRef.current = false;
      refs.forEach((r) => {
        if (r.current) gsap.killTweensOf(r.current);
      });
      if (pauseOnHover && node) {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
      }
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs.length, numericHeight]);

  const rendered = childArr.map((child, i) => {
    if (!isValidElement(child)) return child;

    const element = child as ReactElement<{
      style?: CSSProperties;
      onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    }>;

    return cloneElement(element, {
      key: i,
      ref: refs[i],
      style: { width, height, ...(element.props.style ?? {}) },
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        element.props.onClick?.(event);
        onCardClick?.(i);
      },
    } as React.Attributes & { ref: typeof refs[number] });
  });

  return (
    <div
      ref={container}
      className={`card-swap-container${className ? ` ${className}` : ""}`}
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
}
