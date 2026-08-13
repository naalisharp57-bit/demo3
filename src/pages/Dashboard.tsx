import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, LogOut, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useAuth } from "@/hooks/useAuth";
import type { PortfolioData, Project, Service, SocialLink } from "@/types/portfolio";
import { Field, TextArea, TextInput } from "@/components/forms/Field";

const uid = () => Math.random().toString(36).slice(2, 9);

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
      <h2 className="font-display text-lg font-600">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { isAuthed, logout } = useAuth();
  const { data, save, reset } = usePortfolio();
  const [draft, setDraft] = useState<PortfolioData>(data);

  useEffect(() => {
    if (localStorage.getItem("portfolio_auth_v1") !== "true") {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => setDraft(data), [data]);

  const update = (patch: Partial<PortfolioData>) => setDraft((d) => ({ ...d, ...patch }));

  const handleSave = () => {
    save(draft);
    toast.success("Portfolio updated.");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const addProject = () =>
    update({
      projects: [
        ...draft.projects,
        {
          id: uid(),
          title: "New Project",
          category: "Branding",
          description: "Describe this project.",
          image:
            "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=900&h=700&fit=crop",
          link: "#",
        },
      ],
    });

  const updateProject = (id: string, patch: Partial<Project>) =>
    update({
      projects: draft.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    });

  const removeProject = (id: string) =>
    update({ projects: draft.projects.filter((p) => p.id !== id) });

  const updateService = (id: string, patch: Partial<Service>) =>
    update({
      services: draft.services.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });

  const addSocial = () =>
    update({ socials: [...draft.socials, { id: uid(), label: "New", url: "https://" }] });

  const updateSocial = (id: string, patch: Partial<SocialLink>) =>
    update({
      socials: draft.socials.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    });

  const removeSocial = (id: string) =>
    update({ socials: draft.socials.filter((s) => s.id !== id) });

  if (!isAuthed && localStorage.getItem("portfolio_auth_v1") !== "true") return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <p className="font-display text-lg font-bold">Dashboard</p>
            <p className="text-xs text-muted-foreground">Edit your live portfolio</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-sm font-600 hover:bg-muted"
            >
              <Eye className="h-4 w-4" /> <span className="hidden sm:inline">Preview</span>
            </Link>
            <button
              onClick={handleSave}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-600 text-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              <Save className="h-4 w-4" /> Save
            </button>
            <button
              onClick={handleLogout}
              className="grid h-10 w-10 place-items-center rounded-full border border-border hover:bg-muted"
              aria-label="Log out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="container grid gap-6 py-8 lg:grid-cols-2">
        <Panel title="Profile">
          <Field label="Full name">
            <TextInput value={draft.name} onChange={(e) => update({ name: e.target.value })} />
          </Field>
          <Field label="Title / role">
            <TextInput value={draft.title} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="Tagline">
            <TextArea rows={2} value={draft.tagline} onChange={(e) => update({ tagline: e.target.value })} />
          </Field>
          <Field label="Bio">
            <TextArea rows={4} value={draft.bio} onChange={(e) => update({ bio: e.target.value })} />
          </Field>
          <label className="flex items-center gap-3 text-sm font-500">
            <input
              type="checkbox"
              checked={draft.available}
              onChange={(e) => update({ available: e.target.checked })}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
            />
            Show "available for freelance work" badge
          </label>
        </Panel>

        <Panel title="Contact & Socials">
          <Field label="Email">
            <TextInput value={draft.email} onChange={(e) => update({ email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <TextInput value={draft.phone} onChange={(e) => update({ phone: e.target.value })} />
          </Field>
          <Field label="Location">
            <TextInput value={draft.location} onChange={(e) => update({ location: e.target.value })} />
          </Field>

          <div className="space-y-2">
            <span className="text-sm font-600">Social links</span>
            {draft.socials.map((s) => (
              <div key={s.id} className="flex gap-2">
                <TextInput
                  value={s.label}
                  onChange={(e) => updateSocial(s.id, { label: e.target.value })}
                  className="w-32"
                  placeholder="Label"
                />
                <TextInput
                  value={s.url}
                  onChange={(e) => updateSocial(s.id, { url: e.target.value })}
                  placeholder="https://"
                />
                <button
                  onClick={() => removeSocial(s.id)}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border text-destructive hover:bg-destructive/10"
                  aria-label="Remove link"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addSocial}
              className="inline-flex items-center gap-2 text-sm font-600 text-primary hover:underline"
            >
              <Plus className="h-4 w-4" /> Add social link
            </button>
          </div>
        </Panel>

        <Panel title="Skills">
          <Field label="Skills (comma separated)">
            <TextArea
              rows={3}
              value={draft.skills.join(", ")}
              onChange={(e) =>
                update({
                  skills: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
            />
          </Field>
          <div className="flex flex-wrap gap-2">
            {draft.skills.map((s) => (
              <span key={s} className="rounded-full bg-muted px-3 py-1 text-xs font-500">
                {s}
              </span>
            ))}
          </div>
        </Panel>

        <Panel title="Services">
          {draft.services.map((svc) => (
            <div key={svc.id} className="rounded-xl border border-border p-4">
              <TextInput
                value={svc.title}
                onChange={(e) => updateService(svc.id, { title: e.target.value })}
                className="mb-2 font-600"
              />
              <TextArea
                rows={2}
                value={svc.description}
                onChange={(e) => updateService(svc.id, { description: e.target.value })}
              />
            </div>
          ))}
        </Panel>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-600">Projects</h2>
            <button
              onClick={addProject}
              className="inline-flex h-9 items-center gap-2 rounded-full bg-foreground px-4 text-sm font-600 text-background"
            >
              <Plus className="h-4 w-4" /> Add project
            </button>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {draft.projects.map((p) => (
              <div key={p.id} className="rounded-xl border border-border p-4">
                <div className="flex gap-4">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-20 w-20 shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-1 space-y-2">
                    <TextInput
                      value={p.title}
                      onChange={(e) => updateProject(p.id, { title: e.target.value })}
                      placeholder="Title"
                      className="font-600"
                    />
                    <TextInput
                      value={p.category}
                      onChange={(e) => updateProject(p.id, { category: e.target.value })}
                      placeholder="Category"
                    />
                  </div>
                </div>
                <TextArea
                  rows={2}
                  value={p.description}
                  onChange={(e) => updateProject(p.id, { description: e.target.value })}
                  className="mt-3"
                  placeholder="Description"
                />
                <div className="mt-2 flex gap-2">
                  <TextInput
                    value={p.image}
                    onChange={(e) => updateProject(p.id, { image: e.target.value })}
                    placeholder="Image URL"
                  />
                  <button
                    onClick={() => removeProject(p.id)}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border text-destructive hover:bg-destructive/10"
                    aria-label="Remove project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex items-center justify-between lg:col-span-2">
          <button
            onClick={() => {
              reset();
              toast.success("Reset to default content.");
            }}
            className="inline-flex items-center gap-2 text-sm font-600 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-4 w-4" /> Reset to defaults
          </button>
          <button
            onClick={handleSave}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 font-600 text-primary-foreground"
          >
            <Save className="h-4 w-4" /> Save changes
          </button>
        </div>
      </main>
    </div>
  );
}
