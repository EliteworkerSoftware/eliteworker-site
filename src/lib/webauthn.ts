// A passkey is tied to the exact domain (Relying Party ID) it was registered
// on — one made while testing on localhost will never work on the real
// domain and vice versa, so this switches based on environment rather than
// being a single hardcoded value.
export function getRpID(): string {
  return process.env.NODE_ENV === "production" ? "eliteworker.com" : "localhost";
}

export function getOrigin(): string {
  return process.env.NODE_ENV === "production" ? "https://www.eliteworker.com" : "http://localhost:3000";
}

export const RP_NAME = "EliteWorker Admin";
