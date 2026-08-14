"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useGetLayoutQuery,
  useCreateLayoutMutation,
  useEditLayoutMutation,
} from "@/redux/features/layout/layoutApi";

type Tab = "Banner" | "FAQ" | "Categories";

interface FaqItem {
  question: string;
  answer: string;
}

interface CategoryItem {
  title: string;
}

export default function LayoutSettingsPage() {
  const [tab, setTab] = useState<Tab>("Banner");

  return (
    <div>
      <h1 className="font-display text-3xl text-ink mb-2">Homepage content</h1>
      <p className="text-ink/60 mb-8">
        Manage the banner, FAQ, and categories shown to visitors.
      </p>

      <div className="flex gap-2 mb-8">
        {(["Banner", "FAQ", "Categories"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-colors ${
              tab === t
                ? "bg-ledger text-paper"
                : "bg-surface border border-ink/15 text-ink/60 hover:border-gold/50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Banner" && <BannerEditor />}
      {tab === "FAQ" && <FaqEditor />}
      {tab === "Categories" && <CategoriesEditor />}
    </div>
  );
}

// ------------------- Banner -------------------

function BannerEditor() {
  const { data, isLoading } = useGetLayoutQuery("Banner");
  const [createLayout, { isLoading: isCreating }] = useCreateLayoutMutation();
  const [editLayout, { isLoading: isEditing }] = useEditLayoutMutation();

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [image, setImage] = useState("");
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loaded, setLoaded] = useState(false);
  const exists = !!data?.layout;

  useEffect(() => {
    if (loaded || isLoading) return;
    const banner = data?.layout?.banner;
    if (banner) {
      setTitle(banner.title || "");
      setSubTitle(banner.subTitle || "");
      setExistingImageUrl(banner.image?.url || "");
    }
    setLoaded(true);
  }, [data, isLoading, loaded]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const body: any = { type: "Banner", title, subTitle };
    // New upload takes priority; otherwise pass the existing URL through so
    // the backend knows not to re-upload it (see editCourse's same pattern).
    body.image = image || existingImageUrl;

    try {
      if (exists) {
        await editLayout(body).unwrap();
      } else {
        await createLayout(body).unwrap();
      }
      toast.success("Banner updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save banner");
    }
  };

  if (isLoading) return <p className="text-ink/50">Loading…</p>;

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-4 max-w-xl">
      <div>
        <label className="block text-xs text-ink/50 mb-1.5 uppercase tracking-wide">
          Headline
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Keep a ledger of everything you learn."
          className="w-full border border-ink/20 rounded-sm px-4 py-2.5 bg-surface text-ink focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs text-ink/50 mb-1.5 uppercase tracking-wide">
          Subheadline
        </label>
        <textarea
          value={subTitle}
          onChange={(e) => setSubTitle(e.target.value)}
          rows={3}
          placeholder="Courses, progress, and proof of work — recorded in one place."
          className="w-full border border-ink/20 rounded-sm px-4 py-2.5 bg-surface text-ink focus:outline-none focus:border-gold transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs text-ink/50 mb-1.5 uppercase tracking-wide">
          Banner image (optional)
        </label>
        {existingImageUrl && !image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={existingImageUrl}
            alt="Current banner"
            className="mb-3 w-64 aspect-video object-cover rounded-sm border border-ink/10"
          />
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt="New banner preview"
            className="mt-3 w-64 aspect-video object-cover rounded-sm border border-ink/10"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={isCreating || isEditing}
        className="self-start px-5 py-2.5 rounded-sm bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
      >
        {isCreating || isEditing ? "Saving…" : "Save banner"}
      </button>
    </form>
  );
}

// ------------------- FAQ -------------------

function FaqEditor() {
  const { data, isLoading } = useGetLayoutQuery("FAQ");
  const [createLayout, { isLoading: isCreating }] = useCreateLayoutMutation();
  const [editLayout, { isLoading: isEditing }] = useEditLayoutMutation();

  const [items, setItems] = useState<FaqItem[]>([{ question: "", answer: "" }]);
  const [loaded, setLoaded] = useState(false);
  const exists = !!data?.layout;

  useEffect(() => {
    if (loaded || isLoading) return;
    const faq = data?.layout?.faq;
    if (faq?.length) {
      setItems(faq.map((f: any) => ({ question: f.question, answer: f.answer })));
    }
    setLoaded(true);
  }, [data, isLoading, loaded]);

  const updateItem = (i: number, field: keyof FaqItem, value: string) => {
    const updated = [...items];
    updated[i] = { ...updated[i], [field]: value };
    setItems(updated);
  };

  const addItem = () => setItems([...items, { question: "", answer: "" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = items.filter((f) => f.question.trim() && f.answer.trim());

    try {
      const body = { type: "FAQ", faq: cleaned };
      if (exists) {
        await editLayout(body).unwrap();
      } else {
        await createLayout(body).unwrap();
      }
      toast.success("FAQ updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save FAQ");
    }
  };

  if (isLoading) return <p className="text-ink/50">Loading…</p>;

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-2xl">
      {items.map((item, i) => (
        <div
          key={i}
          className="border border-ink/10 rounded-sm p-4 bg-surface flex flex-col gap-3"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-ink/60">
              Question {i + 1}
            </span>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="text-ink/40 hover:text-ink text-sm"
              >
                Remove
              </button>
            )}
          </div>
          <input
            type="text"
            placeholder="Question"
            value={item.question}
            onChange={(e) => updateItem(i, "question", e.target.value)}
            className="border border-ink/20 rounded-sm px-3 py-2 bg-surface-2 text-ink focus:outline-none focus:border-gold transition-colors"
          />
          <textarea
            placeholder="Answer"
            value={item.answer}
            onChange={(e) => updateItem(i, "answer", e.target.value)}
            rows={2}
            className="border border-ink/20 rounded-sm px-3 py-2 bg-surface-2 text-ink focus:outline-none focus:border-gold transition-colors"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="self-start text-sm text-ledger hover:underline"
      >
        + Add question
      </button>

      <button
        type="submit"
        disabled={isCreating || isEditing}
        className="self-start px-5 py-2.5 rounded-sm bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
      >
        {isCreating || isEditing ? "Saving…" : "Save FAQ"}
      </button>
    </form>
  );
}

// ------------------- Categories -------------------

function CategoriesEditor() {
  const { data, isLoading } = useGetLayoutQuery("Categories");
  const [createLayout, { isLoading: isCreating }] = useCreateLayoutMutation();
  const [editLayout, { isLoading: isEditing }] = useEditLayoutMutation();

  const [items, setItems] = useState<CategoryItem[]>([{ title: "" }]);
  const [loaded, setLoaded] = useState(false);
  const exists = !!data?.layout;

  useEffect(() => {
    if (loaded || isLoading) return;
    const categories = data?.layout?.categories;
    if (categories?.length) {
      setItems(categories.map((c: any) => ({ title: c.title })));
    }
    setLoaded(true);
  }, [data, isLoading, loaded]);

  const updateItem = (i: number, value: string) => {
    const updated = [...items];
    updated[i] = { title: value };
    setItems(updated);
  };

  const addItem = () => setItems([...items, { title: "" }]);
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = items.filter((c) => c.title.trim());

    try {
      const body = { type: "Categories", categories: cleaned };
      if (exists) {
        await editLayout(body).unwrap();
      } else {
        await createLayout(body).unwrap();
      }
      toast.success("Categories updated");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save categories");
    }
  };

  if (isLoading) return <p className="text-ink/50">Loading…</p>;

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3 max-w-md">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            placeholder={`Category ${i + 1} (e.g. Web Development)`}
            value={item.title}
            onChange={(e) => updateItem(i, e.target.value)}
            className="flex-1 border border-ink/20 rounded-sm px-4 py-2.5 bg-surface text-ink focus:outline-none focus:border-gold transition-colors"
          />
          {items.length > 1 && (
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="px-3 text-ink/40 hover:text-ink"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="self-start text-sm text-ledger hover:underline"
      >
        + Add category
      </button>

      <button
        type="submit"
        disabled={isCreating || isEditing}
        className="self-start mt-2 px-5 py-2.5 rounded-sm bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
      >
        {isCreating || isEditing ? "Saving…" : "Save categories"}
      </button>
    </form>
  );
}
