import type { ChangeEvent, RefObject } from "react";

import { Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type TSettingsProfileAvatarSectionProps = {
  photoUrl: string;
  initials: string;
  inputId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isUploading: boolean;
  error?: string;
  onPickClick: () => void;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function SettingsProfileAvatarSection({
  photoUrl,
  initials,
  inputId,
  inputRef,
  isUploading,
  error,
  onPickClick,
  onFileChange,
}: TSettingsProfileAvatarSectionProps) {
  return (
    <>
      <Input
        id={inputId}
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif"
        tabIndex={-1}
        className="sr-only"
        onChange={(e) => void onFileChange(e)}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <Avatar className="size-20 border-2 border-brand-primary/30">
          {photoUrl ? <AvatarImage src={photoUrl} alt="" /> : null}
          <AvatarFallback className="bg-brand-primary text-lg font-semibold text-brand-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isUploading}
            className="w-fit gap-2 rounded-xs border-border"
            aria-controls={inputId}
            aria-label="Choose profile photo file"
            onClick={onPickClick}
          >
            {isUploading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Uploading…
              </>
            ) : (
              "Change Avatar"
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            JPG, GIF or PNG. 1MB max.
          </p>
          {error ? (
            <p className="text-xs font-medium text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </>
  );
}
