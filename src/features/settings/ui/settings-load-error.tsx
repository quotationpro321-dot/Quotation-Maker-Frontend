import { Button } from "@/components/ui/button";

type TSettingsLoadErrorProps = {
  onRetry: () => void;
};

export function SettingsLoadError({ onRetry }: TSettingsLoadErrorProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
      <p className="text-sm text-muted-foreground">
        We could not load your profile.
      </p>
      <Button type="button" variant="outline" onClick={() => void onRetry()}>
        Try again
      </Button>
    </div>
  );
}
