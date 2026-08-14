"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useAddQuestionMutation,
  useAddAnswerMutation,
} from "@/redux/features/courses/coursesApi";

interface QASectionProps {
  courseId: string;
  contentId: string;
  questions: any[];
  onUpdated: () => void;
}

function Avatar({ name }: { name?: string }) {
  return (
    <span className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-xs font-display text-gold flex-shrink-0">
      {name?.[0]?.toUpperCase() || "?"}
    </span>
  );
}

export default function QASection({
  courseId,
  contentId,
  questions,
  onUpdated,
}: QASectionProps) {
  const [addQuestion, { isLoading: isAsking }] = useAddQuestionMutation();
  const [addAnswer, { isLoading: isReplying }] = useAddAnswerMutation();

  const [newQuestion, setNewQuestion] = useState("");
  const [openReplyId, setOpenReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    try {
      await addQuestion({
        question: newQuestion,
        courseId,
        contentId,
      }).unwrap();
      setNewQuestion("");
      toast.success("Question posted");
      onUpdated();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to post question");
    }
  };

  const handleReply = async (questionId: string) => {
    if (!replyText.trim()) return;

    try {
      await addAnswer({
        answer: replyText,
        courseId,
        contentId,
        questionId,
      }).unwrap();
      setReplyText("");
      setOpenReplyId(null);
      toast.success("Reply posted");
      onUpdated();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to post reply");
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl text-ink mb-5">
        Questions{questions.length > 0 ? ` (${questions.length})` : ""}
      </h2>

      {questions.length > 0 ? (
        <div className="flex flex-col gap-6 mb-8">
          {questions.map((q: any) => (
            <div key={q._id} className="border-b border-ink/10 pb-6 last:border-b-0">
              <div className="flex gap-3">
                <Avatar name={q.user?.name} />
                <div className="flex-1">
                  <p className="text-sm text-ink font-medium mb-1">
                    {q.user?.name || "Anonymous"}
                  </p>
                  <p className="text-ink/70 leading-relaxed">{q.question}</p>

                  {/* Replies */}
                  {q.questionReplies?.length > 0 && (
                    <div className="mt-4 ml-2 pl-4 border-l border-ink/10 flex flex-col gap-4">
                      {q.questionReplies.map((reply: any, i: number) => (
                        <div key={reply._id || i} className="flex gap-3">
                          <Avatar name={reply.user?.name} />
                          <div>
                            <p className="text-sm text-ink font-medium mb-1">
                              {reply.user?.name || "Anonymous"}
                            </p>
                            <p className="text-ink/70 leading-relaxed">
                              {reply.answer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply toggle / form */}
                  {openReplyId === q._id ? (
                    <div className="mt-4 ml-2 flex flex-col gap-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply…"
                        rows={2}
                        autoFocus
                        className="border border-ink/20 rounded-sm px-3 py-2 bg-surface-2 text-ink text-sm placeholder:text-ink/40 focus:outline-none focus:border-gold transition-colors"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleReply(q._id)}
                          disabled={isReplying}
                          className="px-4 py-1.5 rounded-sm bg-ledger text-paper text-xs font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
                        >
                          {isReplying ? "Posting…" : "Post reply"}
                        </button>
                        <button
                          onClick={() => {
                            setOpenReplyId(null);
                            setReplyText("");
                          }}
                          className="text-xs text-ink/50 hover:text-ink"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setOpenReplyId(q._id);
                        setReplyText("");
                      }}
                      className="mt-3 text-xs text-ledger hover:underline"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-ink/50 text-sm mb-8">
          No questions yet — be the first to ask.
        </p>
      )}

      {/* Ask a question */}
      <form onSubmit={handleAskQuestion} className="flex flex-col gap-3">
        <textarea
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask a question about this lesson…"
          rows={3}
          className="border border-ink/20 rounded-sm px-4 py-3 bg-surface-2 text-ink placeholder:text-ink/40 focus:outline-none focus:border-gold transition-colors"
        />
        <button
          type="submit"
          disabled={isAsking}
          className="self-start px-5 py-2.5 rounded-sm bg-ledger text-paper text-sm font-medium hover:bg-ledger-dark transition-colors disabled:opacity-60"
        >
          {isAsking ? "Posting…" : "Ask question"}
        </button>
      </form>
    </div>
  );
}
