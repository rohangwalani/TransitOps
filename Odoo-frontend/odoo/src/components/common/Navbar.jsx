import React, { useState, useEffect, useRef } from 'react';

const DUMMY_NOTIFICATIONS = [
  { id: 1, type: 'error', icon: 'local_gas_station', title: 'Fuel Alert: TRK-902', desc: 'Sudden fuel drop detected near Pune depot.', time: '2m ago', unread: true },
  { id: 2, type: 'warning', icon: 'build', title: 'Maintenance Overdue', desc: 'VAN-44 is 3 days past its scheduled 50k service.', time: '14m ago', unread: true },
  { id: 3, type: 'success', icon: 'check_circle', title: 'Trip Completed', desc: 'TRK-2901 completed Delhi–Agra route successfully.', time: '38m ago', unread: true },
  { id: 4, type: 'info', icon: 'person_add', title: 'New Driver Onboarded', desc: 'Rajesh Kumar has been assigned to Route 12-B.', time: '1h ago', unread: false },
  { id: 5, type: 'warning', icon: 'speed', title: 'Speed Limit Exceeded', desc: 'TRK-5501 exceeded 90 km/h on NH-48 corridor.', time: '2h ago', unread: false },
  { id: 6, type: 'success', icon: 'trending_up', title: 'Efficiency Milestone', desc: 'Fleet saved ₹1.2L in fuel costs this week via AI routing.', time: '3h ago', unread: false },
];

const typeStyles = {
  error: { dot: 'bg-error', text: 'text-error', bg: 'bg-error/10' },
  warning: { dot: 'bg-tertiary', text: 'text-tertiary', bg: 'bg-tertiary/10' },
  success: { dot: 'bg-secondary', text: 'text-secondary', bg: 'bg-secondary/10' },
  info: { dot: 'bg-primary', text: 'text-primary', bg: 'bg-primary/10' },
};

const Navbar = ({ user, onLogout, toggleSidebar, searchQuery = '', onSearchChange }) => {
  const formatRole = (role) => {
    if (!role) return 'Fleet Manager';
    return role.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const displayName = user?.name || 'User';
  const rawRole = user?.selectedRole || user?.role || (user?.roles?.[0] ?? 'fleet_manager');
  const displayRole = formatRole(rawRole?.replace('ROLE_', '').toLowerCase());

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuCDNH81NEYgB9TZOK_MydQrV7XbwtbPD-nsRql4IelRXdvd8cJyrfjoc3uFRPu1dbMfhtid5uWKADnVHcI8YbdddAMpLbrtH-nKb-bOB-w1wyxQsXnRO5f2rZ9w-SSDLW4kvGrJ9W5RC51cg0HT5fawRVCGmYBlEuwA8WdLKCgdNJZjG9V2LnY3sp7DtpqRYO8z8r0UvNRUSJj7hRbEvYJM2FjHb7KQEK-R_-5MoNsRoHSq0muKpQkoLg";

  return (
    <header className="h-16 bg-surface border-b border-outline-variant shadow-sm flex justify-between items-center px-margin-desktop z-40 w-full shrink-0">
      {/* Search Input & Hamburger */}
      <div className="flex items-center gap-4 w-1/3">
        <button
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-on-surface hover:bg-surface-container md:hidden focus:outline-none flex items-center justify-center"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="relative w-full max-w-md hidden md:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search fleet, drivers, or trips..."
            className="w-full bg-surface-container-lowest border-outline-variant border rounded-lg py-2 pl-10 pr-4 text-body-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Global Actions Panel */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-outline-variant pr-6">

          {/* Notifications Button */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markRead; }}
              className="relative p-1.5 text-on-surface-variant hover:bg-surface-container-lowest rounded-full transition-colors flex items-center justify-center"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: notifOpen ? "'FILL' 1" : "'FILL' 0" }}>notifications</span>
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {notifOpen && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-outline-variant rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant bg-surface-container-lowest">
                  <div>
                    <p className="font-bold text-on-surface text-sm">Notifications</p>
                    {unreadCount > 0 && <p className="text-[10px] text-on-surface-variant">{unreadCount} unread</p>}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[10px] text-primary font-bold hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notification List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/30">
                  {notifications.map((n) => {
                    const s = typeStyles[n.type];
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`flex gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-surface-container-lowest ${n.unread ? 'bg-primary/5' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                          <span className={`material-symbols-outlined text-sm ${s.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>{n.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <p className={`text-sm leading-tight ${n.unread ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>{n.title}</p>
                            <span className="text-[9px] text-outline shrink-0 mt-0.5">{n.time}</span>
                          </div>
                          <p className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{n.desc}</p>
                        </div>
                        {n.unread && <div className={`w-2 h-2 rounded-full ${s.dot} shrink-0 mt-2`} />}
                      </div>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-outline-variant bg-surface-container-lowest text-center">
                  <button className="text-xs text-primary font-bold hover:underline cursor-pointer">View all notifications</button>
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button className="p-1 text-on-surface-variant hover:bg-surface-container-lowest rounded-full transition-colors flex items-center justify-center">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
        </div>

        {/* User profile block */}
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <img
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full border-2 border-primary-fixed object-cover cursor-pointer hover:opacity-85 active:scale-95 transition-all"
              src={defaultAvatar}
              alt={displayName}
              title="Profile Actions"
            />
            {dropdownOpen && onLogout && (
              <button
                onClick={() => { setDropdownOpen(false); onLogout(); }}
                className="absolute right-0 top-12 bg-surface-container-lowest border border-outline-variant rounded-lg py-2.5 px-4 shadow-lg hover:bg-error-container hover:text-on-error-container text-body-md text-error font-semibold transition-all whitespace-nowrap z-50 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
