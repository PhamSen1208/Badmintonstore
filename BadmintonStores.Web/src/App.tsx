import { Button } from "@/components/ui/button"

function App() {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold">BadmintonStores</h1>
        <p className="mt-2 text-muted-foreground">
          Frontend setup is ready.
        </p>

        <div className="mt-6">
          <Button>Test shadcn button</Button>
        </div>
      </div>
    </main>
  )
}

export default App