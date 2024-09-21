import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Statistics() {
  return (
    <section className="my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-pink-500 text-white">
          <CardHeader>
            <CardTitle className="text-3xl">£10,000</CardTitle>
          </CardHeader>
          <CardContent>
            <p>given in prizes</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-500 text-white">
          <CardHeader>
            <CardTitle className="text-3xl">1,200</CardTitle>
          </CardHeader>
          <CardContent>
            <p>players</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow-500 text-white">
          <CardHeader>
            <CardTitle className="text-3xl">875</CardTitle>
          </CardHeader>
          <CardContent>
            <p>winners</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
