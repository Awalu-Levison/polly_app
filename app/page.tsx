import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto py-12 px-4">
      <section className="flex flex-col items-center text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Create and Share Polls <br />
          <span className="text-primary">with Anyone</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px]">
          Polly makes it easy to create polls, gather opinions, and analyze results in real-time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button asChild size="lg">
            <Link href="/polls">Browse Polls</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-up">Create Account</Link>
          </Button>
        </div>
      </section>

      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Create</CardTitle>
              <CardDescription>Design your poll in minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Create custom polls with multiple options. Add descriptions and customize settings to suit your needs.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link">
                <Link href="/polls/create">Create a Poll</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share</CardTitle>
              <CardDescription>Distribute to your audience</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Share your poll via link, email, or social media. Reach your target audience wherever they are.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link">
                <Link href="/polls">View Examples</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyze</CardTitle>
              <CardDescription>Get insights from responses</CardDescription>
            </CardHeader>
            <CardContent>
              <p>View real-time results and analytics. Understand trends and patterns in the responses.</p>
            </CardContent>
            <CardFooter>
              <Button asChild variant="link">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to create your first poll?</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-[600px] mx-auto">
          Join thousands of users who are already collecting valuable feedback with Polly.
        </p>
        <Button asChild size="lg">
          <Link href="/sign-up">Sign Up for Free</Link>
        </Button>
      </section>
    </div>
  );
}
