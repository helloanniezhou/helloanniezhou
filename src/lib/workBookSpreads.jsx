import React from "react";
import { Link } from "react-router-dom";
import MediaVisual from "../components/MediaVisual";
import { airwallexDetail, fitbitDetail, googleGoDetail } from "../data/projectDetails";

const DETAIL_BY_SLUG = {
  [fitbitDetail.slug]: fitbitDetail,
  [googleGoDetail.slug]: googleGoDetail,
  [airwallexDetail.slug]: airwallexDetail
};

/** Extra copy that appears on the Fitbit case page but not in projectDetails fields */
const FITBIT_EXTRA = {
  strategyCaption: "I co-created the product and design strategy for the fitness area on watch.",
  workoutCompare: `
    <div class="ib-mini-stack">
      <p><strong>Standard workout</strong> — The entire workout is one session.</p>
      <p><strong>Video workout</strong> — The workout is one session and tied to a video.</p>
      <p><strong>Structured workout</strong> — The workout has different segments (warmup, workout).</p>
    </div>`,
  customRunTitle: "Build your custom run.",
  customRunBody:
    "Create warmups, cool downs, intervals and pace and HR targets. Then access saved workouts and track your PRs.",
  coachingTitle: "In-workout coaching to keep you on track.",
  coachingBody:
    "Start one of your custom runs and get audio and haptic cues for when to sprint, cool down or maintain pace.",
  readinessTitle: "Know what your body is ready for each day.",
  readinessBody:
    "We worked with a clinical expert and introduced a new metric that can inform how hard you work your heart.",
  analysisTitle: "Analyze your run.",
  analysisBody:
    "Advanced motion sensing measures cadence, stride length, vertical oscillation and more to improve running performance."
};

const GOOGLE_GO_IMPACT = [
  {
    label: "DAU & retention",
    body: "<span class='underline'>Karaoke mode</span> reached <strong>X%</strong> of Google Go Search DAU with <strong>1X%</strong> weekly retention."
  },
  {
    label: "Feature usage",
    body: "Mini Learning videos increased feature usage by up to <strong>1X%</strong>."
  },
  {
    label: "Patent",
    body: "Earned a UK <strong>patent</strong> for the Karaoke mode design."
  }
];

const AIRWALLEX_PILLARS = [
  { emoji: "🚀", text: "Launch quickly to serve the cross-border use case we could win today." },
  { emoji: "💳", text: "Prioritize expanding payment methods to stay competitive as we scaled." }
];

const AIRWALLEX_LAUNCH_IMPACT =
  "In August 2021, Get Paid launched in AU, EU and selected users in HK and reached <strong>$160K transaction volume</strong> within 2 weeks.";

function HtmlChunk({ html, className = "ib-work-html" }) {
  if (!html) return null;
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Rule() {
  return <hr className="ib-section-rule" />;
}

function Block({ kicker, html, children }) {
  return (
    <div className="ib-block">
      {kicker ? <p className="ib-work-kicker">{kicker}</p> : null}
      {html ? <HtmlChunk html={html} /> : null}
      {children}
    </div>
  );
}

function Stacked({ children }) {
  return <div className="ib-work-spread ib-work-stacked">{children}</div>;
}

function caseStudyLink(project) {
  if (project.slug && !project.comingSoon) {
    return (
      <Link className="ib-work-link" to={`/projects/${project.slug}`} data-book-interactive>
        Open full case study →
      </Link>
    );
  }
  return <p className="ib-work-soon">Case study coming soon.</p>;
}

function caseStudyBack(project) {
  return (
    <div className="ib-work-spread ib-work-back">
      {caseStudyLink(project)}
    </div>
  );
}

function projectHeader(project, detail) {
  const years = detail?.years ?? project.year;
  return (
    <>
      <h3 className={`ib-work-title ${project.titleLight ? "ib-work-title-light" : ""}`}>{project.title}</h3>
      {years ? <p className="ib-work-year">{years}</p> : null}
    </>
  );
}

function MediaCaption({ src, alt, caption, className = "ib-work-thumb ib-work-thumb--lg" }) {
  return (
    <figure className="ib-work-figure">
      <MediaVisual src={src} alt={alt || ""} className={className} />
      {caption ? <figcaption className="ib-work-caption">{caption}</figcaption> : null}
    </figure>
  );
}

/** --- Generic & coming-soon: dense stacked pages --- */
function spreadsForGenericProject(project) {
  const hasImage = Boolean(project.imageSrc && !project.comingSoon);
  return [
    {
      front: (
        <Stacked>
          {hasImage ? (
            <MediaVisual src={project.imageSrc} alt={project.imageAlt || ""} className="ib-work-thumb ib-work-thumb--lg" />
          ) : null}
          {project.comingSoon ? <div className="ib-work-coming">Coming soon</div> : null}
          {projectHeader(project, null)}
          <Rule />
          <Block kicker="Summary" html={project.description} />
        </Stacked>
      ),
      back: (
        <Stacked>
          {project.comingSoon ? (
            <>
              <Block kicker="Program status">
                <p className="ib-work-html">
                  This program is in progress. A full write-up with process, artifacts, and outcomes will ship when the
                  work can be shared publicly. Until then, this spread carries the headline from the work index and a
                  short note on what will appear in the published case study.
                </p>
              </Block>
              <Rule />
              <p className="ib-work-html">
                Expect research highlights, design explorations, and launch metrics once the story can be told in full.
              </p>
            </>
          ) : (
            <>
              <Block kicker="Why it matters">
                <p className="ib-work-html">
                  The case study on this site expands on the narrative with larger media, timelines, and navigable
                  sections. Use the link below when you want the full-screen version of the same story.
                </p>
              </Block>
              <Rule />
              <Block kicker="Scope">
                <p className="ib-work-html">
                  Day-to-day work spans interaction design, systems thinking, and collaboration with research and
                  engineering — the book gives you the essence; the page gives you the room to dig in.
                </p>
              </Block>
            </>
          )}
          <Rule />
          {caseStudyLink(project)}
        </Stacked>
      )
    }
  ];
}

/** --- Fitbit: all sections + images, stacked per spread --- */
function spreadsForFitbit(project, d) {
  const { images: im } = d;
  return [
    {
      front: (
        <Stacked>
          {projectHeader(project, d)}
          <MediaCaption src={im.hero} alt="Fitness hero" caption="Pixel Watch fitness experience" />
        </Stacked>
      ),
      back: (
        <Stacked>
          <Block kicker="Overview" html={d.overview} />
          <Rule />
          <Block kicker="Role" html={d.roleBody} />
          <Rule />
          <Block kicker="Impact" html={d.impactBody} />
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <Block kicker="Challenge" html={d.challenge} />
          <Rule />
          <div className="ib-block ib-work-callout-wrap">
            <p className="ib-work-kicker">How might we</p>
            <p className="ib-work-callout">{d.hmw}</p>
          </div>
        </Stacked>
      ),
      back: (
        <Stacked>
          <Block kicker="Strategy" html={d.strategy} />
          <Rule />
          <Block kicker="Structured workouts" html={d.structuredWorkout} />
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <MediaCaption src={im.strategy} alt="Strategy visual" caption={FITBIT_EXTRA.strategyCaption} />
          <Rule />
          <Block kicker="Workout models" html={FITBIT_EXTRA.workoutCompare} />
        </Stacked>
      ),
      back: (
        <Stacked>
          <MediaCaption src={im.customRun} alt="Custom run flow" />
          <p className="ib-work-feature-lead">
            <strong>{FITBIT_EXTRA.customRunTitle}</strong>
          </p>
          <p className="ib-work-html">{FITBIT_EXTRA.customRunBody}</p>
          <Rule />
          <MediaCaption src={im.coaching} alt="In-workout coaching" />
          <p className="ib-work-feature-lead">
            <strong>{FITBIT_EXTRA.coachingTitle}</strong>
          </p>
          <p className="ib-work-html">{FITBIT_EXTRA.coachingBody}</p>
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <Block kicker="Insights &amp; prototyping" html={d.insights} />
          <Rule />
          <MediaCaption src={im.readiness} alt="Readiness insight" />
          <p className="ib-work-feature-lead">
            <strong>{FITBIT_EXTRA.readinessTitle}</strong>
          </p>
          <p className="ib-work-html">{FITBIT_EXTRA.readinessBody}</p>
        </Stacked>
      ),
      back: (
        <Stacked>
          <MediaCaption src={im.analysis} alt="Run analysis" />
          <p className="ib-work-feature-lead">
            <strong>{FITBIT_EXTRA.analysisTitle}</strong>
          </p>
          <p className="ib-work-html">{FITBIT_EXTRA.analysisBody}</p>
          <Rule />
          <Block kicker="Launch &amp; outcomes" html={d.finalImpact} />
          <Rule />
          <Block kicker="From the work index" html={project.description} />
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <p className="ib-work-html">
            This volume condenses the Pixel Watch fitness case study. The full page adds comparison tiles, two-column
            feature layouts, and section breaks for scanning — use it when you want every artifact at full size.
          </p>
        </Stacked>
      ),
      back: caseStudyBack(project)
    }
  ];
}

/** --- Google Go: stacked narrative, 2×2 media grid, impact + link --- */
function spreadsForGoogleGo(project, d) {
  const hero = project.imageSrc || d.processSteps[0]?.image;
  return [
    {
      front: (
        <Stacked>
          {projectHeader(project, d)}
          {hero ? <MediaCaption src={hero} alt="" caption="Google Go in context" /> : null}
        </Stacked>
      ),
      back: (
        <Stacked>
          <Block kicker="Overview" html={d.overview} />
          <Rule />
          <Block kicker="Role" html={d.roleBody} />
          <Rule />
          <Block kicker="Team" html={d.teamBody} />
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <Block kicker="Results" html={d.resultsBody} />
          <Rule />
          <Block kicker="Challenge" html={d.challenge} />
        </Stacked>
      ),
      back: (
        <Stacked>
          <div className="ib-block ib-work-callout-wrap">
            <p className="ib-work-kicker">North star</p>
            <p className="ib-work-callout">{d.challengeCallout}</p>
          </div>
          <Rule />
          <MediaCaption src={d.processSteps[0].image} alt="" caption={d.processSteps[0].title} />
          <p className="ib-work-process-title">{d.processSteps[0].title}</p>
          <HtmlChunk html={d.processSteps[0].description} />
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <MediaCaption src={d.processSteps[1].image} alt="" caption={d.processSteps[1].title} />
          <p className="ib-work-process-title">{d.processSteps[1].title}</p>
          <HtmlChunk html={d.processSteps[1].description} />
        </Stacked>
      ),
      back: (
        <Stacked>
          <MediaCaption src={d.processSteps[2].image} alt="" caption={d.processSteps[2].title} />
          <p className="ib-work-process-title">{d.processSteps[2].title}</p>
          <HtmlChunk html={d.processSteps[2].description} />
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <p className="ib-work-kicker">In the product</p>
          <p className="ib-work-html">
            Karaoke mode, language onboarding, and mini-learning loops — four moments from the shipped experience.
          </p>
          <div className="ib-media-grid">
            {d.media.map((m) => (
              <MediaVisual key={m.caption} src={m.image} alt="" className="ib-work-thumb" />
            ))}
          </div>
        </Stacked>
      ),
      back: (
        <Stacked>
          <p className="ib-work-kicker">What you&apos;re seeing</p>
          <ol className="ib-caption-list">
            {d.media.map((m, i) => (
              <li key={m.caption}>
                <strong>{i + 1}.</strong> {m.caption}
              </li>
            ))}
          </ol>
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <p className="ib-work-kicker">Impact</p>
          <div className="ib-impact-stack">
            {GOOGLE_GO_IMPACT.map((row) => (
              <div key={row.label} className="ib-impact-row">
                <p className="ib-impact-label">{row.label}</p>
                <HtmlChunk html={row.body} />
              </div>
            ))}
          </div>
          <Rule />
          <Block kicker="Card summary" html={project.description} />
        </Stacked>
      ),
      back: (
        <Stacked>
          <p className="ib-work-html">
            The web case study mirrors this story with larger phone frames, process tiles, and the same impact metrics
            in a grid you can scan quickly.
          </p>
          <Rule />
          {caseStudyLink(project)}
        </Stacked>
      )
    }
  ];
}

/** --- Airwallex: full story + every image on stacked spreads --- */
function spreadsForAirwallex(project, d) {
  const { images: im } = d;
  return [
    {
      front: (
        <Stacked>
          {projectHeader(project, d)}
          <MediaCaption src={im.hero} alt="Payment link product" caption="Payment Link in the product" />
        </Stacked>
      ),
      back: (
        <Stacked>
          <Block kicker="Overview" html={d.overview} />
          <Rule />
          <Block kicker="Role" html={d.roleBody} />
          <Rule />
          <Block kicker="Impact" html={d.impactBody} />
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <Block kicker="The opportunity" html={d.opportunity} />
          <Rule />
          <div className="ib-block ib-work-callout-wrap">
            <p className="ib-work-kicker">Product bet</p>
            <p className="ib-work-callout">{d.opportunityCallout}</p>
          </div>
        </Stacked>
      ),
      back: (
        <Stacked>
          <Block kicker="Understand the problem space" html={d.problemSpace} />
          <Rule />
          <Block kicker="Define product strategy" html={d.strategy} />
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <p className="ib-work-kicker">Strategic pillars</p>
          <div className="ib-pillar-stack">
            {AIRWALLEX_PILLARS.map((p) => (
              <p key={p.text} className="ib-work-html">
                <span className="ib-pillar-emoji" aria-hidden="true">
                  {p.emoji}
                </span>{" "}
                {p.text}
              </p>
            ))}
          </div>
          <Rule />
          <Block kicker="Design" html={d.design} />
        </Stacked>
      ),
      back: (
        <Stacked>
          <Block kicker="Execution" html={d.execution} />
          <Rule />
          <p className="ib-work-kicker">Research visuals</p>
          <p className="ib-work-html">
            Merchant research and regional fit — two frames we used to align PM, design, and GTM on where Payment Link
            would land first.
          </p>
          <div className="ib-work-two-media ib-work-two-media--stack">
            <MediaVisual src={im.problemLeft} alt="Merchant research" className="ib-work-thumb ib-work-thumb--half" />
            <MediaVisual src={im.problemRight} alt="Regional fit" className="ib-work-thumb ib-work-thumb--half" />
          </div>
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <Block kicker="Iteration — create flow" html={null}>
            <MediaCaption
              src={im.process1}
              alt="Create flow iteration"
              caption="Earlier and later create-flow explorations."
            />
          </Block>
          <Rule />
          <p className="ib-work-kicker">Product &amp; brand</p>
          <div className="ib-work-two-media ib-work-two-media--stack">
            <MediaVisual src={im.process2} alt="Process" className="ib-work-thumb ib-work-thumb--half" />
            <MediaVisual src={im.process3} alt="Airwallex" className="ib-work-thumb ib-work-thumb--half" />
          </div>
        </Stacked>
      ),
      back: (
        <Stacked>
          <Block kicker="Launch performance" html={AIRWALLEX_LAUNCH_IMPACT} />
          <Rule />
          <Block kicker="From the work index" html={project.description} />
        </Stacked>
      )
    },
    {
      front: (
        <Stacked>
          <p className="ib-work-html">
            The Payment Link case study on the site adds impact panels, pillar cards, and full-width imagery — this book
            keeps the same facts in a linear, page-turning flow.
          </p>
        </Stacked>
      ),
      back: caseStudyBack(project)
    }
  ];
}

function spreadsForProject(project) {
  const detail = project.slug ? DETAIL_BY_SLUG[project.slug] : null;
  if (!detail) {
    return spreadsForGenericProject(project);
  }
  if (detail.slug === fitbitDetail.slug) {
    return spreadsForFitbit(project, detail);
  }
  if (detail.slug === googleGoDetail.slug) {
    return spreadsForGoogleGo(project, detail);
  }
  if (detail.slug === airwallexDetail.slug) {
    return spreadsForAirwallex(project, detail);
  }
  return spreadsForGenericProject(project);
}

function artPlateSpreads(artworkItems) {
  const plate = {
    front: (
      <Stacked>
        <div className="ib-art-section-plate">
          <p className="ib-work-kicker">Illustration</p>
          <h3 className="ib-work-title">Sketchbook</h3>
        </div>
        <p className="ib-work-desc">
          The plates at the end of this volume are personal work — travel sketches, city scenes, and studies in color and
          line. They sit after the product case studies as a reminder that drawing is part of how I observe places and
          people.
        </p>
      </Stacked>
    ),
    back: (
      <Stacked>
        <p className="ib-work-desc">
          Turn the page for each plate: the recto shows the artwork; the verso carries the title or location in plain
          language. You can move through them in order or jump ahead — the folio numbers run continuously with the rest
          of the book.
        </p>
        <Rule />
        <p className="ib-work-desc">
          Mediums mix digital and traditional; subjects are places I&apos;ve lived in or visited — from Seattle and
          London to Prague, Venice, Vietnam, and more.
        </p>
      </Stacked>
    )
  };

  const plates = artworkItems.map((item) => ({
    front: (
      <Stacked>
        <div className="ib-art-spread">
          <img src={item.src} alt={item.alt} className="ib-art-img" loading="lazy" decoding="async" />
        </div>
        <p className="ib-work-desc">Original plate in this sketchbook sequence — use scroll if the frame crops the height.</p>
      </Stacked>
    ),
    back: (
      <Stacked>
        <p className="ib-art-caption">{item.alt}</p>
        <Rule />
        <p className="ib-work-desc">
          Personal illustration work. Reproduction on the open web may differ in color; this spread matches the file used
          in the gallery.
        </p>
      </Stacked>
    )
  }));

  return [plate, ...plates];
}

export function buildWorkBookSpreads(projectList, artworkItems) {
  const projectSpreads = projectList.flatMap((p) => spreadsForProject(p));
  const artSpreads = artPlateSpreads(artworkItems);
  return [...projectSpreads, ...artSpreads];
}

/** Tab jump targets: `targetPage` is InteractiveBook `currentPage` (-1 = closed cover). */
export function buildWorkBookNavTargets(projectList) {
  let offset = 0;
  const marks = {};
  for (const p of projectList) {
    if (p.slug === "fitness-for-fitbit") marks.fitbit = offset;
    else if (p.slug === "ai-for-fitbit" && marks.fitbit === undefined) marks.fitbit = offset;
    if (p.slug === "google-go") marks.googleGo = offset;
    if (p.slug === "airwallex") marks.airwallex = offset;
    offset += spreadsForProject(p).length;
  }
  const projectSpreadCount = offset;
  return [
    { key: "about", label: "About Author", targetPage: -1 },
    { key: "fitbit", label: "Fitbit", targetPage: marks.fitbit ?? 0 },
    { key: "google-go", label: "Google Go", targetPage: marks.googleGo ?? 0 },
    { key: "airwallex", label: "Airwallex", targetPage: marks.airwallex ?? 0 },
    { key: "artwork", label: "Artwork", targetPage: projectSpreadCount }
  ];
}

export function getActiveWorkBookTabKey(spreadIndex, navTargets) {
  if (spreadIndex < 0) return "about";
  const contentTabs = navTargets.filter((t) => t.key !== "about").sort((a, b) => a.targetPage - b.targetPage);
  for (let i = 0; i < contentTabs.length; i++) {
    const start = contentTabs[i].targetPage;
    const end = i + 1 < contentTabs.length ? contentTabs[i + 1].targetPage - 1 : Number.POSITIVE_INFINITY;
    if (spreadIndex >= start && spreadIndex <= end) return contentTabs[i].key;
  }
  if (contentTabs.length && spreadIndex < contentTabs[0].targetPage) return contentTabs[0].key;
  return contentTabs.length ? contentTabs[contentTabs.length - 1].key : "about";
}
