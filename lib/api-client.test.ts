import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch, extractErrorMessage } from "./api-client";

describe("extractErrorMessage", () => {
  it("returns a fallback for falsy input", () => {
    expect(extractErrorMessage(null)).toBe("Une erreur inconnue est survenue");
  });

  it("passes through a plain string", () => {
    expect(extractErrorMessage("Identifiants invalides")).toBe("Identifiants invalides");
  });

  it("extracts Django REST's `detail` field", () => {
    expect(extractErrorMessage({ detail: "Not found." })).toBe("Not found.");
  });

  it("extracts the first message from `non_field_errors`", () => {
    expect(extractErrorMessage({ non_field_errors: ["Unable to log in."] })).toBe(
      "Unable to log in."
    );
  });

  it("recurses into the first element of an array response", () => {
    expect(extractErrorMessage([{ detail: "Bad request." }])).toBe("Bad request.");
  });

  it("falls back to a field-specific message for unknown shapes", () => {
    expect(extractErrorMessage({ email: ["This field is required."] })).toBe(
      "email: This field is required."
    );
  });
});

describe("apiFetch cache behavior", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    vi.restoreAllMocks();
    if (originalWindow === undefined) {
      Reflect.deleteProperty(globalThis, "window");
    } else {
      Object.defineProperty(globalThis, "window", {
        value: originalWindow,
        writable: true,
        configurable: true,
      });
    }
  });

  it("caches GET responses on server-side calls", async () => {
    Reflect.deleteProperty(globalThis, "window");
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      );

    await apiFetch<{ ok: boolean }>("/api/v1/cache-server-test");
    await apiFetch<{ ok: boolean }>("/api/v1/cache-server-test");

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not use the server in-memory cache in browser mode", async () => {
    Object.defineProperty(globalThis, "window", {
      value: { location: { href: "http://localhost" } },
      writable: true,
      configurable: true,
    });

    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async () =>
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      );

    await apiFetch<{ ok: boolean }>("/api/v1/cache-client-test");
    await apiFetch<{ ok: boolean }>("/api/v1/cache-client-test");

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
