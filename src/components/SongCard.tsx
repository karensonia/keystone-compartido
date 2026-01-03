import { Music2, Plus, PlayCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SongCardProps {
  title: string;
  artist: string;
  genre?: string;
  onAdd: () => void;
  isAdded?: boolean;
  image?: string; // Nueva prop para mostrar imagen del álbum
  onPreview?: () => void;
  isPreviewing?: boolean;
  previewUrl?: string;
  trackId?: string;
}

export const SongCard = ({
  title,
  artist,
  genre,
  onAdd,
  isAdded,
  image,
  onPreview,
  isPreviewing,
  previewUrl,
  trackId,
}: SongCardProps) => {
  return (
    <Card
      className={`relative overflow-hidden glass-card p-4 transition-all group ${
        isPreviewing ? "ring-2 ring-primary/40 shadow-[0_8px_32px_hsl(var(--primary)/0.3)]" : "hover:shadow-[0_8px_32px_hsl(var(--primary)/0.2)]"
      }`}
    >
      {/* Background image layer */}
      {image && (
        <div
          className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
      {/* Overlay mask using app background color at 80% */}
      {image && (
        <div
          className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "color-mix(in srgb, hsl(var(--background)) 80%, transparent)",
          }}
        />
      )}

      <div className="relative z-20 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
            {image ? (
              <img src={image} alt={title} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Music2 className="w-7 h-7 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-foreground truncate">{title}</h3>
            <p className="text-sm text-muted-foreground truncate">{artist}</p>
            {genre && (
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                {genre}
              </span>
            )}
          </div>
          {/* Desktop / wide screens: keep inline buttons on the right */}
          <div className="hidden sm:flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <Button
              size="default"
              variant={isAdded ? "outline" : "gradient"}
              onClick={onAdd}
              disabled={isAdded}
              className="flex-shrink-0 whitespace-nowrap"
            >
              {isAdded ? "Agregada" : "Agregar canción"}
            </Button>
            {onPreview && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onPreview}
                className="flex-shrink-0"
                title={isPreviewing ? "Cerrar preview" : "Escuchar preview"}
              >
                {isPreviewing ? <X className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              </Button>
            )}
          </div>

          {/* Desktop / wide screens already have inline controls; mobile base will be rendered below preview */}
        </div>
        {isPreviewing && (
          <div className="pt-4 border-t border-border space-y-3 animate-fade-in">
            {previewUrl ? (
              <audio controls autoPlay className="w-full">
                <source src={previewUrl} type="audio/mpeg" />
                Tu navegador no soporta la reproducción de audio.
              </audio>
            ) : trackId ? (
              <iframe
                src={`https://open.spotify.com/embed/track/${trackId}`}
                width="100%"
                height="80"
                frameBorder="0"
                allow="encrypted-media"
                title={`Preview ${title}`}
                className="rounded-lg"
              />
            ) : (
              <p className="text-sm text-muted-foreground">
                No hay preview disponible para esta canción.
              </p>
            )}
          </div>
        )}

        {/* Mobile base: two equal halves (left: preview, right: add) attached to bottom of card */}
        <div className="sm:hidden mt-2 -mx-4">
          <div className="bg-muted/5 border-t border-border flex">
            {/* Left: Preview (50%) */}
            <div className="w-1/2 border-r border-border">
              <Button
                size="default"
                variant={previewUrl || trackId ? "outline" : "ghost"}
                onClick={onPreview}
                disabled={!onPreview || (!previewUrl && !trackId)}
                className="w-full h-full rounded-none flex items-center justify-center gap-2 py-3"
                title={isPreviewing ? "Cerrar preview" : "Escuchar preview"}
              >
                <PlayCircle className="w-4 h-4" />
                <span className="text-sm">{isPreviewing ? "Cerrar" : "Escuchar"}</span>
              </Button>
            </div>

            {/* Right: Add (50%) */}
            <div className="w-1/2">
              <Button
                size="default"
                variant={isAdded ? "outline" : "gradient"}
                onClick={onAdd}
                disabled={isAdded}
                className="w-full h-full rounded-none flex items-center justify-center gap-2 py-3"
                title={isAdded ? "Agregada" : "Agregar canción"}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">{isAdded ? "Agregada" : "Agregar"}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
