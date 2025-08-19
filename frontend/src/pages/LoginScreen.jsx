import { useState } from "react";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    const maxAttempts = 3;

    if (attempts + 1 >= maxAttempts) {
      setMessage("SYSTEM BREACH DETECTED\nUsername: admin\nPassword: 12345");
    } else {
      setMessage("Access Denied. Try again...");
      setAttempts(attempts + 1);
    }
  };

  return (
    <div className='bg-black text-green-400 font-mono h-screen flex flex-col justify-center items-center p-4'>
      <form onSubmit={handleLogin} className='flex flex-col gap-2 w-64'>
        <input
          type='text'
          placeholder='Username'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className='bg-black border border-green-400 px-2 py-1 focus:outline-none'
        />
        <input
          type='password'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className='bg-black border border-green-400 px-2 py-1 focus:outline-none'
        />
        <button
          type='submit'
          className='bg-green-400 text-black px-2 py-1 mt-2'
        >
          Login
        </button>
      </form>
      <div className='mt-4 whitespace-pre-wrap'>{message}</div>
    </div>
  );
}
