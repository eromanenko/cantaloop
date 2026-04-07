/**
 * Avatar map — Vite resolves each import to a hashed URL (or inlined base64).
 * Usage:  import { getAvatar } from './avatars';
 *         <img src={getAvatar('Hook')} />
 */

import alice from "../assets/avatars/alice.png";
import barkeeper from "../assets/avatars/barkeeper.png";
import bouncer from "../assets/avatars/bouncer.png";
import fly from "../assets/avatars/fly.png";
import girl from "../assets/avatars/girl.png";
import guard from "../assets/avatars/guard.png";
import hook from "../assets/avatars/hook.png";
import mike from "../assets/avatars/mike.png";
import secretary from "../assets/avatars/secretary.png";
import woman from "../assets/avatars/woman.png";

const avatars = {
  alice,
  barkeeper,
  bouncer,
  fly,
  girl,
  guard,
  hook,
  mike,
  secretary,
  woman,
};

/**
 * Returns the imported avatar URL for a character name.
 * Falls back to a simple SVG data-URI with the character's initial.
 */
export const getAvatar = (personName) => {
  const key = personName?.toLowerCase().trim();
  if (key && avatars[key]) return avatars[key];

  // Fallback: generate a tiny inline SVG avatar with the first letter
  const letter = (personName || "?")[0].toUpperCase();
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">` +
      `<rect width="64" height="64" rx="32" fill="%23cbd5e1"/>` +
      `<text x="32" y="38" text-anchor="middle" fill="%2364748b" font-family="sans-serif" font-size="28" font-weight="700">${letter}</text>` +
      `</svg>`
  )}`;
};
