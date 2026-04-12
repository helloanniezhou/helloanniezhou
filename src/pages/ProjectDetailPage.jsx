import React from "react";
import { Navigate, useParams } from "react-router-dom";
import projects from "../data/projects";
import { airwallexDetail, fitbitDetail, googleGoDetail } from "../data/projectDetails";
import ProjectSection from "../components/project/ProjectSection";
import ProjectComparisonCard from "../components/project/ProjectComparisonCard";
import ProjectFeatureRow from "../components/project/ProjectFeatureRow";
import ProjectMediaCard from "../components/project/ProjectMediaCard";
import ProjectImpactStat from "../components/project/ProjectImpactStat";
import ProjectPillarCard from "../components/project/ProjectPillarCard";
import NotionBlocks from "../components/notion/NotionBlocks";
import { getNotionDocForSlug } from "../data/notionBlocks/loadNotionDocs";
import "../components/project/ProjectDetailShared.css";

function NotionDrivenProjectPage({ project, doc }) {
  return (
    <article className="project-doc">
      <header>
        <h1>{project.title}</h1>
        <p>{project.year || "—"}</p>
      </header>
      <NotionBlocks blocks={doc.blocks} />
    </article>
  );
}

function FitbitProjectPage() {
  return (
    <article className="project-doc">
      <header>
        <h1>{fitbitDetail.title}</h1>
        <p>{fitbitDetail.years}</p>
      </header>

      <ProjectSection title="Overview">{fitbitDetail.overview}</ProjectSection>

      <section>
        <h2>Role</h2>
        {fitbitDetail.roleBody}
        <h2>Impact</h2>
        {fitbitDetail.impactBody}
      </section>

      <figure>
        <img src={fitbitDetail.images.hero} alt="Fitness for Fitbit hero visual" />
      </figure>

      <hr />

      <ProjectSection title="Challenge">{fitbitDetail.challenge}</ProjectSection>

      <blockquote>
        <p>{fitbitDetail.hmw}</p>
      </blockquote>

      <ProjectSection title="Defined product strategy: Start with one segment and expand later">
        {fitbitDetail.strategy}
      </ProjectSection>

      <figure>
        <img src={fitbitDetail.images.strategy} alt="Product and design strategy visual" />
        <figcaption>
          I co-created the product and design strategy for the fitness area on watch.
        </figcaption>
      </figure>

      <ProjectSection title="Introduced structured workout tracking">{fitbitDetail.structuredWorkout}</ProjectSection>

      <ul>
        <ProjectComparisonCard title="Standard workout" description="The entire workout is one session." />
        <ProjectComparisonCard
          title="Video workout"
          description="The workout is one session and tied to a video."
        />
        <ProjectComparisonCard
          title="Structured workout"
          description="The workout has different segments (warmup, workout)."
          isStructured
        />
      </ul>

      <section>
        <img src={fitbitDetail.images.customRun} alt="Build your custom run flow" />
        <p>
          <strong>Build your custom run.</strong>
          <br />
          Create warmups, cool downs, intervals and pace and HR targets. Then access saved workouts and track your
          PRs.
        </p>
      </section>

      <section>
        <img src={fitbitDetail.images.coaching} alt="In-workout coaching flow" />
        <p>
          <strong>In-workout coaching to keep you on track.</strong>
          <br />
          Start one of your custom runs and get audio and haptic cues for when to sprint, cool down or maintain pace.
        </p>
      </section>

      <ProjectSection title="Leading with realistic insights">{fitbitDetail.insights}</ProjectSection>

      <ProjectFeatureRow
        title="Know what your body is ready for each day."
        description="We worked with a clinical expert and introduced a new metric that can inform how hard you work your heart."
        imageSrc={fitbitDetail.images.readiness}
        imageAlt="Readiness insight screen"
      />
      <ProjectFeatureRow
        title="Analyze your run."
        description="Advanced motion sensing measures cadence, stride length, vertical oscillation and more to improve running performance."
        imageSrc={fitbitDetail.images.analysis}
        imageAlt="Run analysis screen"
      />

      <hr />

      <ProjectSection title="Impact">{fitbitDetail.finalImpact}</ProjectSection>
    </article>
  );
}

function GenericProjectPage({ project }) {
  return (
    <article className="project-doc">
      <header>
        <h1>{project.title}</h1>
        <p>{project.year || "Case study coming soon"}</p>
      </header>
      <ProjectSection title="Overview">
        <p>{project.description}</p>
      </ProjectSection>
    </article>
  );
}

function GoogleGoProjectPage() {
  return (
    <article className="project-doc">
      <header>
        <h1>{googleGoDetail.title}</h1>
        <p>{googleGoDetail.years}</p>
      </header>

      <ProjectSection title="Overview">{googleGoDetail.overview}</ProjectSection>

      <section>
        <h2>Role</h2>
        {googleGoDetail.roleBody}
        <h2>Team</h2>
        {googleGoDetail.teamBody}
      </section>

      <ProjectSection title="Results">{googleGoDetail.resultsBody}</ProjectSection>

      <hr />

      <ProjectSection title="Challenge">{googleGoDetail.challenge}</ProjectSection>
      <blockquote>
        <p>{googleGoDetail.challengeCallout}</p>
      </blockquote>

      <ul>
        {googleGoDetail.media.map((item) => (
          <ProjectMediaCard
            key={item.caption}
            imageSrc={item.image}
            imageAlt={item.caption}
            caption={item.caption}
            phone={item.phone}
          />
        ))}
      </ul>

      <ProjectSection title="Process" />
      {googleGoDetail.processSteps.map((step) => (
        <ProjectFeatureRow
          key={step.title}
          title={step.title}
          description={step.description}
          imageSrc={step.image}
          imageAlt={step.title}
        />
      ))}

      <section>
        <h2>Impact</h2>
        <ProjectImpactStat label="DAU & retention">
          <span className="underline">Karaoke mode</span> reached <strong>X%</strong> of Google Go Search DAU with{" "}
          <strong>1X%</strong> weekly retention.
        </ProjectImpactStat>
        <ProjectImpactStat label="Feature usage">
          Mini Learning videos increased feature usage by up to <strong>1X%</strong>.
        </ProjectImpactStat>
        <ProjectImpactStat label="Patent">
          Earned a UK <strong>patent</strong> for the Karaoke mode design.
        </ProjectImpactStat>
      </section>
    </article>
  );
}

function AirwallexProjectPage() {
  return (
    <article className="project-doc">
      <header>
        <h1>{airwallexDetail.title}</h1>
        <p>{airwallexDetail.years}</p>
      </header>

      <ProjectSection title="Overview">{airwallexDetail.overview}</ProjectSection>

      <section>
        <h2>Role</h2>
        {airwallexDetail.roleBody}
        <h2>Impact</h2>
        {airwallexDetail.impactBody}
      </section>

      <figure>
        <img src={airwallexDetail.images.hero} alt="Airwallex payment link product preview" />
      </figure>

      <hr />

      <ProjectSection title="The Opportunity">{airwallexDetail.opportunity}</ProjectSection>
      <blockquote>
        <p>{airwallexDetail.opportunityCallout}</p>
      </blockquote>

      <ProjectSection title="Understand the problem space">{airwallexDetail.problemSpace}</ProjectSection>

      <section>
        <img src={airwallexDetail.images.problemLeft} alt="Merchant research insight visual" />
        <img src={airwallexDetail.images.problemRight} alt="Regional fit research visual" />
      </section>

      <ProjectSection title="Define product strategy">{airwallexDetail.strategy}</ProjectSection>

      <ul>
        <ProjectPillarCard
          emoji="🚀"
          text="Launch quickly to serve the cross-border use case we could win today."
        />
        <ProjectPillarCard
          emoji="💳"
          text="Prioritize expanding payment methods to stay competitive as we scaled."
        />
      </ul>

      <ProjectSection title="Design">{airwallexDetail.design}</ProjectSection>
      <ProjectSection title="Execution">{airwallexDetail.execution}</ProjectSection>

      <section>
        <h2>Impact</h2>
        <ProjectImpactStat label="Launch performance">
          In August 2021, Get Paid launched in AU, EU and selected users in HK and reached{" "}
          <strong>$160K transaction volume</strong> within 2 weeks.
        </ProjectImpactStat>
      </section>
    </article>
  );
}

function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <Navigate to="/" replace />;
  }

  const notionDoc = getNotionDocForSlug(slug);
  if (notionDoc?.blocks?.length) {
    return <NotionDrivenProjectPage project={project} doc={notionDoc} />;
  }

  if (slug === "fitness-for-fitbit") {
    return <FitbitProjectPage />;
  }
  if (slug === "google-go") {
    return <GoogleGoProjectPage />;
  }
  if (slug === "airwallex") {
    return <AirwallexProjectPage />;
  }

  return <GenericProjectPage project={project} />;
}

export default ProjectDetailPage;
