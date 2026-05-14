type TSettingsPageHeaderProps = {
  title?: string;
  description?: string;
};

export function SettingsPageHeader({
  title = "Settings",
  description = "Manage your account settings and preferences.",
}: TSettingsPageHeaderProps) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </header>
  );
}
