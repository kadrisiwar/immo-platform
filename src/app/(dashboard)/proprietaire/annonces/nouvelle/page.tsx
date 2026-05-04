"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronLeft, Upload, X, ImageIcon, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useCreerAnnonce } from "@/hooks/use-annonces";
import { useDraft } from "@/hooks/use-draft";
import api from "@/lib/api";
import Link from "next/link";

const EQUIPEMENTS_DISPONIBLES = [
  "Climatisation", "Ascenseur", "Parking", "Balcon",
  "Cuisine équipée", "Double vitrage", "Meublé", "Wifi inclus",
  "Piscine", "Jardin", "Garage", "Sécurité 24h",
  "Chauffage central", "Interphone", "Digicode",
];

const INITIAL_FORM = {
  titre:       "",
  description: "",
  type_bien:   "",
  ville:       "",
  adresse:     "",
  loyer:       "",
  caution:     "",
  surface:     "",
  nb_pieces:   "",
  etage:       "",
  equipements: [] as string[],
};

export default function NouvelleAnnoncePage() {
  const router       = useRouter();
  const creerAnnonce = useCreerAnnonce();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SSR fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { data: form, setData: setForm, save, clear, lastSaved, loaded } =
    useDraft("nouvelle-annonce", INITIAL_FORM);

  const [step, setStep]           = useState(1);
  const [apiError, setApiError]   = useState("");
  const [images, setImages]       = useState<File[]>([]);
  const [previews, setPreviews]   = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const toggleEquipement = (eq: string) => {
    setForm(prev => ({
      ...prev,
      equipements: prev.equipements.includes(eq)
        ? prev.equipements.filter(e => e !== eq)
        : [...prev.equipements, eq],
    }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => f.size <= 5 * 1024 * 1024);
    if (valid.length < files.length) {
      setApiError("Certaines images dépassent 5MB et ont été ignorées.");
    }
    setImages(prev => [...prev, ...valid]);
    valid.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.titre)     e.titre     = "Requis";
    if (!form.type_bien) e.type_bien = "Requis";
    if (!form.ville)     e.ville     = "Requis";
    if (!form.adresse)   e.adresse   = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.loyer)     e.loyer     = "Requis";
    if (!form.surface)   e.surface   = "Requis";
    if (!form.nb_pieces) e.nb_pieces = "Requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    setApiError("");
    setUploading(true);

    try {
      const annonce: any = await new Promise((resolve, reject) => {
        creerAnnonce.mutate(
          {
            titre:       form.titre,
            description: form.description,
            type_bien:   form.type_bien,
            ville:       form.ville,
            adresse:     form.adresse,
            loyer:       form.loyer,
            surface:     form.surface,
            nb_pieces:   form.nb_pieces,
          },
          {
            onSuccess: resolve,
            onError:   reject,
          }
        );
      });

      // Upload images
      if (images.length > 0 && annonce?.id) {
        for (const img of images) {
          const formData = new FormData();
          formData.append("image", img);
          try {
            await api.post(`/annonces/${annonce.id}/upload-image/`, formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          } catch {}
        }
      }

      clear(); // Effacer le brouillon
      router.push("/proprietaire/annonces");

    } catch (error: any) {
      const msg = error?.response?.data
        ? JSON.stringify(error.response.data)
        : "Erreur lors de la publication. Vérifiez que vous êtes connecté.";
      setApiError(msg);
    } finally {
      setUploading(false);
    }
  };

  const steps = [
    { n: 1, label: "Informations" },
    { n: 2, label: "Détails" },
    { n: 3, label: "Photos & Équipements" },
  ];

  // SSR guard
  if (!mounted || !loaded) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">Chargement...</div>
    </div>
  );

  return (
    <div className="space-y-6 pb-10">

      {/* En-tête */}
      <div className="flex items-center justify-between">
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

        {/* Save brouillon */}
        <div className="flex items-center gap-2">
          {lastSaved && (
            <p className="text-xs text-muted-foreground hidden sm:block">
              ✓ Sauvegardé à {lastSaved.toLocaleTimeString("fr-TN")}
            </p>
          )}
          <Button variant="outline" size="sm" onClick={save}>
            <Save className="mr-2 h-4 w-4" /> Brouillon
          </Button>
        </div>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center gap-2 flex-1">
            <div className={`
              flex h-8 w-8 items-center justify-center rounded-full
              text-sm font-medium shrink-0 transition-colors
              ${step > s.n
                ? "bg-green-600 text-white"
                : step === s.n
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }
            `}>
              {step > s.n ? "✓" : s.n}
            </div>
            <span className={`text-sm ${step === s.n ? "font-medium" : "text-muted-foreground"}`}>
              {s.label}
            </span>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px transition-colors ${step > s.n ? "bg-green-600" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Step 1 — Informations ── */}
      {step === 1 && (
        <Card>
          <CardHeader><CardTitle>Informations générales</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            <div className="space-y-2">
              <Label>Titre <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Ex: Bel appartement 3 pièces - Lac 2"
                value={form.titre}
                onChange={e => updateField("titre", e.target.value)}
              />
              {errors.titre && <p className="text-xs text-destructive">{errors.titre}</p>}
            </div>

            <div className="space-y-2">
              <Label>Type de bien <span className="text-destructive">*</span></Label>
              <Select value={form.type_bien} onValueChange={v => updateField("type_bien", v)}>
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
              {errors.type_bien && <p className="text-xs text-destructive">{errors.type_bien}</p>}
            </div>

            <div className="space-y-2">
              <Label>Ville <span className="text-destructive">*</span></Label>
              <Select value={form.ville} onValueChange={v => updateField("ville", v)}>
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
                  <SelectItem value="Gammarth">Gammarth</SelectItem>
                </SelectContent>
              </Select>
              {errors.ville && <p className="text-xs text-destructive">{errors.ville}</p>}
            </div>

            <div className="space-y-2">
              <Label>Adresse <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Ex: Rue du Lac Malaren, Imm. Les Jardins"
                value={form.adresse}
                onChange={e => updateField("adresse", e.target.value)}
              />
              {errors.adresse && <p className="text-xs text-destructive">{errors.adresse}</p>}
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Décrivez votre bien en détail..."
                rows={4}
                value={form.description}
                onChange={e => updateField("description", e.target.value)}
              />
            </div>

            <Button className="w-full" onClick={handleNext}>
              Suivant →
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Step 2 — Détails ── */}
      {step === 2 && (
        <Card>
          <CardHeader><CardTitle>Détails du bien</CardTitle></CardHeader>
          <CardContent className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loyer (DT) <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="900"
                  value={form.loyer}
                  onChange={e => updateField("loyer", e.target.value)}
                />
                {errors.loyer && <p className="text-xs text-destructive">{errors.loyer}</p>}
              </div>
              <div className="space-y-2">
                <Label>Caution (DT)</Label>
                <Input
                  type="number"
                  placeholder="1800"
                  value={form.caution}
                  onChange={e => updateField("caution", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Surface (m²) <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="85"
                  value={form.surface}
                  onChange={e => updateField("surface", e.target.value)}
                />
                {errors.surface && <p className="text-xs text-destructive">{errors.surface}</p>}
              </div>
              <div className="space-y-2">
                <Label>Pièces <span className="text-destructive">*</span></Label>
                <Input
                  type="number"
                  placeholder="3"
                  value={form.nb_pieces}
                  onChange={e => updateField("nb_pieces", e.target.value)}
                />
                {errors.nb_pieces && <p className="text-xs text-destructive">{errors.nb_pieces}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Étage <span className="text-muted-foreground text-xs">(0 = RDC)</span></Label>
              <Input
                type="number"
                placeholder="0"
                value={form.etage}
                onChange={e => updateField("etage", e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                ← Retour
              </Button>
              <Button className="flex-1" onClick={handleNext}>
                Suivant →
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Step 3 — Photos & Équipements ── */}
      {step === 3 && (
        <div className="space-y-4">

          {/* Upload Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Photos du bien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-accent transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="font-medium text-sm">Cliquez pour ajouter des photos</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG — max 5MB par image
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />

              {previews.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {previews.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        alt={`photo ${i + 1}`}
                        className="h-28 w-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-destructive text-white rounded-full h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {i === 0 && (
                        <Badge className="absolute bottom-1 left-1 text-xs">
                          Photo principale
                        </Badge>
                      )}
                    </div>
                  ))}
                  <div
                    className="h-28 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ImageIcon className="h-4 w-4" />
                  <span>
                    Aucune photo — les annonces avec photos reçoivent 3x plus de vues
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Équipements */}
          <Card>
            <CardHeader><CardTitle>Équipements disponibles</CardTitle></CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {EQUIPEMENTS_DISPONIBLES.map((eq) => (
                  <Badge
                    key={eq}
                    variant={form.equipements.includes(eq) ? "default" : "outline"}
                    className="cursor-pointer py-1.5 px-3 text-sm select-none"
                    onClick={() => toggleEquipement(eq)}
                  >
                    {form.equipements.includes(eq) && "✓ "}{eq}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Récapitulatif */}
          <Card>
            <CardHeader><CardTitle>Récapitulatif</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground">Titre</span>
                  <p className="font-medium">{form.titre}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Type</span>
                  <p className="font-medium capitalize">{form.type_bien}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Ville</span>
                  <p className="font-medium">{form.ville}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Loyer</span>
                  <p className="font-medium">{form.loyer} DT</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Surface</span>
                  <p className="font-medium">{form.surface} m²</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Pièces</span>
                  <p className="font-medium">{form.nb_pieces}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Photos</span>
                  <p className="font-medium">{images.length} photo(s)</p>
                </div>
                {form.equipements.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">Équipements</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {form.equipements.map(eq => (
                        <Badge key={eq} variant="secondary" className="text-xs">{eq}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* API Error */}
          {apiError && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {apiError}
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setStep(2)}
              disabled={uploading}
            >
              ← Retour
            </Button>
            <Button
              className="flex-1"
              style={{ backgroundColor: "#16a34a", color: "white" }}
              onClick={handleSubmit}
              disabled={uploading}
            >
              <Plus className="mr-2 h-4 w-4" />
              {uploading ? "Publication en cours..." : "Publier l'annonce"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}