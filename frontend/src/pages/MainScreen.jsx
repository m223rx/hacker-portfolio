import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function MainScreen() {
  const navigate = useNavigate();
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState([
    {
      type: "system",
      text: "Terminal initialized. Type 'help' for available commands.",
    },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const projects = [
    {
      id: 1,
      title: "Hacker Login Demo",
      description:
        "Cyberpunk login portal simulation with security breach animation.",
      tech: ["React", "Tailwind", "JS"],
      github: "#",
      live: "#",
    },
    {
      id: 2,
      title: "Social Media Analyzer",
      description:
        "Dashboard to track social media metrics with real-time visualization.",
      tech: ["React", "Chart.js", "API"],
      github: "#",
      live: "#",
    },
    {
      id: 3,
      title: "Network Scanner",
      description: "Python-based network scanning utility with GUI interface.",
      tech: ["Python", "PyQt", "Scapy"],
      github: "#",
      live: "#",
    },
    {
      id: 4,
      title: "Encrypted Messenger",
      description:
        "End-to-end encrypted chat application with forward secrecy.",
      tech: ["Node.js", "React", "WebSockets"],
      github: "#",
      live: "#",
    },
  ];

  const skills = [
    { name: "React", level: 90 },
    { name: "JavaScript", level: 95 },
    { name: "Python", level: 85 },
    { name: "CSS / Tailwind", level: 80 },
    { name: "Node.js", level: 75 },
    { name: "SQL", level: 70 },
  ];

  const aboutMe = `
Name: m223rx
Title: Full-Stack Web & Mobile Developer | Backend Specialist
Location: Digital Space

Bio:
I specialize in building immersive web and mobile experiences with robust backend systems, focusing on performance and scalability. When I'm not coding, I’m exploring new technologies or contributing to open-source projects.
  `.trim();

  const commandList = `
Available commands:
- about      : Display information about me
- projects   : List my projects
- skills     : Show my technical skills
- clear      : Clear the terminal
- help       : Show this help message
- contact    : Display contact information
- hire me    : Hire me for your next project!
- reboot     : Return to login screen
  `.trim();

  const contactInfo = `
Email: m223rx@northstack.com
GitHub: github.com/m223rx
LinkedIn: linkedin.com/in/m223rx

For secure communications, use encrypted email.
  `.trim();

  useEffect(() => {
    const handleTerminalClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener("click", handleTerminalClick);
    }

    return () => {
      if (terminal) {
        terminal.removeEventListener("click", handleTerminalClick);
      }
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  const handleInputChange = (e) => {
    setTerminalInput(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      processCommand(terminalInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : commandHistory.length - 1;
        setHistoryIndex(newIndex);
        setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setTerminalInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else {
        setHistoryIndex(-1);
        setTerminalInput("");
      }
    }
  };

  const processCommand = (command) => {
    if (!command.trim()) {
      addOutput("system", "Type 'help' for available commands.");
      return;
    }

    setCommandHistory([...commandHistory, command]);
    setHistoryIndex(-1);

    addOutput("command", `> ${command}`);

    const cmd = command.toLowerCase().trim();

    switch (cmd) {
      case "help":
        addOutput("system", commandList);
        break;
      case "about":
        addOutput("system", aboutMe);
        break;
      case "projects":
        showProjects();
        break;
      case "skills":
        showSkills();
        break;
      case "clear":
        setTerminalOutput([]);
        break;
      case "contact":
        addOutput("system", contactInfo);
        break;
      case "hire me":
        addOutput("system", contactInfo);
        break;
      case "reboot":
        addOutput("system", "Rebooting system...");
        setTimeout(() => navigate("/"), 2000);
        break;
      default:
        addOutput(
          "error",
          `Command not found: ${command}. Type 'help' for available commands.`
        );
        break;
    }

    setTerminalInput("");
  };

  const addOutput = (type, text) => {
    setTerminalOutput((prev) => [...prev, { type, text }]);
  };

  const showProjects = () => {
    addOutput("system", "My Projects:");
    projects.forEach((project) => {
      addOutput(
        "project",
        `[${project.id}] ${project.title} - ${project.description}`
      );
      addOutput("tech", `Tech: ${project.tech.join(", ")}`);
    });
  };

  const showSkills = () => {
    addOutput("system", "Technical Skills:");
    skills.forEach((skill) => {
      addOutput(
        "skill",
        `${skill.name}: [${"■".repeat(skill.level / 10)}${"□".repeat(
          10 - skill.level / 10
        )}] ${skill.level}%`
      );
    });
  };

  return (
    <div className='dashboard bg-black text-green-400 font-mono min-h-screen flex flex-col'>
      <header className='flex justify-between items-center p-4 border-b border-green-600'>
        <div className='text-2xl font-bold flex items-center'>
          <span className='text-green-500'>root@m223rx-portfolio</span>
          <span className='text-green-300'>:~$</span>
          <span className='ml-2 animate-pulse'>_</span>
        </div>
        <nav className='space-x-4 text-sm'>
          <a href='#projects' className='hover:text-green-200'>
            Projects
          </a>
          <a href='#skills' className='hover:text-green-200'>
            Skills
          </a>
          <a href='#terminal' className='hover:text-green-200'>
            Terminal
          </a>
          <a href='#contact' className='hover:text-green-200'>
            Contact
          </a>
        </nav>
      </header>

      <main className='flex-1 p-6 flex flex-col gap-6 overflow-y-auto'>
        <section className='flex flex-col md:flex-row justify-between items-center bg-green-900 bg-opacity-10 p-4 rounded-lg border border-green-600'>
          <div>
            <h1 className='text-3xl font-bold'>Hi, I'm m223rx</h1>
            <p className='text-green-300 mt-1'>
              Full-Stack Developer & Security Specialist
            </p>
          </div>
          <div className='flex gap-6 mt-4 md:mt-0'>
            <div className='text-center'>
              <div className='text-2xl font-bold'>{projects.length}+</div>
              <div className='text-xs text-green-300'>Projects</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold'>200k</div>
              <div className='text-xs text-green-300'>Lines of Code</div>
            </div>
            <div className='text-center'>
              <div className='text-2xl font-bold'>{skills.length}</div>
              <div className='text-xs text-green-300'>Technologies</div>
            </div>
          </div>
        </section>
        
        <section
          id='projects'
          className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className='bg-black bg-opacity-90 border border-green-600 p-4 rounded-lg hover:scale-105 transform transition-all duration-300'
            >
              <h3 className='font-bold text-green-300'>{project.title}</h3>
              <p className='text-green-500 mt-2 text-sm'>
                {project.description}
              </p>
              <div className='mt-2 flex gap-2 flex-wrap'>
                {project.tech.map((tech) => (
                  <span
                    key={tech}
                    className='text-xs bg-green-800 bg-opacity-50 px-2 py-1 rounded'
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <div className='mt-2 flex gap-2'>
                <a
                  href={project.github}
                  target='_blank'
                  className='text-green-400 hover:text-green-200 text-sm'
                >
                  GitHub
                </a>
                <a
                  href={project.live}
                  target='_blank'
                  className='text-green-400 hover:text-green-200 text-sm'
                >
                  Live
                </a>
              </div>
            </div>
          ))}
        </section>
        
        <section
          id='skills'
          className='bg-green-900 bg-opacity-10 p-4 rounded-lg border border-green-600'
        >
          <h2 className='font-bold text-xl text-green-300 mb-4'>Skills</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className='flex justify-between text-green-400'>
                  <span>{skill.name}</span>
                  <span>{skill.level}%</span>
                </div>
                <div className='w-full h-2 bg-green-800 rounded mt-1 overflow-hidden'>
                  <div
                    className='h-full bg-green-400 transition-all duration-1000'
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        <section
          id='terminal'
          className='bg-black bg-opacity-90 border border-green-600 rounded-lg p-4 relative'
        >
          <h2 className='font-bold text-xl text-green-300 mb-4'>Terminal</h2>

          <div
            ref={terminalRef}
            className='terminal-content h-64 overflow-y-auto bg-black bg-opacity-70 p-3 border border-green-800 text-sm whitespace-pre-wrap leading-relaxed font-mono mb-2'
          >
            {terminalOutput.map((line, index) => (
              <div
                key={index}
                className={
                  line.type === "error"
                    ? "text-red-400"
                    : line.type === "command"
                    ? "text-blue-400"
                    : line.type === "project"
                    ? "text-cyan-400"
                    : line.type === "tech"
                    ? "text-purple-400"
                    : line.type === "skill"
                    ? "text-yellow-400"
                    : "text-green-400"
                }
              >
                {line.text}
              </div>
            ))}
            <div className='flex'>
              <span className='text-green-600'>m223rx@portfolio:~$</span>
              <input
                ref={inputRef}
                type='text'
                value={terminalInput}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                className='flex-1 bg-transparent border-none outline-none text-green-400 ml-2'
                spellCheck='false'
                autoFocus
              />
            </div>
          </div>

          <div className='text-xs text-green-700'>
            Type 'help' for available commands. Use ↑/↓ to navigate history.
          </div>
        </section>
    
        <section
          id='contact'
          className='bg-green-900 bg-opacity-10 p-4 rounded-lg border border-green-600'
        >
          <h2 className='font-bold text-xl text-green-300 mb-4'>Contact Me</h2>
          <div className='flex flex-col md:flex-row gap-4'>
            <a
              href='mailto:m223rx@digitalrealm.io'
              className='text-green-400 hover:text-green-200'
            >
              Email
            </a>
            <a
              href='https://github.com/m223rx'
              target='_blank'
              className='text-green-400 hover:text-green-200'
            >
              GitHub
            </a>
            <a
              href='https://linkedin.com/in/m223rx'
              target='_blank'
              className='text-green-400 hover:text-green-200'
            >
              LinkedIn
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
