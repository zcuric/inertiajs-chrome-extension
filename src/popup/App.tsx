import { useEffect, useState } from "react";

export function App() {
  const [inertiaDetected, setInertiaDetected] = useState(false);

  useEffect(() => {
    chrome.storage.local.get("inertia", ({ inertia }) => {
      setInertiaDetected(inertia?.detected);
    });
  }, []);

  return (
    <div className="w-80 p-6 bg-white dark:bg-gray-800">
      <h1 className="text-2xl text-gray-800 dark:text-white">Inertia Devtools</h1>
      {inertiaDetected ? (
        <p className="text-base text-green-500">Inertia detected on this page.</p>
      ) : (
        <p className="text-base text-red-500 dark:text-red-400">Inertia not detected on this page.</p>
      )}
    </div>
  );
}
