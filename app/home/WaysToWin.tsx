import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WaysToWin() {
  return (
    <section className="my-8">
      <h2 className="text-3xl font-bold text-white mb-4">
        3 Ways to Win Big Prizes
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Find a Unique Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Unleash your creativity and stand a chance to win exclusive prizes
              by providing a one-of-a-kind answer.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Instant Prizes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Get rewarded instantly with exciting prizes just by participating
              in our engaging contests.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Live Raffle</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Experience the thrill of our live raffles and stand a chance to
              win big prizes in real-time.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
