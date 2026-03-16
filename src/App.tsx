import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Search, 
  ChevronRight, 
  Filter,
  Activity,
  Music,
  Cpu,
  Palette,
  Trophy,
  Users,
  X,
  Navigation,
  LogOut,
  Mail,
  Lock,
  User,
  Bell,
  Settings,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_EVENTS, LOCATIONS } from './constants';
import { EventProgram } from './types';

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'music': return <Music size={16} />;
    case 'tech': return <Cpu size={16} />;
    case 'art': return <Palette size={16} />;
    case 'sports': return <Trophy size={16} />;
    case 'community': return <Users size={16} />;
    default: return <Activity size={16} />;
  }
};

type View = 'feed' | 'schedule' | 'map' | 'profile' | 'login';

export default function App() {
  const [activeView, setActiveView] = useState<View>('feed');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({ name: 'Guest User', email: '' });
  
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'live' | 'upcoming'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventProgram | null>(null);
  const [savedEvents, setSavedEvents] = useState<string[]>([]);

  // Mock Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('eventpulse_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginEmail && loginPassword) {
      const newUser = { name: loginEmail.split('@')[0], email: loginEmail };
      setUser(newUser);
      setIsLoggedIn(true);
      localStorage.setItem('eventpulse_user', JSON.stringify(newUser));
      setActiveView('feed');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('eventpulse_user');
    setActiveView('login');
  };

  const toggleSaveEvent = (id: string) => {
    setSavedEvents(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(event => {
      const matchesTab = activeTab === 'all' || event.status === activeTab;
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.location.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  const scheduledEvents = useMemo(() => {
    return MOCK_EVENTS.filter(event => savedEvents.includes(event.id));
  }, [savedEvents]);

  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter(loc => 
      loc.toLowerCase().includes(locationSearchQuery.toLowerCase())
    );
  }, [locationSearchQuery]);

  // View Components
  const FeedView = () => (
    <main className="flex-1 px-6 py-6 space-y-6 overflow-y-auto no-scrollbar pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">
          {activeTab === 'live' ? 'Ongoing Programs' : 'Discover Events'}
        </h2>
        <button className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-colors">
          <Filter size={20} />
        </button>
      </div>

      <div className="space-y-4">
        {filteredEvents.map((event) => (
          <motion.div
            layoutId={`event-${event.id}`}
            key={event.id}
            onClick={() => setSelectedEvent(event)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="relative h-48">
              <img 
                src={event.imageUrl} 
                alt={event.title} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <CategoryIcon category={event.category} />
                  {event.category}
                </span>
                {event.status === 'live' && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm animate-pulse">
                    Live
                  </span>
                )}
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSaveEvent(event.id);
                }}
                className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all ${
                  savedEvents.includes(event.id) ? 'bg-indigo-600 text-white' : 'bg-white/50 text-slate-800'
                }`}
              >
                <Heart size={18} fill={savedEvents.includes(event.id) ? "currentColor" : "none"} />
              </button>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-800 mb-2">{event.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Clock size={14} className="text-indigo-500" />
                  <span>{event.startTime} - {event.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <MapPin size={14} className="text-indigo-500" />
                  <span className="truncate">{event.location.name} • {selectedLocation}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </main>
  );

  const ScheduleView = () => (
    <main className="flex-1 px-6 py-6 space-y-6 overflow-y-auto no-scrollbar pb-24">
      <h2 className="text-2xl font-bold text-slate-800">My Schedule</h2>
      {scheduledEvents.length > 0 ? (
        <div className="space-y-4">
          {scheduledEvents.map(event => (
            <div key={event.id} className="bg-white p-4 rounded-3xl border border-slate-100 flex gap-4 items-center shadow-sm">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={event.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-800 truncate">{event.title}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar size={12} /> {event.date} • {event.startTime}
                </p>
              </div>
              <button 
                onClick={() => toggleSaveEvent(event.id)}
                className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500">Your schedule is empty.</p>
          <button 
            onClick={() => setActiveView('feed')}
            className="mt-4 text-indigo-600 font-bold"
          >
            Explore Events
          </button>
        </div>
      )}
    </main>
  );

  const MapView = () => (
    <main className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-200 flex items-center justify-center">
        {/* Placeholder for Map */}
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <MapPin size={40} className="text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Interactive Map</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Viewing events in {selectedLocation}. Zoom in to see specific venues and live programs.
          </p>
        </div>
        
        {/* Mock Map Markers */}
        {MOCK_EVENTS.slice(0, 3).map((event, i) => (
          <div 
            key={event.id}
            className="absolute"
            style={{ 
              top: `${30 + i * 15}%`, 
              left: `${20 + i * 25}%` 
            }}
          >
            <div className="relative group">
              <div className="bg-indigo-600 text-white p-2 rounded-full shadow-lg cursor-pointer transform group-hover:scale-110 transition-transform">
                <CategoryIcon category={event.category} />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white px-3 py-1 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <p className="text-xs font-bold">{event.title}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Map Overlay Controls */}
      <div className="absolute top-6 left-6 right-6 flex gap-2">
        <div className="flex-1 bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg flex items-center gap-2">
          <Search size={18} className="text-slate-400" />
          <input type="text" placeholder="Search map..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
        </div>
        <button className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-lg text-indigo-600">
          <Navigation size={20} />
        </button>
      </div>
    </main>
  );

  const ProfileView = () => (
    <main className="flex-1 px-6 py-6 space-y-8 overflow-y-auto no-scrollbar pb-24">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-slate-200 border-4 border-white shadow-xl overflow-hidden">
            <img src={`https://picsum.photos/seed/${user.name}/200`} alt="" className="w-full h-full object-cover" />
          </div>
          <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-lg border-2 border-white">
            <Settings size={16} />
          </button>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-500 text-sm">{user.email || 'Member since 2026'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-3xl text-center shadow-sm border border-slate-50">
          <p className="text-xl font-bold text-indigo-600">{savedEvents.length}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Events</p>
        </div>
        <div className="bg-white p-4 rounded-3xl text-center shadow-sm border border-slate-50">
          <p className="text-xl font-bold text-indigo-600">12</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Following</p>
        </div>
        <div className="bg-white p-4 rounded-3xl text-center shadow-sm border border-slate-50">
          <p className="text-xl font-bold text-indigo-600">450</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Points</p>
        </div>
      </div>

      <div className="space-y-2">
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600"><User size={20} /></div>
            <span className="font-semibold text-slate-700">Edit Profile</span>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-slate-50 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600"><Bell size={20} /></div>
            <span className="font-semibold text-slate-700">Notifications</span>
          </div>
          <ChevronRight size={18} className="text-slate-300" />
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors mt-8"
        >
          <div className="flex items-center gap-3 text-red-600">
            <LogOut size={20} />
            <span className="font-bold">Log Out</span>
          </div>
        </button>
      </div>
    </main>
  );

  const LoginView = () => (
    <main className="flex-1 px-8 py-12 flex flex-col justify-center space-y-8">
      <div className="text-center space-y-2">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-200 mb-6">
          <Activity size={40} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800">Welcome Back</h2>
        <p className="text-slate-500">Sign in to discover live events near you</p>
      </div>

      <div className="space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="bg-slate-100 rounded-[32px] overflow-hidden border border-slate-200 shadow-inner">
            <div className="relative border-b border-slate-200">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                autoComplete="email"
                placeholder="Email Address" 
                className="w-full bg-transparent border-none py-5 pl-14 pr-6 focus:ring-0 text-slate-800 placeholder:text-slate-400"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="password" 
                required
                autoComplete="current-password"
                placeholder="Password" 
                className="w-full bg-transparent border-none py-5 pl-14 pr-6 focus:ring-0 text-slate-800 placeholder:text-slate-400"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-5 rounded-[32px] font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all transform active:scale-95"
          >
            Sign In
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 px-4 text-slate-400 font-bold tracking-widest">Or Quick Access</span>
          </div>
        </div>

        <button 
          onClick={() => {
            setLoginEmail('demo@eventpulse.com');
            setLoginPassword('password123');
            // Small delay to show the fields filling up
            setTimeout(() => {
              const newUser = { name: 'Demo User', email: 'demo@eventpulse.com' };
              setUser(newUser);
              setIsLoggedIn(true);
              localStorage.setItem('eventpulse_user', JSON.stringify(newUser));
              setActiveView('feed');
            }, 500);
          }}
          className="w-full bg-white border-2 border-slate-100 text-slate-600 py-4 rounded-[32px] font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
        >
          <User size={18} />
          Continue as Guest
        </button>
      </div>

      <div className="text-center">
        <p className="text-slate-500 text-sm">
          Don't have an account? <button className="text-indigo-600 font-bold">Sign Up</button>
        </p>
      </div>
    </main>
  );

  if (!isLoggedIn && activeView !== 'login') {
    setActiveView('login');
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {/* Header - Only show if logged in and not in map view */}
      {isLoggedIn && activeView !== 'map' && activeView !== 'login' && (
        <header className="bg-white px-6 pt-8 pb-4 sticky top-0 z-30 border-b border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <div 
              className="flex items-center gap-2 cursor-pointer group"
              onClick={() => setIsLocationModalOpen(true)}
            >
              <div className="bg-indigo-50 p-2 rounded-full text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                <MapPin size={20} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Current Location</p>
                <p className="font-semibold text-slate-800 flex items-center gap-1">
                  {selectedLocation}
                  <ChevronRight size={14} className="text-slate-400" />
                </p>
              </div>
            </div>
            <button 
              onClick={() => setActiveView('profile')}
              className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm"
            >
              <img 
                src={`https://picsum.photos/seed/${user.name}/100`} 
                alt="User" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          </div>

          {activeView === 'feed' && (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search events, venues..." 
                  className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {(['all', 'live', 'upcoming'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-full text-xs font-bold capitalize transition-all whitespace-nowrap ${
                      activeTab === tab 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {tab === 'live' && <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse" />}
                    {tab}
                  </button>
                ))}
              </div>
            </>
          )}
        </header>
      )}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {activeView === 'feed' && <FeedView />}
          {activeView === 'schedule' && <ScheduleView />}
          {activeView === 'map' && <MapView />}
          {activeView === 'profile' && <ProfileView />}
          {activeView === 'login' && <LoginView />}
        </motion.div>
      </AnimatePresence>

      {/* Bottom Nav */}
      {isLoggedIn && activeView !== 'login' && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-lg border-t border-slate-100 px-8 py-4 flex justify-between items-center z-40">
          <button 
            onClick={() => setActiveView('feed')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'feed' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Activity size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Feed</span>
          </button>
          <button 
            onClick={() => setActiveView('schedule')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'schedule' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Calendar size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Schedule</span>
          </button>
          <div className="bg-indigo-600 text-white p-4 rounded-full -mt-12 shadow-lg shadow-indigo-200 border-4 border-slate-50 cursor-pointer transform active:scale-90 transition-transform">
            <Navigation size={24} />
          </div>
          <button 
            onClick={() => setActiveView('map')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'map' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <MapPin size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Map</span>
          </button>
          <button 
            onClick={() => setActiveView('profile')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeView === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`}
          >
            <Users size={24} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Profile</span>
          </button>
        </nav>
      )}

      {/* Location Selection Modal */}
      <AnimatePresence>
        {isLocationModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end justify-center"
            onClick={() => {
              setIsLocationModalOpen(false);
              setLocationSearchQuery('');
            }}
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-white w-full max-w-md rounded-t-[40px] p-8 space-y-6 max-h-[80vh] flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-800">Select Location</h3>
                <button 
                  onClick={() => {
                    setIsLocationModalOpen(false);
                    setLocationSearchQuery('');
                  }}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search city or area..." 
                  className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                {locationSearchQuery && !filteredLocations.some(l => l.toLowerCase() === locationSearchQuery.toLowerCase()) && (
                  <button
                    onClick={() => {
                      setSelectedLocation(locationSearchQuery);
                      setIsLocationModalOpen(false);
                      setLocationSearchQuery('');
                    }}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Navigation size={18} />
                      <span className="font-semibold">Select "{locationSearchQuery}"</span>
                    </div>
                  </button>
                )}
                
                {filteredLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationModalOpen(false);
                      setLocationSearchQuery('');
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                      selectedLocation === loc 
                        ? 'bg-indigo-50 text-indigo-600 border-2 border-indigo-100' 
                        : 'bg-slate-50 text-slate-600 border-2 border-transparent hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={18} className={selectedLocation === loc ? 'text-indigo-600' : 'text-slate-400'} />
                      <span className="font-semibold">{loc}</span>
                    </div>
                    {selectedLocation === loc && <div className="w-2 h-2 bg-indigo-600 rounded-full" />}
                  </button>
                ))}
                {filteredLocations.length === 0 && !locationSearchQuery && (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm italic">Type to search for a location...</p>
                  </div>
                )}
              </div>

              <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 mt-auto">
                <Navigation size={18} />
                Use Current Location
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              layoutId={`event-${selectedEvent.id}`}
              className="bg-white w-full max-w-sm rounded-[40px] overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="relative h-64">
                <img 
                  src={selectedEvent.imageUrl} 
                  alt={selectedEvent.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-6 right-6 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/40 transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <div className="flex gap-2 mb-2">
                    <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {selectedEvent.category}
                    </span>
                    {selectedEvent.status === 'live' && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">
                        Live Now
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-white leading-tight">{selectedEvent.title}</h2>
                </div>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-3xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                    <p className="font-bold text-slate-800">{selectedEvent.date}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-3xl">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Time</p>
                    <p className="font-bold text-slate-800">{selectedEvent.startTime}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{selectedEvent.location.name} • {selectedLocation}</p>
                      <p className="text-sm text-slate-500">{selectedEvent.location.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
                      <Users size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Organizer</p>
                      <p className="text-sm text-slate-500">{selectedEvent.organizer}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">About Event</p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {selectedEvent.description}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => toggleSaveEvent(selectedEvent.id)}
                    className={`flex-1 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 ${
                      savedEvents.includes(selectedEvent.id) 
                        ? 'bg-slate-100 text-slate-600' 
                        : 'bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    <Heart size={18} fill={savedEvents.includes(selectedEvent.id) ? "currentColor" : "none"} />
                    {savedEvents.includes(selectedEvent.id) ? 'Saved' : 'Save Event'}
                  </button>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedEvent.location.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  >
                    Directions
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
