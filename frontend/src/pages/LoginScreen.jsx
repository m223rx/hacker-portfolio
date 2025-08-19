import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const [isBreached, setIsBreached] = useState(false);
  const [isHacking, setIsHacking] = useState(false);
  const terminalRef = useRef(null);
  const audioRef = useRef(null);
  const [ip, setIp] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [message]);

  const handleLogin = (e) => {
    e.preventDefault();
    const maxAttempts = 3;

    playSound("keypress");

    if (username === "admin" && password === "12345") {
      playSound("success");
      const loginMessage = [
        "ACCESS GRANTED",
        "Welcome to the secure portal.",
        `Your IP: ${ip || "unknown"}`,
        "Redirecting to the dashboard...",
      ];
      let currentIndex = 0;
      const loginInterval = setInterval(() => {
        if (currentIndex < loginMessage.length) {
          setMessage((prev) => prev + loginMessage[currentIndex] + "\n");
          currentIndex++;
        } else {
          clearInterval(loginInterval);
        }
      }, 500);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else if (attempts + 1 >= maxAttempts) {
      setIsHacking(true);
      playSound("breach");

      const breachMessages = [
        "ACCESS DENIED",
        "OVERRIDE ATTEMPT DETECTED",
        "BREACHING SECURITY PROTOCOLS...",
        "DECRYPTING USER CREDENTIALS...",
        "CREDENTIALS EXTRACTED:",
        "USERNAME: admin",
        "PASSWORD: *********",
        "FULL PASSWORD: 12345",
        "WARNING: SYSTEM BREACHED!",
      ];

      let currentIndex = 0;
      const breachInterval = setInterval(() => {
        if (currentIndex < breachMessages.length) {
          setMessage((prev) => prev + breachMessages[currentIndex] + "\n");
          currentIndex++;
        } else {
          clearInterval(breachInterval);
          setIsBreached(true);
          setIsHacking(false);
        }
      }, 500);
    } else {
      setMessage("ACCESS DENIED. TRY AGAIN...\n");
      setAttempts(attempts + 1);
      playSound("error");
    }
  };

  const playSound = (type) => {
    console.log(`Playing ${type} sound`);

    if (type === "keypress") {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, context.currentTime);
      oscillator.connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.1);
    }
  };

  const handleInputFocus = () => {
    playSound("focus");
  };

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error("Error fetching IP:", error);
      }
    };

    fetchIp();
  }, []);

  return (
    <div className='bg-black text-green-400 font-mono h-screen flex flex-col justify-center items-center p-4 overflow-hidden relative'>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CiAgPHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPgogIDxwYXRoIGQ9Ik0zMCAzMG0tMjggMGEyOCwyOCAwIDEsMSA1NiwwYTI4LDI4IDAgMSwxIC01NiwwIiBzdHJva2U9IiMwMGZmMDAiIHN0cm9rZS13aWR0aD0iMC4yIiBmaWxsPSJub25lIi8+Cjwvc3ZnPg==')] opacity-20"></div>

      <div className='absolute inset-0 overflow-hidden opacity-10'>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className='text-green-500 absolute animate-drop'
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`,
            }}
          >
            {Math.random().toString(36).substring(2, 15)}
          </div>
        ))}
      </div>

      <div className='absolute inset-0 bg-gradient-to-t from-transparent via-green-500 to-transparent opacity-5 animate-scan h-4'></div>
      <div className='relative z-10 w-full max-w-2xl border-2 border-green-500 rounded-lg bg-black bg-opacity-90 shadow-2xl overflow-hidden'>
        <div className='flex justify-between items-center px-4 py-2 bg-green-900 bg-opacity-50 border-b border-green-600'>
          <div className='flex items-center space-x-2'>
            <div className='app-controller__header__button'></div>
            <div className='app-controller__header__button'></div>
            <div className='app-controller__header__button'></div>
          </div>
          <div className='text-sm text-green-400'>
            SECURE LOGIN PORTAL v2.4.1
          </div>
          <div className='text-xs text-green-600'>
            TERMINAL #AX-{Math.floor(Math.random() * 100)}
          </div>
        </div>

        <div className='p-4'>
          <div className='mb-6 text-green-500'>
            <div className='flex'>
              <span className='text-green-600'>m223rx@secure-server:~$</span>
              <span className='ml-2'>login --access-level 5</span>
            </div>
            <div className='mt-2 text-sm'>
              <div>
                WARNING: Unauthorized access attempt will be logged and reported
              </div>
              <div>
                Last login: {new Date().toLocaleString()} from {ip || "unknown"}
              </div>
            </div>
          </div>

          <form onSubmit={handleLogin} className='mb-4'>
            <div className='flex items-center mb-4'>
              <input
                placeholder='username'
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onFocus={handleInputFocus}
                className='flex-1 bg-black border-b border-green-600 px-2 py-1 focus:outline-none focus:border-green-400'
                autoFocus
              />
            </div>
            <div className='flex items-center mb-6'>
              <input
                placeholder='********'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={handleInputFocus}
                className='flex-1 bg-black border-b border-green-600 px-2 py-1 focus:outline-none focus:border-green-400'
              />
            </div>
            <button
              type='submit'
              className='w-full py-2 bg-green-900 bg-opacity-50 border border-green-600 text-green-400 hover:bg-green-800 hover:text-white transition-all duration-300 cursor-pointer'
              disabled={isHacking}
            >
              {isHacking ? "BREACHING SECURITY..." : "AUTHENTICATE"}
            </button>
          </form>

          <div
            ref={terminalRef}
            className='h-48 overflow-y-auto bg-black bg-opacity-70 p-3 border border-green-800 text-sm whitespace-pre-wrap leading-relaxed'
          >
            {message || "STATUS: AWAITING CREDENTIALS\n"}
            {isBreached && (
              <div className='mt-2 text-red-400 animate-pulse'>
                WARNING: SYSTEM BREACH DETECTED!
              </div>
            )}
          </div>

          <div className='mt-3 text-xs text-green-700'>
            SECURITY LEVEL: {attempts >= 3 ? "COMPROMISED" : "ACTIVE"}
            {attempts > 0 && <span> | ATTEMPTS: {attempts}/3</span>}
          </div>
        </div>

        <div className='px-4 py-2 bg-green-900 bg-opacity-50 border-t border-green-600 text-xs text-green-600 flex justify-between'>
          <span>SSH-2.0-OpenSSH_8.4p1</span>
          <span>ENCRYPTION: AES-256-GCM</span>
          <span>CONNECTION: SECURE</span>
        </div>
      </div>

      {isHacking && (
        <div className='absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20'>
          <div className='text-center'>
            <div
              className='text-red-500 text-2xl mb-4 glitch'
              data-text='SECURITY BREACH IN PROGRESS'
            >
              SECURITY BREACH IN PROGRESS
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
