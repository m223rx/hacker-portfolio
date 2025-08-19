import { useState, useEffect, useRef, useCallback } from "react";

const fakeUpdateActions = [
  { text: "Checking for system updates..." },
  { text: "Connecting to mirror server..." },
  { text: "Fetching package list..." },
  { text: "Resolving dependencies..." },
  { text: "Kernel patched: kernel-5.19.12" },
  { text: "Security update applied: glibc-2.36.1" },
  { text: "Updating openssh-server to 9.2p1", progress: true },
  { text: "Applying CVE-2025-12234 fix" },
  { text: "Updating Python 3.12.4", progress: true },
  { text: "Node.js modules cache rebuilt", progress: true },
  { text: "Docker engine updated to 24.0.5", progress: true },
  { text: "Firewall rules reloaded (ufw)" },
  { text: "Cleaning old kernels..." },
  { text: "Optimizing system libraries..." },
  { text: "Refreshing network modules..." },
  { text: "GPU driver update applied (NVIDIA 537.50)" },
  { text: "Installing security patches..." },
  { text: "Verifying package signatures..." },
  { text: "Configuring system services..." },
  { text: "Rebuilding initramfs..." },
  { text: "Updating GRUB bootloader..." },
  { text: "Checking disk integrity..." },
  { text: "Optimizing swap memory..." },
  { text: "Reloading kernel modules..." },
  { text: "Performing security audit..." },
  { text: "Compressing system logs..." },
  { text: "Starting backup process..." },
  { text: "Backup completed successfully" },
  { text: "Testing network latency..." },
  { text: "CPU microcode updated" },
  { text: "Firmware updated: version 3.14" },
  { text: "Update complete! Reboot recommended." },
  { text: "Logging session to /var/log/fake-update.log" },
  { text: "" },
];

// Custom hook for managing the update simulation
const useUpdateSimulation = (onFinish) => {
  const [displayedLines, setDisplayedLines] = useState([]);
  const [currentAction, setCurrentAction] = useState(0);
  const intervalsRef = useRef([]);

  // Clear all intervals on unmount or completion
  useEffect(() => {
    return () => {
      intervalsRef.current.forEach((interval) => clearInterval(interval));
    };
  }, []);

  const addLine = useCallback((line) => {
    setDisplayedLines((prev) => [...prev, line]);
  }, []);

  const simulateProgress = useCallback((action, actionIndex) => {
    let percent = 0;

    const intervalId = setInterval(() => {
      percent += Math.floor(Math.random() * 5 + 2);
      if (percent >= 100) percent = 100;

      setDisplayedLines((prev) => {
        const newLines = [...prev];
        newLines[actionIndex] = `${action.text} [${percent}%]`;
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
        newLines[actionIndex] = lineText.slice(0, charIndex);
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

  return displayedLines;
};

// Custom hook for auto-scrolling
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
  const displayedLines = useUpdateSimulation(onFinish);
  const contentRef = useAutoScroll([displayedLines]);

  // Allow skipping with Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onFinish();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onFinish]);

  return (
    <div className='flex w-screen h-screen items-center justify-center bg-black p-4'>
      <div className='terminal flex h-[70%] w-full max-w-4xl rounded-xl border-2 border-gray-700 flex-col bg-gray-800 overflow-hidden shadow-2xl'>
        <div className='app-controller flex w-full h-8 justify-between px-3 border-b border-gray-700 py-1 bg-gray-800'>
          <div className='app-controller__header flex items-center gap-2'>
            <div className='app-controller__header__button bg-red-500 w-3 h-3 rounded-full'></div>
            <div className='app-controller__header__button bg-yellow-500 w-3 h-3 rounded-full'></div>
            <div className='app-controller__header__button bg-green-500 w-3 h-3 rounded-full'></div>
          </div>
          <div className='app-controller__terminal_name flex items-center justify-center text-gray-400 text-sm'>
            <span>m223rx@terminal:~$ system-update --simulate</span>
          </div>
          <div className='w-6'></div> {/* Spacer for balance */}
        </div>
        <div
          ref={contentRef}
          className='terminal__content flex flex-col p-4 overflow-y-auto text-green-400 font-mono text-sm leading-relaxed'
          style={{
            background: "linear-gradient(to bottom, #0a0f0d, #0a0a0a)",
            textShadow: "0 0 2px rgba(104, 255, 104, 0.5)",
          }}
        >
          {displayedLines.map((line, index) => (
            <div key={index} className='terminal-line'>
              <span className='prompt text-blue-400'>m223rx@server:~$ </span>
              {line}
              {index === displayedLines.length - 1 && (
                <span className='cursor'>▋</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
