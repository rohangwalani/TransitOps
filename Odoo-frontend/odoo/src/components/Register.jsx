import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import KPICard from './common/KPICard';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      
      if (response.ok) {
        alert('Registration successful! Redirecting to login.');
        navigate('/');
      } else {
        const errText = await response.text();
        setError(errText || 'Failed to register account.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to connect to registration server.');
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
            Optimizing global movement in <span class="text-secondary-fixed">real-time.</span>
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

      {/* Right Section: Registration Form */}
      <section className="flex-1 flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-surface">
        <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-unit-lg md:p-unit-xl">
          <div className="mb-unit-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Request Access</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Create your enterprise personnel account to request platform credentials.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-unit-lg">
            {/* Error Message Box */}
            {error && (
              <div className="p-3.5 bg-error-container text-on-error-container border border-error/20 rounded-lg text-body-md flex items-center space-x-2 animate-fadeIn">
                <span className="material-symbols-outlined text-[20px] font-semibold text-error">error</span>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Input Fields */}
            <div className="space-y-unit-md">
              {/* Full Name */}
              <div className="group">
                <label className="block font-label-sm text-label-sm text-outline mb-unit-xs transition-colors group-focus-within:text-primary" htmlFor="name">
                  Full Name
                </label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full h-12 px-unit-md bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-body-lg placeholder:text-outline-variant"
                />
              </div>

              {/* Email Address */}
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

              {/* Password */}
              <div className="group">
                <label className="block font-label-sm text-label-sm text-outline mb-unit-xs transition-colors group-focus-within:text-primary" htmlFor="password">
                  Password
                </label>
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

            {/* Primary Action */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-primary text-white font-semibold rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all flex items-center justify-center space-x-unit-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{loading ? 'Submitting Request...' : 'Request Enterprise Access'}</span>
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
              <span>Sign up with Okta / Google Workspace</span>
            </button>
          </form>

          <div className="mt-unit-lg text-center">
            <p className="font-body-md text-on-surface-variant">
              Already have an account? <Link to="/" className="text-primary font-semibold hover:underline">Sign in instead</Link>
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

export default Register;
