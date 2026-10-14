import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  showText?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  showText = false,
  className = '',
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  const activeRating = hoverRating !== null ? hoverRating : rating;

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index);
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: maxStars }).map((_, i) => {
          const starValue = i + 1;
          const isFilled = activeRating >= starValue;
          const isHalf = !isFilled && activeRating >= starValue - 0.5;

          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onClick={() => handleClick(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(null)}
              className={`${
                interactive ? 'cursor-pointer transform hover:scale-110 transition-transform' : 'cursor-default'
              } p-0.5 focus:outline-none`}
            >
              <Star
                className={`${starSizes[size]} ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400'
                    : isHalf
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'fill-slate-100 dark:fill-slate-800 text-slate-300 dark:text-slate-600'
                } transition-colors`}
              />
            </button>
          );
        })}
      </div>

      {showText && (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1.5">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};
