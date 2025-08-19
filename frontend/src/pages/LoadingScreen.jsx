import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";

const fakeUpdateActions = [
  { text: "Initializing network sniffing tool...", type: "command" },
  { text: "Capturing packets on eth0...", type: "info" },
  { text: "Listening for HTTP traffic...", type: "info" },
  { text: "Found potential target: 192.168.1.42", type: "success" },
  { text: "Probing common web ports: 80, 443, 8080...", type: "command" },
  { text: "Port 80 open — sending GET requests...", type: "info" },
  { text: "Analyzing responses for login forms...", type: "info" },
  { text: "Detected /admin/login page on 192.168.1.42", type: "success" },
  { text: "Checking /login, /user/login, /auth paths...", type: "command" },
  { text: "Login page confirmed at /admin/login", type: "success" },
  { text: "Redirecting...", type: "warning" },
];

const useUpdateSimulation = (onFinish) => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentAction, setCurrentAction] = useState(0);
  const intervalsRef = useRef([]);

  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const simulateProgress = useCallback((action, actionIndex) => {
    let percent = 0;

    const intervalId = setInterval(() => {
      percent += Math.floor(Math.random() * 5 + 2);
      if (percent >= 100) percent = 100;

      setDisplayedLines((prev) => {
        const newLines = [...prev];
        newLines[actionIndex] = {
          text: `${action.text} [${percent}%]`,
          type: action.type,
        };
        return newLines;
      });

      if (percent === 100) {
        clearInterval(intervalId);
        setCurrentAction((prev) => prev + 1);
      }
    }, 100);

    intervalsRef.current.push(intervalId);
  }, []);

  const simulateTyping = useCallback((action, actionIndex) => {
    const lineText = action.text;
    let charIndex = 0;

    const intervalId = setInterval(() => {
      charIndex++;
      setDisplayedLines((prev) => {
        const newLines = [...prev];
        newLines[actionIndex] = {
          text: lineText.slice(0, charIndex),
          type: action.type,
        };
        return newLines;
      });

      if (charIndex === lineText.length) {
        clearInterval(intervalId);
        setCurrentAction((prev) => prev + 1);
      }
    }, 50);

    intervalsRef.current.push(intervalId);
  }, []);

  useEffect(() => {
    if (currentAction >= fakeUpdateActions.length) {
      const timeoutId = setTimeout(onFinish, 1500);
      return () => clearTimeout(timeoutId);
    }

    const action = fakeUpdateActions[currentAction];

    if (action.progress) {
      simulateProgress(action, currentAction);
    } else {
      simulateTyping(action, currentAction);
    }
  }, [currentAction, onFinish, simulateProgress, simulateTyping]);

  const skipAnimation = useCallback(() => {
    intervalsRef.current.forEach((interval) => clearInterval(interval));
    intervalsRef.current = [];

    const allLines = fakeUpdateActions.map((action) => ({
      text: action.progress ? `${action.text} [100%]` : action.text,
      type: action.type,
    }));

    setDisplayedLines(allLines);
    setCurrentAction(fakeUpdateActions.length);
  }, []);

  return { displayedLines, skipAnimation };
};

const useAutoScroll = (dependencies) => {
  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, dependencies);

  return contentRef;
};

export default function LoadingScreen({ onFinish }) {
  const navigate = useNavigate();
  const { displayedLines, skipAnimation } = useUpdateSimulation(onFinish);
  const contentRef = useAutoScroll([displayedLines]);
  const [showSkipButton, setShowSkipButton] = useState(true);
  const [isSkipping, setIsSkipping] = useState(false);

  useEffect(() => {
    if (displayedLines.length === fakeUpdateActions.length) {
      const timeout = setTimeout(() => {
        navigate("/login");
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [displayedLines, navigate]);

  const handleSkip = () => {
    setIsSkipping(true);
    skipAnimation();
    setTimeout(() => {
      setShowSkipButton(false);
    }, 300);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && showSkipButton) {
        handleSkip();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showSkipButton]);

  return (
    <div className='flex w-screen h-screen items-center justify-center p-4 overflow-hidden'>
      <div className='terminal flex h-[85%] w-full max-w-5xl rounded-xl border-2 border-green-700 flex-col bg-grey-800 bg-opacity-90 overflow-hidden shadow-2xl z-10 justify-between'>
        <div className='app-controller flex w-full h-8 justify-between px-3 border-b border-green-700 py-1 bg-gradient-to-r from-green-900 to-black'>
          <div className='app-controller__header flex items-center gap-2'>
            <div className='app-controller__header__button'></div>
            <div className='app-controller__header__button'></div>
            <div className='app-controller__header__button'></div>
          </div>
          <div className='app-controller__terminal_name flex items-center justify-center text-green-400 text-sm font-mono'>
            <span>m223rx@kali:~# network_penetration_tool --activate</span>
          </div>
          <div className='flex items-center'>
            <div className='h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2'></div>
            <span className='text-xs text-green-400'>LIVE</span>
          </div>
        </div>

        <div
          ref={contentRef}
          className='terminal__content flex flex-col p-4 overflow-y-auto font-mono text-sm leading-relaxed bg-black bg-opacity-80 h-full'
        >
          {displayedLines.map((line, index) => (
            <div
              key={index}
              className={`terminal-line flex ${
                index === displayedLines.length - 1 ? "animate-pulse" : ""
              }`}
            >
              <span className='prompt text-green-600 shrink-0'>
                m223rx@kali:~#{" "}
              </span>
              <span
                className={`${
                  line.type === "success"
                    ? "text-green-400"
                    : line.type === "warning"
                    ? "text-yellow-400"
                    : line.type === "command"
                    ? "text-blue-400"
                    : line.type === "empty"
                    ? "opacity-0"
                    : "text-green-200"
                }`}
              >
                {line.text}
              </span>
              {index === displayedLines.length - 1 && line.type !== "empty" && (
                <span className='cursor bg-green-400 ml-1 w-2 h-4 inline-block animate-blink'></span>
              )}
            </div>
          ))}
        </div>

        <div className='terminal__status flex justify-between items-center px-4 py-2 border-t border-green-700 bg-gradient-to-r from-green-900 to-black text-xs text-green-400'>
          <div className='flex items-center'>
            <div className='h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse'></div>
            <span>CONNECTED</span>
          </div>
          <div>
            <span>
              {displayedLines.length} / {fakeUpdateActions.length} commands
              executed
            </span>
          </div>
          <div>
            <span>SSH: active</span>
          </div>
        </div>
      </div>

      {showSkipButton && (
        <button
          onClick={handleSkip}
          className={`absolute bottom-8 right-8 px-4 py-2 bg-green-800 bg-opacity-70 text-green-200 rounded border border-green-600 font-mono text-sm z-20 transition-all duration-300 hover:bg-green-700 hover:text-white ${
            isSkipping ? "opacity-0 transform scale-90" : "opacity-100"
          }`}
        >
          SKIP [ESC]
        </button>
      )}

      <div className='absolute inset-0 pointer-events-none'>
        <div className='absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-green-400 to-transparent opacity-5'></div>
        <div className='absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-green-400 to-transparent opacity-5'></div>
      </div>
    </div>
  );
}
