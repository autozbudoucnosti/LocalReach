import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { LOCAL_BUSINESS_MOCKUPS } from "../lib/mockup-data";

const DEFAULT_PORT = 3123;
const DEFAULT_HOST = "127.0.0.1";
const EXPORT_HEIGHT = 1180;
const VIEWPORT_WIDTH = 1520;
const VIEWPORT_HEIGHT = 1600;

function getWorkspaceRoot() {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
}

async function waitForServer(url: string, timeoutMs = 45_000) {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // Server is still booting.
    }

    await new Promise((resolve) => setTimeout(resolve, 750));
  }

  throw new Error(`Timed out waiting for ${url}`);
}

function startLocalServer(rootDir: string, port: number) {
  const child = spawn(
    "npx",
    ["next", "dev", "--webpack", "--hostname", DEFAULT_HOST, "--port", String(port)],
    {
      cwd: rootDir,
      env: {
        ...process.env,
        NODE_ENV: "development",
      },
      stdio: "pipe",
    },
  );

  child.stdout.on("data", (chunk) => {
    process.stdout.write(chunk);
  });
  child.stderr.on("data", (chunk) => {
    process.stderr.write(chunk);
  });

  return child;
}

function stopLocalServer(child: ChildProcessWithoutNullStreams | null) {
  if (!child || child.killed) {
    return;
  }

  child.kill("SIGTERM");
}

async function exportMockups() {
  const rootDir = getWorkspaceRoot();
  const outputDir = path.join(rootDir, "public", "templates");
  await mkdir(outputDir, { recursive: true });

  const explicitBaseUrl = process.env.MOCKUP_EXPORT_BASE_URL?.trim();
  const port = Number(process.env.MOCKUP_EXPORT_PORT ?? DEFAULT_PORT);
  const baseUrl = explicitBaseUrl || `http://${DEFAULT_HOST}:${port}`;

  let serverProcess: ChildProcessWithoutNullStreams | null = null;

  if (!explicitBaseUrl) {
    serverProcess = startLocalServer(rootDir, port);
    await waitForServer(`${baseUrl}/templates`);
  }

  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: {
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
      },
      deviceScaleFactor: 2,
    });

    await page.emulateMedia({ colorScheme: "light" });

    for (const mockup of LOCAL_BUSINESS_MOCKUPS) {
      const url = `${baseUrl}/mockups/${mockup.slug}`;
      const outputPath = path.join(outputDir, `${mockup.slug}.png`);

      console.log(`Exporting ${url}`);
      await page.goto(url, { waitUntil: "networkidle" });

      const canvas = page.locator("[data-mockup-canvas]");
      await canvas.waitFor({ state: "visible" });
      await canvas.scrollIntoViewIfNeeded();

      const boundingBox = await canvas.boundingBox();
      if (!boundingBox) {
        throw new Error(`Could not measure mockup canvas for ${mockup.slug}`);
      }

      await page.screenshot({
        path: outputPath,
        animations: "disabled",
        clip: {
          x: Math.max(0, Math.floor(boundingBox.x)),
          y: Math.max(0, Math.floor(boundingBox.y)),
          width: Math.min(VIEWPORT_WIDTH - 40, Math.floor(boundingBox.width)),
          height: Math.min(EXPORT_HEIGHT, Math.floor(boundingBox.height)),
        },
      });
    }
  } finally {
    await browser.close();
    stopLocalServer(serverProcess);
  }
}

exportMockups().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
