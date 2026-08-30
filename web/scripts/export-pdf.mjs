import { spawn } from "node:child_process";
import { access, mkdir, rm, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.resolve(scriptDir, "..");
const workspaceRoot = path.resolve(webRoot, "..");
const outputDir = path.join(workspaceRoot, "output", "pdf");
const outputPath = path.join(outputDir, "余海沛-作品集-2026.pdf");
const tempRoot = path.join(workspaceRoot, "tmp", "pdfs");
const chromeProfile = path.join(tempRoot, "chrome-profile");
const port = 3100;
const existingPreviewUrl = "http://127.0.0.1:3000/print";
const fallbackPreviewUrl = `http://127.0.0.1:${port}/print`;

const chromeCandidates = [
  process.env.CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

async function findChrome() {
  for (const candidate of chromeCandidates) {
    try {
      await access(candidate, constants.X_OK);
      return candidate;
    } catch {
      // Continue to the next supported Chrome/Chromium location.
    }
  }
  throw new Error(
    "未找到 Chrome/Chromium。请安装 Google Chrome，或通过 CHROME_PATH 指定可执行文件。",
  );
}

async function waitForPage(targetUrl, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(targetUrl);
      if (response.ok) return;
    } catch {
      // The Next.js server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`等待打印页超时：${targetUrl}`);
}

async function pageIsAvailable(targetUrl) {
  try {
    const response = await fetch(targetUrl);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForStablePdf(filePath, timeoutMs = 60_000) {
  const deadline = Date.now() + timeoutMs;
  let previousSize = -1;
  let stableChecks = 0;

  while (Date.now() < deadline) {
    try {
      const result = await stat(filePath);
      if (result.size > 100_000 && result.size === previousSize) {
        stableChecks += 1;
        if (stableChecks >= 4) return;
      } else {
        stableChecks = 0;
      }
      previousSize = result.size;
    } catch {
      stableChecks = 0;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error("等待 PDF 写入完成超时");
}

async function waitForExit(child, timeoutMs = 5000) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  await Promise.race([
    new Promise((resolve) => child.once("exit", resolve)),
    new Promise((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

async function run() {
  const chrome = await findChrome();
  await mkdir(outputDir, { recursive: true });
  await mkdir(tempRoot, { recursive: true });
  await rm(chromeProfile, {
    recursive: true,
    force: true,
    maxRetries: 5,
    retryDelay: 200,
  });
  await rm(outputPath, { force: true });

  let server = null;
  let chromeProcess = null;
  let serverLog = "";
  let printUrl = existingPreviewUrl;

  try {
    if (!(await pageIsAvailable(existingPreviewUrl))) {
      printUrl = fallbackPreviewUrl;
      const nextBin = path.join(
        webRoot,
        "node_modules",
        "next",
        "dist",
        "bin",
        "next",
      );
      server = spawn(
        process.execPath,
        [nextBin, "dev", "--hostname", "127.0.0.1", "--port", String(port)],
        {
          cwd: webRoot,
          stdio: ["ignore", "pipe", "pipe"],
        },
      );
      const collectLog = (chunk) => {
        serverLog = `${serverLog}${chunk.toString()}`.slice(-8000);
      };
      server.stdout.on("data", collectLog);
      server.stderr.on("data", collectLog);
      await waitForPage(printUrl);
    }

    chromeProcess = spawn(
      chrome,
      [
        "--headless=new",
        "--disable-gpu",
        "--disable-background-networking",
        "--disable-component-update",
        "--disable-default-apps",
        "--no-first-run",
        "--no-default-browser-check",
        "--hide-scrollbars",
        "--no-pdf-header-footer",
        "--print-to-pdf-no-header",
        `--print-to-pdf=${outputPath}`,
        `--user-data-dir=${chromeProfile}`,
        "--window-size=1536,864",
        "--force-device-scale-factor=1",
        "--run-all-compositor-stages-before-draw",
        "--virtual-time-budget=15000",
        printUrl,
      ],
      { cwd: webRoot, stdio: "ignore" },
    );
    chromeProcess.once("error", (error) => {
      console.error(`Chrome 启动失败：${error.message}`);
    });

    await waitForStablePdf(outputPath);
    chromeProcess.kill("SIGTERM");
    await waitForExit(chromeProcess);

    const result = await stat(outputPath);
    if (result.size < 100_000) {
      throw new Error(`PDF 文件异常过小：${result.size} bytes`);
    }
    console.log(`PDF 已生成：${outputPath}`);
    console.log(`文件大小：${(result.size / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    if (serverLog) process.stderr.write(`\nNext.js 日志：\n${serverLog}\n`);
    throw error;
  } finally {
    server?.kill("SIGTERM");
    chromeProcess?.kill("SIGTERM");
    if (chromeProcess) await waitForExit(chromeProcess);
    await rm(chromeProfile, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
