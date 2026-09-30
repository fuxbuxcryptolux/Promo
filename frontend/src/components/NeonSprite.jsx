import React from "react";

const COLORS = {
  knight: "#00F3FF", rogue: "#39FF14", rouge: "#39FF14", mage: "#A855F7", archer: "#FFE600",
  "archer-tower": "#39FF14", catapult: "#FF6600", "wizard-tower": "#A855F7", ballista: "#00F3FF",
  ghost: "#FF007F", slime: "#39FF14", goblin: "#FFE600", skeleton: "#E2E8F0", zombie: "#39FF14",
  orc: "#FF6600", ghoul: "#A855F7", reaper: "#A855F7", lieutenant: "#FF3366",
  demon: "#FF0055", necromancer: "#A855F7", behemoth: "#39FF14"
};

function normalize(kind = "") {
  const k = String(kind).toLowerCase().replace(/\s+/g, "-");
  if (k === "rogue") return "rogue";
  if (k.includes("archer") && k.includes("tower")) return "archer-tower";
  if (k.includes("wizard") && k.includes("tower")) return "wizard-tower";
  if (k.includes("catapult")) return "catapult";
  if (k.includes("ballista")) return "ballista";
  if (k.includes("knight")) return "knight";
  if (k.includes("mage")) return "mage";
  if (k.includes("rouge")) return "rouge";
  if (k.includes("archer")) return "archer";
  if (k.includes("ghost")) return "ghost";
  if (k.includes("slime")) return "slime";
  if (k.includes("goblin")) return "goblin";
  if (k.includes("skeleton")) return "skeleton";
  if (k.includes("zombie")) return "zombie";
  if (k.includes("orc")) return "orc";
  if (k.includes("ghoul")) return "ghoul";
  if (k.includes("reaper")) return "reaper";
  if (k.includes("lieutenant")) return "lieutenant";
  if (k.includes("necromancer")) return "necromancer";
  if (k.includes("behemoth")) return "behemoth";
  if (k.includes("demon")) return "demon";
  return k;
}

export function NeonSprite({ kind, color, size = "md", className = "", label = false }) {
  const k = normalize(kind);
  const tint = color || COLORS[k] || "#00F3FF";
  return (
    <span className={`neon-sprite neon-sprite-${size} neon-sprite-${k} ${className}`} style={{ "--sprite-color": tint }}
      aria-label={label ? kind : undefined} role={label ? "img" : undefined}>
      <span className="neon-sprite-shadow" />
      <span className="neon-sprite-body" />
      <span className="neon-sprite-head" />
      <span className="neon-sprite-detail neon-sprite-detail-a" />
      <span className="neon-sprite-detail neon-sprite-detail-b" />
      <span className="neon-sprite-weapon" />
      <span className="neon-sprite-core" />
    </span>
  );
}
