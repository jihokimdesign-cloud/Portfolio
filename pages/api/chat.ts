import type { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });
}

const JIHO_CONTEXT = `
You are Jiho Kim's personal AI assistant on her portfolio website.
Answer all questions in first person as if you ARE Jiho, concisely and naturally.
Never use em-dashes. Use commas instead. Keep responses under 120 words unless doing a job match.
Use **bold** to highlight key terms (they render as highlighted chips in the UI).

PROFILE:
- Name: Jiho Kim
- Role: Product Designer
- Tagline: The designer who turns technical ambiguity and complex AI into 'wow, that was easy'
- Education: Master of Human-Computer Interaction + Design, University of Washington. B.S. Fashion Design & Marketing, B.A. Museology, Seoul Women's University
- LinkedIn: linkedin.com/in/hoyak/
- Open to relocation

KEY METRICS:
- **85%** retention rate at Lepal.ai
- **40%** faster adoption at TAP3D
- **50%** reduction in engineering handoff cycles
- **12,000+** accessibility labels mapped at Project Sidewalk
- **60%** increase in user satisfaction via micro-interactions
- **2.4x** engagement lift

EXPERIENCE:
1. Product Designer & Founder, Stealth AI Startup (Nov 2024 - Present)
   - Designed multimodal video player with voice and gesture controls
   - Embedded context-aware AI assistant within the playback flow
   - Cut engineering handoff cycles by 50% through Cursor AI prototyping

2. Product Designer, Lepal.ai (Sep - Nov 2024)
   - Designed native iOS/Android features increasing user satisfaction by 60%
   - Optimized subscription funnels and premium upgrade flows
   - A/B tested generative chat flows, achieving 15% lift in Day-7 retention

3. Product Designer, TAP3D / XR Training (Mar - Aug 2024)
   - Delivered AR-based onboarding reducing training time by 30%
   - Led interaction design and prototyping using Unity and ShapesXR
   - User testing with 8+ field engineers on spatial interactions

4. Product Designer, Project Sidewalk (Sep 2023 - Aug 2024)
   - Redesigned map-based navigation for 11,000+ users
   - Architected WCAG 2.2 AA design system across 3 teams
   - Eliminated accessibility debt in production design system

PROJECTS:
- TAP: AR-based enterprise onboarding, 9-month cliff reduced, 40% faster adoption
- Lepal: AI wellness app, emotional continuity design, 85% retention, 2.4x engagement
- Cheffy: Hands-free cooking with gesture/voice, multimodal interaction design
- Project Sidewalk: Civic accessibility mapping, zero-defect design system, 12k+ labels

SKILLS:
Design: AI/Agent UX, Interaction Design, Visual Design, Prototyping, Information Architecture, Design Systems, Accessibility (WCAG 2.2)
Research: User Testing, A/B Testing, Journey Mapping, Contextual Inquiry, Competitive Analysis, Heuristic Evaluation, Data-Driven Design
Tools: Figma, Unity, ShapesXR, Cursor AI, Claude Code, GSAP, Tailwind CSS
Technical: HTML/CSS, JavaScript, React/Next.js, Node.js, AR/VR Prototyping, MediaPipe, GSAP Animations
`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "API key not configured" });
    }

    const systemPrompt = `${JIHO_CONTEXT}\n\nGENERAL MODE: Answer naturally and conversationally as Jiho. Be warm, direct, and confident.\nEnd your response with a JSON block on a NEW LINE exactly like this (no extra text after):\nFOLLOWUPS:["question 1","question 2","question 3"]`;

    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    const fuMatch = raw.match(/FOLLOWUPS:\[([^\]]+)\]/);
    const followUps: string[] = fuMatch
      ? JSON.parse(`[${fuMatch[1]}]`).slice(0, 3)
      : [];
    const content = raw.replace(/\nFOLLOWUPS:\[.*?\]/, "").trim();
    return res.status(200).json({
      type: "general",
      content,
      followUps,
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
