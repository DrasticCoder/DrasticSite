import { NextResponse } from 'next/server';

function cleanHtml(raw: string): string {
  let text = raw.trim();
  // Strip markdown ```html or ``` wrappers if present
  const codeBlockMatch = text.match(/```(?:html)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    text = codeBlockMatch[1].trim();
  } else {
    text = text.replace(/^```(?:html)?\s*/i, '').replace(/\s*```$/i, '').trim();
  }
  return text;
}

/**
 * Validates that the generated HTML is 100% complete ("all-or-nothing").
 * Must have proper opening & closing tags for html, head, body, style, and script.
 */
function validateCompleteHtml(html: string): { isValid: boolean; error?: string } {
  if (!html || typeof html !== 'string') {
    return { isValid: false, error: 'Empty code generated.' };
  }

  const trimmed = html.trim();
  if (trimmed.length < 200) {
    return { isValid: false, error: 'Generated code is too short to be a complete website.' };
  }

  const lower = trimmed.toLowerCase();

  // Must have <html> (or <!doctype) and </html>
  if (!lower.includes('<html') || !lower.includes('</html>')) {
    return { isValid: false, error: 'Missing <html> or closing </html> tag.' };
  }

  // Check head
  if (lower.includes('<head') && !lower.includes('</head>')) {
    return { isValid: false, error: 'Unclosed <head> tag.' };
  }

  // Check body
  if (lower.includes('<body') && !lower.includes('</body>')) {
    return { isValid: false, error: 'Unclosed <body> tag.' };
  }

  // Check style tags
  const styleOpen = (lower.match(/<style\b/g) || []).length;
  const styleClose = (lower.match(/<\/style>/g) || []).length;
  if (styleOpen > styleClose) {
    return { isValid: false, error: 'Unclosed <style> tag detected.' };
  }

  // Check script tags
  const scriptOpen = (lower.match(/<script\b/g) || []).length;
  const scriptClose = (lower.match(/<\/script>/g) || []).length;
  if (scriptOpen > scriptClose) {
    return { isValid: false, error: 'Unclosed <script> tag detected.' };
  }

  // Check for truncation placeholders or cutoffs
  if (
    trimmed.includes('/* TODO') ||
    trimmed.includes('<!-- rest of code') ||
    trimmed.endsWith('...') ||
    trimmed.endsWith('// ...')
  ) {
    return { isValid: false, error: 'Code contains truncation placeholders.' };
  }

  return { isValid: true };
}

function extractSlug(html: string, prompt: string): string {
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch && titleMatch[1]) {
    const slug = titleMatch[1]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30);
    if (slug.length >= 3) return slug;
  }

  const promptSlug = prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 4)
    .join('-')
    .slice(0, 30);

  return promptSlug || 'site';
}

const SYSTEM_PROMPT = `You are a world-class front-end software architect and UI designer.
Your objective is to produce a 100% COMPLETE, FULLY WORKING, PRODUCTION-READY single-page website in HTML5.

CRITICAL ALL-OR-NOTHING REQUIREMENTS:
1. OUTPUT ONLY THE FULL HTML: Start directly with <!DOCTYPE html> and end with </html>. Do NOT include any introductory or concluding conversational text. Never wrap with any explanation.
2. ENTIRE CODE OR NOTHING: You must write the ENTIRE website in one uninterrupted response. NEVER truncate, NEVER omit sections, NEVER leave placeholder comments like "<!-- rest of items here -->" or "/* add styles */".
3. SELF-CONTAINED STYLING: All CSS must be placed inside a <style> block within <head>. Use modern CSS (CSS Grid, Flexbox, variables, responsive breakpoints for mobile/desktop, smooth transitions, and high-contrast bold aesthetic).
4. SELF-CONTAINED SCRIPTS: All JavaScript must be placed inside a <script> block before </body>. Ensure interactive elements (mobile menu toggles, modals, sliders, interactive tabs, form submissions, filters) actually work when clicked.
5. COMPLETE SECTIONS & COPY: Provide realistic, compelling copy, hero section, features/services/menu/showcase, testimonials, call to action, and footer. Use high quality Unsplash photos (e.g. https://images.unsplash.com/...) or clean inline SVG icons.
6. CLOSING TAGS: Every opened tag (<head>, <body>, <style>, <script>, <div>, etc.) MUST be properly closed. The very last tag must be </html>.`;

// Call Groq (OpenAI-compatible) API
async function callGroq(
  groqKey: string,
  userPrompt: string,
  currentCode?: string
): Promise<{ code: string; provider: string }> {
  const models = ['openai/gpt-oss-120b', 'llama-3.3-70b-versatile'];
  let lastError = '';

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: currentCode
        ? `Existing website code:\n${currentCode}\n\nUpdate and rewrite the ENTIRE full website according to this instruction: ${userPrompt}\nRemember: Output the 100% complete HTML from <!DOCTYPE html> to </html> without truncation.`
        : `Build this complete single-page website: ${userPrompt}\nRemember: Output the 100% complete HTML from <!DOCTYPE html> to </html> without truncation.`,
    },
  ];

  for (const model of models) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.6,
          max_tokens: 8192,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        lastError = errJson?.error?.message || `Groq HTTP ${res.status}`;
        continue;
      }

      const json = await res.json();
      const content = json.choices?.[0]?.message?.content;
      if (content) {
        const clean = cleanHtml(content);
        const check = validateCompleteHtml(clean);
        if (check.isValid) {
          return { code: clean, provider: `Groq (${model})` };
        }
        lastError = check.error || 'Groq code failed completeness check';
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : 'Groq fetch error';
    }
  }

  throw new Error(`Groq generation failed: ${lastError}`);
}

// Call Gemini API
async function callGemini(
  geminiKey: string,
  userPrompt: string,
  currentCode?: string
): Promise<{ code: string; provider: string }> {
  const models = ['gemini-flash-latest', 'gemini-2.5-flash'];
  let lastError = '';

  const fullPrompt = `${SYSTEM_PROMPT}\n\n${
    currentCode
      ? `Existing website code:\n${currentCode}\n\nUpdate and rewrite the ENTIRE full website according to this instruction: ${userPrompt}\nOutput the 100% complete HTML from <!DOCTYPE html> to </html> without truncation.`
      : `Build this complete single-page website: ${userPrompt}\nOutput the 100% complete HTML from <!DOCTYPE html> to </html> without truncation.`
  }`;

  for (const model of models) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': geminiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: 8192,
            },
          }),
        }
      );

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        lastError = errJson?.error?.message || `Gemini HTTP ${res.status}`;
        continue;
      }

      const json = await res.json();
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        const clean = cleanHtml(text);
        const check = validateCompleteHtml(clean);
        if (check.isValid) {
          return { code: clean, provider: `Gemini (${model})` };
        }
        lastError = check.error || 'Gemini code failed completeness check';
      }
    } catch (err: unknown) {
      lastError = err instanceof Error ? err.message : 'Gemini fetch error';
    }
  }

  throw new Error(`Gemini generation failed: ${lastError}`);
}

/**
 * Race all available providers concurrently:
 * Whichever returns complete, validated code earliest wins!
 */
function raceProviders<T>(promises: Promise<T>[]): Promise<T> {
  return new Promise((resolve, reject) => {
    let pending = promises.length;
    const errors: string[] = [];

    if (pending === 0) {
      return reject(new Error('No AI providers configured.'));
    }

    promises.forEach((p) => {
      p.then((result) => {
        resolve(result);
      }).catch((err) => {
        pending--;
        errors.push(err instanceof Error ? err.message : String(err));
        if (pending === 0) {
          reject(new Error(errors.join(' | ')));
        }
      });
    });
  });
}

export async function POST(req: Request) {
  try {
    const { prompt, currentCode, siteName } = await req.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    const tasks: Promise<{ code: string; provider: string }>[] = [];

    if (groqKey) {
      tasks.push(callGroq(groqKey, prompt.trim(), currentCode));
    }
    if (geminiKey) {
      tasks.push(callGemini(geminiKey, prompt.trim(), currentCode));
    }

    if (tasks.length === 0) {
      return NextResponse.json(
        { error: 'No AI API keys configured.' },
        { status: 500 }
      );
    }

    // Race Groq and Gemini: earliest valid response wins!
    const winningResult = await raceProviders(tasks);

    const suggestedSlug = siteName?.trim() || extractSlug(winningResult.code, prompt);

    return NextResponse.json({
      code: winningResult.code,
      suggestedSlug,
      provider: winningResult.provider,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Server error occurred';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
