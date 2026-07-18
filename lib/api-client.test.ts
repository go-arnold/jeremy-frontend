import { describe, expect, it } from "vitest";
import { extractErrorMessage } from "./api-client";

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
