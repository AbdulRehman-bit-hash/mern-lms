"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  useGetAdminAllCoursesQuery,
  useEditCourseMutation,
} from "@/redux/features/courses/coursesApi";

interface ListItem {
  title: string;
}

interface VideoSection {
  title: string;
  description: string;
  videoUrl: string;
  videoSection: string;
  videoLength: string;
}

export default function EditCoursePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();

  // The public getAllCourses endpoint strips video URLs / questions, so we
  // pull from the admin endpoint (full data) and find this course by id.
  const { data, isLoading: isFetching } = useGetAdminAllCoursesQuery({});
  const [editCourse, { isLoading: isSaving }] = useEditCourseMutation();

  const [loaded, setLoaded] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [tags, setTags] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [demoUrl, setDemoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState<string>("");
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState<string>("");

  const [benefits, setBenefits] = useState<ListItem[]>([{ title: "" }]);
  const [prerequisites, setPrerequisites] = useState<ListItem[]>([
    { title: "" },
  ]);
  const [videoSections, setVideoSections] = useState<VideoSection[]>([
    {
      title: "",
      description: "",
      videoUrl: "",
      videoSection: "",
      videoLength: "",
    },
  ]);

  // ------------------- Pre-fill form once the course is found -------------------

  useEffect(() => {
    if (loaded || !data?.courses) return;
    const course = data.courses.find((c: any) => c._id === id);
    if (!course) return;

    setName(course.name || "");
    setDescription(course.description || "");
    setPrice(String(course.price ?? ""));
    setEstimatedPrice(
      course.estimatedPrice ? String(course.estimatedPrice) : ""
    );
    setTags(course.tags || "");
    setLevel(course.level || "Beginner");
    setDemoUrl(course.demoUrl || "");
    setExistingThumbnailUrl(course.thumbnail?.url || "");

    if (course.benefits?.length) {
      setBenefits(course.benefits.map((b: any) => ({ title: b.title })));
    }
    if (course.prerequisites?.length) {
      setPrerequisites(
        course.prerequisites.map((p: any) => ({ title: p.title }))
      );
    }
    if (course.courseData?.length) {
      setVideoSections(
        course.courseData.map((v: any) => ({
          title: v.title || "",
          description: v.description || "",
          videoUrl: v.videoUrl || "",
          videoSection: v.videoSection || "",
          videoLength: String(v.videoLength ?? ""),
        }))
      );
    }

    setLoaded(true);
  }, [data, id, loaded]);

  // ------------------- Thumbnail upload -------------------

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setThumbnail(reader.result as string);
    reader.readAsDataURL(file);
  };

  // ------------------- Dynamic list helpers -------------------

  const updateListItem = (
    list: ListItem[],
    setList: (v: ListItem[]) => void,
    index: number,
    value: string
  ) => {
    const updated = [...list];
    updated[index] = { title: value };
    setList(updated);
  };

  const addListItem = (list: ListItem[], setList: (v: ListItem[]) => void) => {
    setList([...list, { title: "" }]);
  };

  const removeListItem = (
    list: ListItem[],
    setList: (v: ListItem[]) => void,
    index: number
  ) => {
    setList(list.filter((_, i) => i !== index));
  };

  const updateVideoSection = (
    index: number,
    field: keyof VideoSection,
    value: string
  ) => {
    const updated = [...videoSections];
    updated[index] = { ...updated[index], [field]: value };
    setVideoSections(updated);
  };

  const addVideoSection = () => {
    setVideoSections([
      ...videoSections,
      {
        title: "",
        description: "",
        videoUrl: "",
        videoSection: "",
        videoLength: "",
      },
    ]);
  };

  const removeVideoSection = (index: number) => {
    setVideoSections(videoSections.filter((_, i) => i !== index));
  };

  // ------------------- Submit -------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !price || !demoUrl) {
      toast.error("Please fill in name, description, price, and demo URL");
      return;
    }

    const data: any = {
      name,
      description,
      price: Number(price),
      estimatedPrice: estimatedPrice ? Number(estimatedPrice) : undefined,
      tags,
      level,
      demoUrl,
      benefits: benefits.filter((b) => b.title.trim() !== ""),
      prerequisites: prerequisites.filter((p) => p.title.trim() !== ""),
      courseData: videoSections
        .filter((v) => v.title.trim() !== "")
        .map((v) => ({
          title: v.title,
          description: v.description,
          videoUrl: v.videoUrl,
          videoSection: v.videoSection || "Main Content",
          videoLength: Number(v.videoLength) || 0,
          links: [],
        })),
    };

    // New upload takes priority; otherwise keep the existing thumbnail as-is
    // (the backend only re-uploads to Cloudinary if this doesn't start with
    // "https", so passing the existing URL through leaves it untouched).
    if (thumbnail) {
      data.thumbnail = thumbnail;
    } else if (existingThumbnailUrl) {
      data.thumbnail = existingThumbnailUrl;
    }

    try {
      await editCourse({ id, data }).unwrap();
      toast.success("Course updated successfully");
      router.push("/admin/courses");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update course");
    }
  };

  if (isFetching && !loaded) {
    return <p className="text-ink/50">Loading course…</p>;
  }

  if (!isFetching && !loaded) {
    return <p className="text-ink/50">Course not found.</p>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-ink mb-8">Edit course</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-10">
        {/* Basic info */}
        <section className="flex flex-col gap-4">
          <h2 className="font-display text-xl text-ink">Basic information</h2>

          <input
            type="text"
            placeholder="Course name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-ink/20 rounded-sm px-4 py-3 bg-surface focus:outline-none focus:border-ledger"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="border border-ink/20 rounded-sm px-4 py-3 bg-surface focus:outline-none focus:border-ledger"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="Price ($)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border border-ink/20 rounded-sm px-4 py-3 bg-surface focus:outline-none focus:border-ledger"
            />
            <input
              type="number"
              placeholder="Estimated / original price ($)"
              value={estimatedPrice}
              onChange={(e) => setEstimatedPrice(e.target.value)}
              className="border border-ink/20 rounded-sm px-4 py-3 bg-surface focus:outline-none focus:border-ledger"
            />
          </div>

          <input
            type="text"
            placeholder="Tags (comma separated, e.g. react, node, mongodb)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="border border-ink/20 rounded-sm px-4 py-3 bg-surface focus:outline-none focus:border-ledger"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="border border-ink/20 rounded-sm px-4 py-3 bg-surface focus:outline-none focus:border-ledger"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
            <input
              type="text"
              placeholder="Demo video URL"
              value={demoUrl}
              onChange={(e) => setDemoUrl(e.target.value)}
              className="border border-ink/20 rounded-sm px-4 py-3 bg-surface focus:outline-none focus:border-ledger"
            />
          </div>

          <div>
            <label className="block text-sm text-ink/60 mb-2">
              Thumbnail image
            </label>
            {existingThumbnailUrl && !thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={existingThumbnailUrl}
                alt="Current thumbnail"
                className="mb-3 w-48 aspect-video object-cover rounded-sm border border-ink/10"
              />
            )}
            <input type="file" accept="image/*" onChange={handleThumbnailChange} />
            {thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumbnail}
                alt="New preview"
                className="mt-3 w-48 aspect-video object-cover rounded-sm border border-ink/10"
              />
            )}
          </div>
        </section>

        {/* Benefits */}
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl text-ink">What you'll learn</h2>
          {benefits.map((b, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                placeholder={`Benefit ${i + 1}`}
                value={b.title}
                onChange={(e) =>
                  updateListItem(benefits, setBenefits, i, e.target.value)
                }
                className="flex-1 border border-ink/20 rounded-sm px-4 py-2.5 bg-surface focus:outline-none focus:border-ledger"
              />
              {benefits.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeListItem(benefits, setBenefits, i)}
                  className="px-3 text-ink/40 hover:text-ink"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem(benefits, setBenefits)}
            className="self-start text-sm text-ledger hover:underline"
          >
            + Add benefit
          </button>
        </section>

        {/* Prerequisites */}
        <section className="flex flex-col gap-3">
          <h2 className="font-display text-xl text-ink">Prerequisites</h2>
          {prerequisites.map((p, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                placeholder={`Prerequisite ${i + 1}`}
                value={p.title}
                onChange={(e) =>
                  updateListItem(
                    prerequisites,
                    setPrerequisites,
                    i,
                    e.target.value
                  )
                }
                className="flex-1 border border-ink/20 rounded-sm px-4 py-2.5 bg-surface focus:outline-none focus:border-ledger"
              />
              {prerequisites.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    removeListItem(prerequisites, setPrerequisites, i)
                  }
                  className="px-3 text-ink/40 hover:text-ink"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addListItem(prerequisites, setPrerequisites)}
            className="self-start text-sm text-ledger hover:underline"
          >
            + Add prerequisite
          </button>
        </section>

        {/* Course content / video sections */}
        <section className="flex flex-col gap-5">
          <h2 className="font-display text-xl text-ink">Course content</h2>
          {videoSections.map((v, i) => (
            <div
              key={i}
              className="border border-ink/10 rounded-sm p-4 bg-surface flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-ink/60">
                  Video {i + 1}
                </span>
                {videoSections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVideoSection(i)}
                    className="text-ink/40 hover:text-ink text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <input
                type="text"
                placeholder="Video title"
                value={v.title}
                onChange={(e) =>
                  updateVideoSection(i, "title", e.target.value)
                }
                className="border border-ink/20 rounded-sm px-3 py-2 bg-surface focus:outline-none focus:border-ledger"
              />

              <input
                type="text"
                placeholder="Section name (e.g. Introduction, Backend Setup)"
                value={v.videoSection}
                onChange={(e) =>
                  updateVideoSection(i, "videoSection", e.target.value)
                }
                className="border border-ink/20 rounded-sm px-3 py-2 bg-surface focus:outline-none focus:border-ledger"
              />

              <textarea
                placeholder="Video description"
                value={v.description}
                onChange={(e) =>
                  updateVideoSection(i, "description", e.target.value)
                }
                rows={2}
                className="border border-ink/20 rounded-sm px-3 py-2 bg-surface focus:outline-none focus:border-ledger"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Video URL"
                  value={v.videoUrl}
                  onChange={(e) =>
                    updateVideoSection(i, "videoUrl", e.target.value)
                  }
                  className="border border-ink/20 rounded-sm px-3 py-2 bg-surface focus:outline-none focus:border-ledger"
                />
                <input
                  type="number"
                  placeholder="Length (minutes)"
                  value={v.videoLength}
                  onChange={(e) =>
                    updateVideoSection(i, "videoLength", e.target.value)
                  }
                  className="border border-ink/20 rounded-sm px-3 py-2 bg-surface focus:outline-none focus:border-ledger"
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addVideoSection}
            className="self-start text-sm text-ledger hover:underline"
          >
            + Add video
          </button>
        </section>

        <button
          type="submit"
          disabled={isSaving}
          className="bg-ledger text-paper py-3 rounded-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
        >
          {isSaving ? "Saving changes…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
