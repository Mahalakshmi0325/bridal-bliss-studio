import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ArtistProfile() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState(0);
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [artistId, setArtistId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("artists").select("*").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (data) {
        setBio(data.bio || "");
        setExperience(data.experience);
        setSpecialization(data.specialization?.join(", ") || "");
        setArtistId(data.id);
      }
      setLoading(false);
    });
  }, [user]);

  const handleSave = async () => {
    if (!artistId) return;
    setSaving(true);
    const { error } = await supabase.from("artists").update({
      bio,
      experience,
      specialization: specialization.split(",").map((s) => s.trim()).filter(Boolean),
    }).eq("id", artistId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Saved", description: "Profile updated." });
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">My Profile</h2>
      <Card className="shadow-soft max-w-lg">
        <CardHeader><CardTitle className="text-base">Artist Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={profile?.name || ""} disabled className="mt-1" />
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} className="mt-1" rows={3} />
          </div>
          <div>
            <Label>Experience (years)</Label>
            <Input type="number" value={experience} onChange={(e) => setExperience(Number(e.target.value))} className="mt-1" />
          </div>
          <div>
            <Label>Specializations (comma-separated)</Label>
            <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="mt-1" placeholder="Bridal, Party, Editorial" />
          </div>
          <Button onClick={handleSave} disabled={saving} variant="elegant">
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
