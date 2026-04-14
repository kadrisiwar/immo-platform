"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronLeft, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreerAnnonce } from "@/hooks/use-annonces";
import Link from "next/link";

const EQUIPEMENTS_DISPONIBLES = [
  "Climatisation",
  "Ascenseur",
  "Parking",
  "Balcon",
  "Cuisine équipée",
  "Double vitrage",
  "Meublé",
  "Wifi inclus",
  "Piscine",
  "Jardin",
  "Garage",
  "Sécurité 24h",
  "Chauffage central",
  "Interphone",
  "Digicode",
];

export default function NouvelleAnnoncePage() {
  const router = useRouter();
  const creerAnnonce = useCreerAnnonce();
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState("");
  const [form, setForm] = useState({
    titre: "",
    description: "",
    type_bien: "",
    ville: "",
    adresse: "",
    loyer: "",
    caution: "",
    surface: "",
    nb_pieces: "",
    etage: "",
    equipements: [] as string[],
    images: [] as File[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const toggleEquipement = (eq: string) => {
    setForm((prev) => ({
      ...prev,
      equipements: prev.equipements.includes(eq)
        ? prev.equipements.filter((e) => e !== eq)
        : [...prev.equipements, eq],
    }));
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.titre) e.titre = "Requis";
    if (!form.type_bien) e.type_bien = "Requis";
    if (!form.ville) e.ville = "Requis";
    if (!form.adresse) e.adresse = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.loyer) e.loyer = "Requis";
    if (!form.surface) e.surface = "Requis";
    if (!form.nb_pieces) e.nb_pieces = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = () => {
    setApiError("");
    creerAnnonce.mutate(
      {
        titre: form.titre,
        description: form.description,
        type_bien: form.type_bien,
        ville: form.ville,
        adresse: form.adresse,
        loyer: form.loyer,
        surface: form.surface,
        nb_pieces: form.nb_pieces,
      },
      {
        onSuccess: () => {
          router.push("/proprietaire/annonces");
        },
        onError: (error: any) => {
          const msg = error?.response?.data
            ? JSON.stringify(error.response.data)
            : "Erreur lors de la publication. Vérifiez que vous êtes connecté.";
          setApiError(msg);
        },
      }
    );
  };

  const steps = [
    { n: 1, label: "Informations" },
    { n: 2, label: "Détails" },
    { n: 3, label: "Équipements" },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/proprietaire/annonces">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Nouvelle annonce</h1>
          <p className="text-sm text-muted-foreground">
            Publiez votre bien en quelques étapes
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium shrink-0 ${
                step > s.n
                  ? "bg-green-600 text-white"
                  : step === s.n
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {step > s.n ? "✓" : s.n}
            </div>
            <span
              className={`text-sm ${
                step === s.n ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div
                className={`flex-1 h-px ${
                  step > s.n ? "bg-green-600" : "bg-border"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Titre *</Label>
              <Input
                placeholder="Ex: Bel appartement 3 pièces - Lac 2"
                value={form.titre}
                onChange={(e) => updateField("titre", e.target.value)}
              />
              {errors.titre && (
                <p className="text-xs text-destructive">{errors.titre}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Type de bien *</Label>
              <Select
                value={form.type_bien}
                onValueChange={(v) => updateField("type_bien", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="duplex">Duplex</SelectItem>
                </SelectContent>
              </Select>
              {errors.type_bien && (
                <p className="text-xs text-destructive">{errors.type_bien}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Ville *</Label>
              <Select
                value={form.ville}
                onValueChange={(v) => updateField("ville", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir la ville" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tunis">Tunis</SelectItem>
                  <SelectItem value="Ariana">Ariana</SelectItem>
                  <SelectItem value="La Marsa">La Marsa</SelectItem>
                  <SelectItem value="Carthage">Carthage</SelectItem>
                  <SelectItem value="Sfax">Sfax</SelectItem>
                  <SelectItem value="Sousse">Sousse</SelectItem>
                </SelectContent>
              </Select>
              {errors.ville && (
                <p className="text-xs text-destructive">{errors.ville}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Adresse *</Label>
              <Input
                placeholder="Ex: Rue du Lac Malaren"
                value={form.adresse}
                onChange={(e) => updateField("adresse", e.target.value)}
              />
              {errors.adresse && (
                <p className="text-xs text-destructive">{errors.adresse}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Décrivez votre bien..."
                rows={4}
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleNext}>
              Suivant →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Détails du bien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loyer (DT) *</Label>
                <Input
                  type="number"
                  placeholder="900"
                  value={form.loyer}
                  onChange={(e) => updateField("loyer", e.target.value)}
                />
                {errors.loyer && (
                  <p className="text-xs text-destructive">{errors.loyer}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Caution (DT)</Label>
                <Input
                  type="number"
                  placeholder="1800"
                  value={form.caution}
                  onChange={(e) => updateField("caution", e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Surface (m²) *</Label>
                <Input
                  type="number"
                  placeholder="85"
                  value={form.surface}
                  onChange={(e) => updateField("surface", e.target.value)}
                />
                {errors.surface && (
                  <p className="text-xs text-destructive">{errors.surface}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Pièces *</Label>
                <Input
                  type="number"
                  placeholder="3"
                  value={form.nb_pieces}
                  onChange={(e) => updateField("nb_pieces", e.target.value)}
                />
                {errors.nb_pieces && (
                  <p className="text-xs text-destructive">{errors.nb_pieces}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Étage</Label>
              <Input
                type="number"
                placeholder="0 = RDC"
                value={form.etage}
                onChange={(e) => updateField("etage", e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep(1)}
              >
                ← Retour
              </Button>
              <Button className="flex-1" onClick={handleNext}>
                Suivant →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Équipements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {EQUIPEMENTS_DISPONIBLES.map((eq) => (
                  <Badge
                    key={eq}
                    variant={
                      form.equipements.includes(eq) ? "default" : "outline"
                    }
                    className="cursor-pointer py-1.5 px-3 text-sm"
                    onClick={() => toggleEquipement(eq)}
                  >
                    {form.equipements.includes(eq) && "✓ "}
                    {eq}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Images */}
          <Card>
            <CardHeader>
              <CardTitle>Photos (optionnel)</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent transition-colors"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Cliquez pour ajouter des photos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG — max 5MB par image
                </p>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setForm((prev) => ({
                    ...prev,
                    images: [...(prev.images || []), ...files],
                  }));
                }}
              />
              {form.images && form.images.length > 0 && (
                <div className="flex gap-2 mt-3 flex-wrap">
                  {form.images.map((img: File, i: number) => (
                    <div key={i} className="relative">
                      <img
                        src={URL.createObjectURL(img)}
                        className="h-16 w-16 object-cover rounded-lg border"
                        alt={`photo ${i + 1}`}
                      />
                      <button
                        className="absolute -top-1 -right-1 bg-destructive text-white rounded-full h-4 w-4 text-xs flex items-center justify-center"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            images: prev.images?.filter(
                              (_: File, idx: number) => idx !== i
                            ),
                          }))
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Récapitulatif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground">Titre:</span>
                  <p className="font-medium">{form.titre}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type:</span>
                  <p className="font-medium capitalize">{form.type_bien}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ville:</span>
                  <p className="font-medium">{form.ville}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Loyer:</span>
                  <p className="font-medium">{form.loyer} DT</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Surface:</span>
                  <p className="font-medium">{form.surface} m²</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pièces:</span>
                  <p className="font-medium">{form.nb_pieces}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Error */}
          {apiError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {apiError}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(2)}
            >
              ← Retour
            </Button>
            <Button
              style={{ backgroundColor: "#16a34a", color: "white" }}
              className="flex-1"
              onClick={handleSubmit}
              disabled={creerAnnonce.isPending}
            >
              <Plus className="mr-2 h-4 w-4" />
              {creerAnnonce.isPending ? "Publication..." : "Publier l'annonce"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
