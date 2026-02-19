import { Card, CardContent } from "@/components/ui/card";

export default function ArtistMessages() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">Messages</h2>
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">Messaging feature coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
