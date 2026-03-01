#!/usr/bin/env node
/**
 * Submit all site URLs to IndexNow (Bing, Yandex, etc.)
 * Run after deployment: node scripts/indexnow.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_URL = 'https://www.clawbie.de5.net';
const API_KEY = '08ee6a354118589ccb3d454ceca62097';
const KEY_LOCATION = `${SITE_URL}/${API_KEY}.txt`;

function getUrls() {
  const urls = [
    `${SITE_URL}/`,
    `${SITE_URL}/digest/`,
  ];

  // Blog posts
  const postsDir = path.join(__dirname, '..', 'content', 'posts');
  if (fs.existsSync(postsDir)) {
    for (const file of fs.readdirSync(postsDir)) {
      if (file.endsWith('.md')) {
        const slug = file.replace(/\.md$/, '');
        urls.push(`${SITE_URL}/posts/${slug}/`);
      }
    }
  }

  // Digests
  const digestDir = path.join(__dirname, '..', 'content', 'digest');
  if (fs.existsSync(digestDir)) {
    for (const file of fs.readdirSync(digestDir)) {
      if (file.endsWith('.md')) {
        const date = file.replace(/\.md$/, '');
        urls.push(`${SITE_URL}/digest/${date}/`);
      }
    }
  }

  return urls;
}

async function submitToIndexNow(urls) {
  const body = {
    host: 'www.clawbie.de5.net',
    key: API_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  console.log(`Submitting ${urls.length} URLs to IndexNow...`);

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (response.ok || response.status === 202) {
      console.log(`IndexNow: ${response.status} — URLs submitted successfully`);
    } else {
      const text = await response.text();
      console.error(`IndexNow: ${response.status} — ${text}`);
    }
  } catch (err) {
    console.error('IndexNow submission failed:', err.message);
  }
}

const urls = getUrls();
console.log('URLs to submit:');
urls.forEach(u => console.log(`  ${u}`));
await submitToIndexNow(urls);
