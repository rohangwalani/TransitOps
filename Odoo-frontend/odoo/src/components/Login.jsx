import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KPICard from './common/KPICard';

const Login = () => {
  const [role, setRole] = useState('fleet_manager');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (response.ok) {
        const user = await response.json();
        console.log('Logged in successfully:', user);
        
        // Save user details along with their selected administrative role
        const sessionUser = {
          ...user,
          role: role
        };
        localStorage.setItem('user', JSON.stringify(sessionUser));
        
        if (remember) {
          localStorage.setItem('rememberedEmail', email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        alert(`Authentication successful! Logged in as ${user.name || 'User'} (${role.replace('_', ' ')})`);
        navigate('/dashboard');
      } else {
        const errText = await response.text();
        setError(errText || 'Invalid email or password.');
      }
    } catch (err) {
      console.warn('Backend server offline. Proceeding with local Demo Session for testing...');
      const demoUser = { name: 'Alex Sterling', email: email || 'alex@transitops.io', role: role };
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      if (remember) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }
      
      alert(`Authentication server offline. Started local Demo session as: ${demoUser.name} (${role.replace('_', ' ')})`);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section: Visual & Branding */}
      <section className="relative hidden md:flex md:w-5/12 lg:w-1/2 bg-primary overflow-hidden items-center justify-center p-unit-xl">
        <div className="relative z-10 w-full max-w-lg">
          <div className="mb-unit-lg">
            <span className="font-headline-md text-headline-md font-bold text-white tracking-tight">TransitOps</span>
            <p className="font-title-md text-title-md text-primary-fixed mt-unit-xs opacity-90">Enterprise Logistics Ecosystem</p>
          </div>
          
          <h1 className="font-display-lg text-display-lg text-white mb-unit-lg leading-tight">
            Optimizing global movement in <span className="text-secondary-fixed">real-time.</span>
          </h1>
          
          <div className="grid grid-cols-2 gap-unit-md">
            <KPICard 
              title="NETWORK UPTIME" 
              value="99.98%" 
              variant="glass" 
            />
            <KPICard 
              title="ACTIVE VEHICLES" 
              value="12.4k" 
              variant="glass" 
            />
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-container rounded-full blur-3xl opacity-30"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container rounded-full blur-3xl opacity-10"></div>
        </div>
        
        {/* Footer Attribution (Visual Side) */}
        <div className="absolute bottom-10 left-unit-xl">
          <p className="font-label-md text-label-md text-primary-fixed/50">© 2024 TRANSITOPS SOLUTIONS INC.</p>
        </div>
      </section>

      {/* Right Section: Login Form & Role Selection */}
      <section className="flex-1 flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-surface">
        <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-unit-lg md:p-unit-xl">
          <div className="mb-unit-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Welcome back</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Please select your administrative role and sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-unit-lg">
            {/* Error Message Box */}
            {error && (
              <div className="p-3.5 bg-error-container text-on-error-container border border-error/20 rounded-lg text-body-md flex items-center space-x-2 animate-fadeIn">
                <span className="material-symbols-outlined text-[20px] font-semibold text-error">error</span>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Role Selection Grid */}
            <div>
              <label className="block font-label-sm text-label-sm text-outline uppercase tracking-wider mb-unit-sm">Personnel Role</label>
              <div className="grid grid-cols-2 gap-unit-sm">
                
                {/* Fleet Manager */}
                <label className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="fleet_manager"
                    checked={role === 'fleet_manager'}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden role-radio"
                  />
                  <div className="role-card h-full p-unit-md border border-outline-variant rounded-xl flex items-center space-x-unit-md">
                    <div className="icon-circle w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                    </div>
                    <div>
                      <span className="block font-title-md text-sm font-semibold">Fleet Manager</span>
                    </div>
                  </div>
                </label>

                {/* Dispatcher */}
                <label className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="dispatcher"
                    checked={role === 'dispatcher'}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden role-radio"
                  />
                  <div className="role-card h-full p-unit-md border border-outline-variant rounded-xl flex items-center space-x-unit-md">
                    <div className="icon-circle w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>route</span>
                    </div>
                    <div>
                      <span className="block font-title-md text-sm font-semibold">Dispatcher</span>
                    </div>
                  </div>
                </label>

                {/* Safety Officer */}
                <label className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="safety_officer"
                    checked={role === 'safety_officer'}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden role-radio"
                  />
                  <div className="role-card h-full p-unit-md border border-outline-variant rounded-xl flex items-center space-x-unit-md">
                    <div className="icon-circle w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>shield</span>
                    </div>
                    <div>
                      <span className="block font-title-md text-sm font-semibold">Safety Officer</span>
                    </div>
                  </div>
                </label>

                {/* Financial Analyst */}
                <label className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="role" 
                    value="financial_analyst"
                    checked={role === 'financial_analyst'}
                    onChange={(e) => setRole(e.target.value)}
                    className="hidden role-radio"
                  />
                  <div className="role-card h-full p-unit-md border border-outline-variant rounded-xl flex items-center space-x-unit-md">
                    <div className="icon-circle w-10 h-10 flex items-center justify-center rounded-lg bg-surface-container-high text-primary transition-colors">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                    </div>
                    <div>
                      <span className="block font-title-md text-sm font-semibold">Financial Analyst</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-unit-md">
              <div className="group">
                <label className="block font-label-sm text-label-sm text-outline mb-unit-xs transition-colors group-focus-within:text-primary" htmlFor="email">
                  Email Address
                </label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@transitops.io"
                  required
                  className="w-full h-12 px-unit-md bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-body-lg placeholder:text-outline-variant"
                />
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-unit-xs">
                  <label className="block font-label-sm text-label-sm text-outline transition-colors group-focus-within:text-primary" htmlFor="password">
                    Password
                  </label>
                  <a className="text-label-sm text-primary hover:underline font-semibold" href="#">Forgot Password?</a>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    id="password" 
                    name="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full h-12 px-unit-md bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-body-lg placeholder:text-outline-variant pr-12"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-unit-md top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary" 
              />
              <label className="ml-2 font-body-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Primary Action */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-primary text-white font-semibold rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center space-x-unit-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Authenticating...' : 'Authenticate & Access Dashboard'}</span>
              {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
            </button>

            {/* SSO Fallback */}
            <div className="relative flex items-center py-unit-sm">
              <div className="flex-grow border-t border-outline-variant"></div>
              <span className="flex-shrink mx-4 text-label-sm text-outline-variant uppercase">Enterprise SSO</span>
              <div className="flex-grow border-t border-outline-variant"></div>
            </div>

            <button 
              type="button" 
              className="w-full h-12 bg-surface-container-lowest border border-outline-variant text-on-surface font-semibold rounded-lg hover:bg-surface-container transition-colors flex items-center justify-center space-x-unit-sm"
            >
              <img 
                className="w-5 h-5" 
                alt="Google Logo" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDFWT1f5c8FjO6yO55Tsa_lSut7cMvap3Pp6EKp8OxsniUPIsuN-rQHnOTIFEidHShVExo3mLuc48FuwX4axcEfIpHQkyGBTDzQQ1ZdTGr7L97Cih3R4msM7d9xVe7A_v__dSP1nL29kF6ABFWd3VUlIrT2D8Xn62-M1_FXmfR-0Fa21aJhRDYHsYGxaG-5vFGnN_nNtbk19yYn8c4oympEnNMdBAUKGnsnvgbwnq62p5hujEnG1J7YNA"
              />
              <span>Sign in with Okta / Google Workspace</span>
            </button>
          </form>

          <div className="mt-unit-lg text-center">
            <p className="font-body-md text-on-surface-variant">
              New to TransitOps? <Link to="/register" className="text-primary font-semibold hover:underline">Request enterprise access</Link>
            </p>
          </div>
        </div>

        {/* Mobile Attribution */}
        <div className="absolute bottom-6 md:hidden text-center w-full">
          <p className="font-label-md text-label-md text-outline">© 2024 TRANSITOPS SOLUTIONS INC.</p>
        </div>
      </section>
    </main>
  );
};

export default Login;
