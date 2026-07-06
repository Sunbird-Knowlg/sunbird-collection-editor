#!/usr/bin/env node
/**
 * Copies the Sunbird web-component player assets (pdf / video / epub / quml)
 * from node_modules into public/assets so the dev server (and any static
 * build) serves them at /assets/sunbird-*-player.js — mirroring what the
 * Angular app does via angular.json `assets`/`scripts`.
 *
 * Runs automatically on `predev` and `prebuild`.
 */
import { existsSync, mkdirSync, cpSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// node_modules is hoisted to the monorepo root
const nodeModules = resolve(projectRoot, '../../node_modules');
const destDir = resolve(projectRoot, 'public/assets');

// Flattened players (pdf/video/epub) — served at /assets/sunbird-*-player.js.
// Their contents share the /assets root as angular.json does.
const FLAT_PLAYERS = [
  '@project-sunbird/sunbird-pdf-player-web-component/assets/pdf-player',
  '@project-sunbird/sunbird-video-player-web-component/assets/video-player',
  '@project-sunbird/sunbird-epub-player-web-component/assets/epub-player',
];

// QuML is copied into its own subdir so its styles.css does not collide with
// the other players' styles.css when flattened. Served at
// /assets/quml-player/sunbird-quml-player.js and /assets/quml-player/styles.css.
const SUBDIR_PLAYERS = [
  {
    rel: '@project-sunbird/sunbird-quml-player-web-component/assets/quml-player',
    dest: resolve(destDir, 'quml-player'),
  },
];

mkdirSync(destDir, { recursive: true });

let copied = 0;
const total = FLAT_PLAYERS.length + SUBDIR_PLAYERS.length;
for (const rel of FLAT_PLAYERS) {
  const src = resolve(nodeModules, rel);
  if (!existsSync(src)) {
    console.warn(`[copy-player-assets] skip (not found): ${rel}`);
    continue;
  }
  cpSync(src, destDir, { recursive: true });
  copied++;
  console.log(`[copy-player-assets] copied ${rel} -> public/assets/`);
}
for (const { rel, dest } of SUBDIR_PLAYERS) {
  const src = resolve(nodeModules, rel);
  if (!existsSync(src)) {
    console.warn(`[copy-player-assets] skip (not found): ${rel}`);
    continue;
  }
  mkdirSync(dest, { recursive: true });
  cpSync(src, dest, { recursive: true });
  copied++;
  console.log(`[copy-player-assets] copied ${rel} -> ${dest}/`);
}

console.log(`[copy-player-assets] done (${copied}/${total} players)`);
