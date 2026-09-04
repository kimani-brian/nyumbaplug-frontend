import React from 'react';

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Material Symbols ligature name, e.g. "search", "arrow_forward", "visibility". */
  name: string;
  /** Pixel size of the glyph. Defaults to 20. */
  size?: number;
  /** Render the filled variant of the glyph (Material FILL axis). */
  filled?: boolean;
  /** Weight axis (100-700). Defaults to 400. */
  weight?: number;
  /** Grade axis (-50 to 200). Defaults to 0. */
  grade?: number;
}

/**
 * Google Material Symbols icon wrapper.
 * Drop-in replacement for the old lucide-react API:
 *   <Icon name="search" size={18} />
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = 20,
  filled = false,
  weight = 400,
  grade = 0,
  className = '',
  style,
  ...rest
}) => {
  return (
    <span
      className={`material-symbols-outlined inline-block select-none leading-none ${className}`}
      aria-hidden="true"
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' 24`,
        ...style,
      }}
      {...rest}
    >
      {name}
    </span>
  );
};

export default Icon;