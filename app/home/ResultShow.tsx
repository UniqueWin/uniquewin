import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export function ResultShow() {
  return (
    <Card className="bg-blue-500 text-white">
      <CardHeader>
        <CardTitle>Don&apos;t Miss the 8pm Result Show on Facebook</CardTitle>
      </CardHeader>
      <CardContent>
        <Image
          src="/placeholder.svg?height=200&width=300"
          alt="Result Show Host"
          width={300}
          height={200}  
          className="rounded-lg"
        />
      </CardContent>
    </Card>
  );
}
