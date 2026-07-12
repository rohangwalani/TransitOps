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
  variant = 'white' 
}) => {
  const isGlass = variant === 'glass';

  // Base card wrapper styles
  const cardClasses = isGlass
    ? 'glass-effect p-unit-md rounded-xl text-white'
    : 'bg-surface-container-lowest p-unit-md rounded-xl border border-outline-variant soft-shadow text-on-surface';

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
    <div className={`${cardClasses} transition-all duration-300 hover:shadow-md flex flex-col justify-between h-full`}>
      <div>
        {/* Card Header (Icon & Trend indicator) */}
        <div className="flex justify-between items-start mb-4">
          {icon && (
            <div className={`p-2 rounded-lg flex items-center justify-center ${isGlass ? 'bg-white/10 text-white' : iconBgClass}`}>
              <span className="material-symbols-outlined select-none" style={{ fontVariationSettings: "'FILL' 0" }}>
                {icon}
              </span>
            </div>
          )}
          {trendText && !isGlass && (
            <span className={trendClasses}>
              {trendText}
            </span>
          )}
        </div>

        {/* Title */}
        <p className={`font-label-sm text-label-sm uppercase tracking-wider ${isGlass ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
          {title}
        </p>

        {/* Value */}
        <h3 className={`font-display-lg text-[32px] font-bold mt-1 ${isGlass ? 'text-white' : valueColor}`}>
          {value}
        </h3>
      </div>

      {/* Progress Bar (If provided) */}
      {progressBar !== undefined && (
        <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-4">
          <div 
            className="bg-secondary h-1.5 rounded-full transition-all duration-500" 
            style={{ width: `${progressBar}%` }}
          ></div>
        </div>
      )}

      {/* Subtext Footer */}
      {subtext && (
        <p className={`font-body-md text-body-md mt-2 ${isGlass ? 'text-primary-fixed/80' : 'text-on-surface-variant'}`}>
          {subtext}
        </p>
      )}
    </div>
  );
};

export default KPICard;
