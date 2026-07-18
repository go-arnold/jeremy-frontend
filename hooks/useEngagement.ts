"use client";

import { useCallback, useState } from "react";

export interface EngagementComment {
  id: string;
  username: string;
  handle?: string;
  avatarUrl: string;
  content: string;
  createdAt: string;
  parent?: string | number | null;
}

interface UseEngagementOptions {
  initialLiked?: boolean;
  initialLikeCount?: number;
  initialCommentCount?: number;
  initialSaved?: boolean;
}

// Response shape is inherently dynamic — different engagement mixin endpoints return different
// fields (see the function doc comment below) — the index signature keeps property access
// possible without reintroducing `any`.
interface ProxyResponse {
  [key: string]: unknown;
}

async function proxyFetch(endpoint: string, method: string, body?: unknown): Promise<ProxyResponse> {
  const response = await fetch(`/api/proxy?endpoint=${encodeURIComponent(endpoint)}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || data.detail || `${method} ${endpoint} failed`);
  }
  return data;
}

function mapComment(c: Record<string, unknown>): EngagementComment {
  return {
    id: c.id?.toString() || Math.random().toString(),
    username: (c.username as string) || "Membre",
    handle: c.handle as string | undefined,
    avatarUrl: (c.avatar_url as string) || "",
    content: (c.content as string) || "",
    createdAt: (c.created_at as string) || "",
    parent: c.parent as string | number | null | undefined,
  };
}

/**
 * Client for the backend's generic engagement actions
 * (`apps/engagement/mixins.py::EngagementActionsMixin`), mounted on every engagement-enabled
 * ViewSet as `/<resourceType>/{id}/{like,comments,share,save}/`.
 *
 * `resourceType` is the URL path segment, e.g. `"community/posts"` or `"webtv/videos"`.
 *
 * `like` response shape is auto-detected: most resources return the mixin's generic
 * `{liked, like_count}`; `apps/community`'s `CommunityPostViewSet` overrides `like` with its own
 * `PostLike`-model-backed toggle returning `{"action": "liked"|"unliked"}` instead (no count) —
 * there is no separate `/unlike/` route for either shape, `like` is always a POST toggle.
 */
export function useEngagement(
  resourceType: string,
  id: string | number,
  options: UseEngagementOptions = {}
) {
  const base = `/api/v1/${resourceType}/${id}`;

  const [liked, setLiked] = useState(!!options.initialLiked);
  const [likeCount, setLikeCount] = useState(options.initialLikeCount || 0);
  const [commentCount, setCommentCount] = useState(options.initialCommentCount || 0);
  const [comments, setComments] = useState<EngagementComment[]>([]);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [saved, setSaved] = useState(!!options.initialSaved);
  const [shareCount, setShareCount] = useState(0);

  const toggleLike = useCallback(async () => {
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikeCount((c) => c + (wasLiked ? -1 : 1));
    try {
      const data = await proxyFetch(`${base}/like/`, "POST");
      if (typeof data.liked === "boolean") {
        setLiked(data.liked);
        if (typeof data.like_count === "number") setLikeCount(data.like_count);
      } else if (typeof data.action === "string") {
        setLiked(data.action === "liked");
      }
    } catch {
      setLiked(wasLiked);
      setLikeCount((c) => c + (wasLiked ? 1 : -1));
    }
  }, [base, liked]);

  const loadComments = useCallback(async () => {
    setLoadingComments(true);
    try {
      const data = await proxyFetch(`${base}/comments/`, "GET");
      const results = (data.results as Record<string, unknown>[]) || (Array.isArray(data) ? data : []);
      setComments(results.map(mapComment));
      if (typeof data.count === "number") setCommentCount(data.count);
      setCommentsLoaded(true);
    } finally {
      setLoadingComments(false);
    }
  }, [base]);

  const postComment = useCallback(
    async (content: string) => {
      const created = await proxyFetch(`${base}/comments/`, "POST", { content });
      setComments((prev) => [mapComment(created), ...prev]);
      setCommentCount((c) => c + 1);
    },
    [base]
  );

  const share = useCallback(async () => {
    const data = await proxyFetch(`${base}/share/`, "POST");
    if (typeof data.share_count === "number") setShareCount(data.share_count);
  }, [base]);

  const toggleSave = useCallback(async () => {
    const wasSaved = saved;
    setSaved(!wasSaved);
    try {
      const data = await proxyFetch(`${base}/save/`, "POST");
      if (typeof data.saved === "boolean") setSaved(data.saved);
    } catch {
      setSaved(wasSaved);
    }
  }, [base, saved]);

  return {
    liked,
    likeCount,
    toggleLike,
    comments,
    commentCount,
    commentsLoaded,
    loadingComments,
    loadComments,
    postComment,
    shareCount,
    share,
    saved,
    toggleSave,
  };
}
