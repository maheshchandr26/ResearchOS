import { useEffect, useState } from "react";
import { api } from "@/api/client";

type HealthResponse = {
  status: string;
  application: string;
  version: string;
};

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setHealth(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      {health ? (
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-bold">
            {health.application}
          </h1>

          <p>Status: {health.status}</p>

          <p>Version: {health.version}</p>
        </div>
      ) : (
        <p>Connecting to backend...</p>
      )}
    </div>
  );
}