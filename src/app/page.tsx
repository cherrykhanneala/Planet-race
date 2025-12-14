export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="max-w-4xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold">Planet Race</h1>
        <p className="text-xl">Multiplayer Racing Platform</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
          <div className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">For Players</h2>
            <ul className="text-left space-y-2">
              <li>✓ Guest & OAuth Authentication</li>
              <li>✓ Race Result Storage</li>
              <li>✓ Ghost Replay System</li>
              <li>✓ Global & Daily Leaderboards</li>
              <li>✓ Matchmaking & Lobbies</li>
            </ul>
          </div>
          <div className="border p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">For Developers</h2>
            <ul className="text-left space-y-2">
              <li>✓ RESTful API Endpoints</li>
              <li>✓ Unity Client Ready</li>
              <li>✓ Scalable Architecture</li>
              <li>✓ Admin Tools</li>
              <li>✓ Production Ready</li>
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <a 
            href="/api/docs" 
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            View API Documentation
          </a>
        </div>
      </div>
    </main>
  )
}
