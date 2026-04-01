import { CanvasProps } from '@/types'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

export function Canvas({
    size,
    backgroundImage,
    polygons,
    position,
    scale,
    isDragging,
    onMouseDown,
    className,
}: CanvasProps) {
    const svgContainerRef = useRef<HTMLDivElement>(null)

    return (
        <div
            onMouseDown={onMouseDown}
            className={cn(
                'absolute inset-0 overflow-hidden select-none',
                isDragging ? 'cursor-grabbing' : 'cursor-grab',
                className,
            )}
        >
            <div
                className="absolute inset-0 origin-center"
                style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                }}
            >
                {backgroundImage && (
                    <img
                        src={backgroundImage}
                        alt="Stadium background"
                        draggable={false}
                        className="pointer-events-none absolute inset-0 h-full w-full object-contain"
                    />
                )}
                <div
                    ref={svgContainerRef}
                    className="relative z-10 flex h-full w-full items-center justify-center"
                >
                    <svg
                        viewBox={`0 0 ${size[0]} ${size[1]}`}
                        preserveAspectRatio="xMidYMid meet"
                        className="block h-full w-full max-h-full max-w-full"
                    >
                        <rect
                            x="0"
                            y="0"
                            width={size[0]}
                            height={size[1]}
                            fill="transparent"
                        />

                        {polygons.map(({ id, points, fill, stroke, opacity, onClick, onMouseEnter, onMouseLeave }) => (
                            <polygon
                                key={id}
                                data-zone-id={id}
                                points={points}
                                fill={fill}
                                stroke={stroke}
                                strokeWidth="1"
                                style={{
                                    cursor: 'pointer',
                                    opacity,
                                    transition: 'opacity 0.15s ease',
                                }}
                                onClick={onClick}
                                onMouseEnter={onMouseEnter}
                                onMouseLeave={onMouseLeave}
                            />
                        ))}
                    </svg>
                </div>
            </div>
        </div>
    )
}