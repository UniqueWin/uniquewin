import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SeoTitleSection() {
  return (
    <section className="my-8">
      <Card className="bg-yellow-100 border-l-4 border-yellow-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-yellow-800">
            H3 SEO Title for this section
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700">
            This is a highlighted section for SEO purposes. It contains
            important keywords and information relevant to the content of the
            page.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
