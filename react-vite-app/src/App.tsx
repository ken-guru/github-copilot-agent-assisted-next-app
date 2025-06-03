import { ThemeProvider } from '@/contexts/ThemeContext'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

function AppContent() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header with theme toggle */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Activity Tracker
          </h1>
          <ThemeToggle />
        </header>

        {/* Main content grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Welcome Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Welcome to Activity Tracker</CardTitle>
              <CardDescription>
                A modern React application built with Vite, TypeScript, and Tailwind CSS
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                This is a complete rewrite of the original Next.js application, implementing
                modern React patterns with a test-first approach.
              </p>
              <div className="flex gap-2">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </CardContent>
          </Card>

          {/* Theme Demo Card */}
          <Card>
            <CardHeader>
              <CardTitle>Theme System</CardTitle>
              <CardDescription>
                Toggle between light and dark modes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground-muted mb-4">
                The theme system uses CSS custom properties and Tailwind's dark mode feature.
              </p>
            </CardContent>
            <CardFooter>
              <ThemeToggle />
            </CardFooter>
          </Card>

          {/* Components Demo */}
          <Card>
            <CardHeader>
              <CardTitle>UI Components</CardTitle>
              <CardDescription>Foundation components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Preview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Features being implemented</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Widgets</h4>
                  <ul className="text-sm text-foreground-muted space-y-1">
                    <li>• Calculator</li>
                    <li>• Timer</li>
                    <li>• Weather Widget</li>
                    <li>• Task Manager</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Features</h4>
                  <ul className="text-sm text-foreground-muted space-y-1">
                    <li>• Responsive Design</li>
                    <li>• Accessibility</li>
                    <li>• Test Coverage</li>
                    <li>• Modern Architecture</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
