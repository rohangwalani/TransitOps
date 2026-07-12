import React from 'react';

const KPICard = ({ 
  title, 
  value, 
  icon, 
  iconBgClass = 'bg-primary-fixed text-primary', 
  trendText, 
  trendType = 'success', 
  subtext, 
  progressBar, 
  valueColor = 'text-on-surface',
  variant = 'white',
  underlayIcon
}) => {
  const isGlass = variant === 'glass';
  const isPrimary = variant === 'primary';

  // Base card wrapper styles
  let cardClasses = '';
  if (isGlass) {
    cardClasses = 'glass-effect p-unit-md rounded-xl text-white relative overflow-hidden';
  } else if (isPrimary) {
    cardClasses = 'bg-primary text-on-primary rounded-xl shadow-lg relative overflow-hidden p-unit-lg';
  } else {
    cardClasses = 'bg-surface-container-lowest p-unit-md rounded-xl border border-outline-variant soft-shadow text-on-surface relative overflow-hidden';
  }

  // Trend tag color mapping
  let trendClasses = 'px-2 py-0.5 rounded-full font-label-md text-label-md ';
  if (trendType === 'success') {
    trendClasses += 'text-secondary bg-secondary-container';
  } else if (trendType === 'error') {
    trendClasses += 'text-error bg-error-container';
  } else {
    trendClasses += 'text-outline bg-surface-container';
  }

  return (
    <div className={`${cardClasses} transition-all duration-300 hover:shadow-md flex flex-col justify-between h-full group`}>
      <div className="relative z-10">
        {/* Card Header (Icon & Trend indicator) */}
        <div className="flex justify-between items-start mb-4">
          {icon && !isPrimary && (
            <div className={`p-2 rounded-lg flex items-center justify-center ${isGlass ? 'bg-white/10 text-white' : iconBgClass}`}>
              <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 0" }}>
                {icon}
              </span>
            </div>
          )}
          {/* If primary variant, we might display progress trend differently or none */}
          {icon && isPrimary && (
            <div className="p-2 rounded-lg bg-white/10 text-white flex items-center justify-center">
              <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 0" }}>
                {icon}
              </span>
            </div>
          )}
          {trendText && !isGlass && !isPrimary && (
            <span className={trendClasses}>
              {trendText}
            </span>
          )}
          {trendText && isPrimary && (
            <span className="text-label-sm font-label-md bg-white/20 text-white px-2 py-1 rounded">
              {trendText}
            </span>
          )}
        </div>

        {/* Title */}
        <p className={`font-label-sm text-label-sm uppercase tracking-wider ${
          isGlass ? 'text-primary-fixed' : isPrimary ? 'text-on-primary-container opacity-85 font-medium' : 'text-on-surface-variant'
        }`}>
          {title}
        </p>

        {/* Value */}
        <h3 className={`font-display-lg text-[32px] font-bold mt-1 ${
          isGlass || isPrimary ? 'text-white' : valueColor
        }`}>
          {value}
        </h3>
      </div>

      {/* Progress Bar (If provided) */}
      {progressBar !== undefined && (
        <div className={`w-full h-1.5 rounded-full mt-4 relative z-10 ${isPrimary ? 'bg-white/20 h-2' : 'bg-surface-container-high'}`}>
          <div 
            className={`h-full rounded-full transition-all duration-500 ${isPrimary ? 'bg-white' : 'bg-secondary'}`} 
            style={{ width: `${progressBar}%` }}
          ></div>
        </div>
      )}

      {/* Subtext Footer */}
      {subtext && (
        <p className={`font-body-md text-body-md mt-2 relative z-10 ${
          isGlass ? 'text-primary-fixed/80' : isPrimary ? 'text-label-sm mt-3 opacity-90' : 'text-on-surface-variant'
        }`}>
          {subtext}
        </p>
      )}

      {/* Underlay Icon */}
      {underlayIcon && (
        <div className="absolute -right-4 -bottom-4 opacity-10 text-white z-0 pointer-events-none select-none">
          <span className="material-symbols-outlined text-[120px]">
            {underlayIcon}
          </span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
