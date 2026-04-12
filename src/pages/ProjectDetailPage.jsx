import React from "react";
import { Navigate, useParams } from "react-router-dom";
import projects from "../data/projects";
import { airwallexDetail, fitbitDetail, googleGoDetail } from "../data/projectDetails";
import BackPillLink from "../components/project/BackPillLink";
import ProjectSection from "../components/project/ProjectSection";
import ProjectMetaCard from "../components/project/ProjectMetaCard";
import ProjectComparisonCard from "../components/project/ProjectComparisonCard";
import ProjectFeatureRow from "../components/project/ProjectFeatureRow";
import ProjectMediaCard from "../components/project/ProjectMediaCard";
import ProjectImpactStat from "../components/project/ProjectImpactStat";
import ProjectPillarCard from "../components/project/ProjectPillarCard";
import "../components/project/ProjectDetailShared.css";

function FitbitProjectPage() {
  return (
    <div className="project-detail-page">
      <BackPillLink to="/" label="Back" />

      <section className="project-hero">
        <h1>{fitbitDetail.title}</h1>
        <p>{fitbitDetail.years}</p>
      </section>

      <ProjectSection title="Overview" body={fitbitDetail.overview} />

      <section className="project-meta-grid">
        <ProjectMetaCard title="Role" body={fitbitDetail.roleBody} />
        <ProjectMetaCard title="Impact" body={fitbitDetail.impactBody} />
      </section>

      <div className="project-image-block">
        <img src={fitbitDetail.images.hero} alt="Fitness for Fitbit hero visual" />
      </div>

      <hr className="project-divider" />

      <ProjectSection title="Challenge" body={fitbitDetail.challenge} />

      <section className="project-callout">{fitbitDetail.hmw}</section>

      <ProjectSection
        title="Defined product strategy: Start with one segment and expand later"
        body={fitbitDetail.strategy}
      />

      <div className="project-image-block">
        <img src={fitbitDetail.images.strategy} alt="Product and design strategy visual" />
      </div>
      <p className="project-caption">
        I co-created the product and design strategy for the fitness area on watch.
      </p>

      <ProjectSection
        title="Introduced structured workout tracking"
        body={fitbitDetail.structuredWorkout}
      />

      <section className="project-compare-grid">
        <ProjectComparisonCard
          title="Standard workout"
          description="The entire workout is one session."
        />
        <ProjectComparisonCard
          title="Video workout"
          description="The workout is one session and tied to a video."
        />
        <ProjectComparisonCard
          title="Structured workout"
          description="The workout has different segments (warmup, workout)."
          isStructured
        />
      </section>

      <section className="project-two-up">
        <article className="project-two-up-item">
          <img src={fitbitDetail.images.customRun} alt="Build your custom run flow" />
          <p>
            <strong>Build your custom run.</strong>
            <br />
            Create warmups, cool downs, intervals and pace and HR targets. Then access saved
            workouts and track your PRs.
          </p>
        </article>
        <article className="project-two-up-item">
          <img src={fitbitDetail.images.coaching} alt="In-workout coaching flow" />
          <p>
            <strong>In-workout coaching to keep you on track.</strong>
            <br />
            Start one of your custom runs and get audio and haptic cues for when to sprint,
            cool down or maintain pace.
          </p>
        </article>
      </section>

      <ProjectSection title="Leading with realistic insights" body={fitbitDetail.insights} />

      <section className="project-feature-stack">
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
      </section>

      <hr className="project-divider" />

      <ProjectSection title="Impact" body={fitbitDetail.finalImpact} />
    </div>
  );
}

function GenericProjectPage({ project }) {
  return (
    <div className="project-detail-page">
      <BackPillLink to="/" label="Back" />
      <section className="project-hero">
        <h1>{project.title}</h1>
        <p>{project.year || "Case study coming soon"}</p>
      </section>
      <ProjectSection title="Overview" body={project.description} />
    </div>
  );
}

function GoogleGoProjectPage() {
  return (
    <div className="project-detail-page">
      <BackPillLink to="/" label="Back" />

      <section className="project-hero">
        <h1>{googleGoDetail.title}</h1>
        <p>{googleGoDetail.years}</p>
      </section>

      <ProjectSection title="Overview" body={googleGoDetail.overview} />

      <section className="project-meta-grid">
        <ProjectMetaCard title="Role" body={googleGoDetail.roleBody} />
        <ProjectMetaCard title="Team" body={googleGoDetail.teamBody} />
      </section>

      <ProjectSection title="Results" body={googleGoDetail.resultsBody} />

      <hr className="project-divider" />

      <ProjectSection title="Challenge" body={googleGoDetail.challenge} />
      <section className="project-callout">{googleGoDetail.challengeCallout}</section>

      <section className="project-media-grid">
        {googleGoDetail.media.slice(0, 2).map((item) => (
          <ProjectMediaCard
            key={item.caption}
            imageSrc={item.image}
            imageAlt={item.caption}
            caption={item.caption}
            phone={item.phone}
          />
        ))}
      </section>

      <section className="project-media-grid">
        {googleGoDetail.media.slice(2).map((item) => (
          <ProjectMediaCard
            key={item.caption}
            imageSrc={item.image}
            imageAlt={item.caption}
            caption={item.caption}
            phone={item.phone}
          />
        ))}
      </section>

      <ProjectSection title="Process" body="" className="process-title-only" />
      <section className="project-feature-stack">
        {googleGoDetail.processSteps.map((step) => (
          <ProjectFeatureRow
            key={step.title}
            title={step.title}
            description={step.description}
            imageSrc={step.image}
            imageAlt={step.title}
          />
        ))}
      </section>

      <ProjectSection title="Impact" body="" className="process-title-only" />
      <section className="project-impact-panel">
        <div className="project-impact-grid">
          <ProjectImpactStat
            label="DAU & retention"
            body="<span class='underline'>Karaoke mode</span> reached <strong>X%</strong> of Google Go Search DAU with <strong>1X%</strong> weekly retention."
          />
          <ProjectImpactStat
            label="Feature usage"
            body="Mini Learning videos increased feature usage by up to <strong>1X%</strong>."
          />
          <ProjectImpactStat
            label="Patent"
            body="Earned a UK <strong>patent</strong> for the Karaoke mode design."
          />
        </div>
      </section>
    </div>
  );
}

function AirwallexProjectPage() {
  return (
    <div className="project-detail-page">
      <BackPillLink to="/" label="Back" />

      <section className="project-hero">
        <h1>{airwallexDetail.title}</h1>
        <p>{airwallexDetail.years}</p>
      </section>

      <ProjectSection title="Overview" body={airwallexDetail.overview} />

      <section className="project-meta-grid">
        <ProjectMetaCard title="Role" body={airwallexDetail.roleBody} />
        <ProjectMetaCard title="Impact" body={airwallexDetail.impactBody} />
      </section>

      <div className="project-image-block">
        <img src={airwallexDetail.images.hero} alt="Airwallex payment link product preview" />
      </div>

      <hr className="project-divider" />

      <ProjectSection title="The Opportunity" body={airwallexDetail.opportunity} />
      <section className="project-callout">{airwallexDetail.opportunityCallout}</section>

      <ProjectSection title="Understand the problem space" body={airwallexDetail.problemSpace} />

      <section className="project-image-row">
        <img src={airwallexDetail.images.problemLeft} alt="Merchant research insight visual" />
        <img src={airwallexDetail.images.problemRight} alt="Regional fit research visual" />
      </section>

      <ProjectSection title="Define product strategy" body={airwallexDetail.strategy} />

      <section className="project-pillar-grid">
        <ProjectPillarCard
          emoji="🚀"
          text="Launch quickly to serve the cross-border use case we could win today."
        />
        <ProjectPillarCard
          emoji="💳"
          text="Prioritize expanding payment methods to stay competitive as we scaled."
        />
      </section>

      <ProjectSection title="Design" body={airwallexDetail.design} />
      <ProjectSection title="Execution" body={airwallexDetail.execution} />

      <ProjectSection title="Impact" body="" className="process-title-only" />
      <section className="project-impact-panel">
        <div className="project-impact-grid project-impact-grid-single">
          <ProjectImpactStat
            label="Launch performance"
            body="In August 2021, Get Paid launched in AU, EU and selected users in HK and reached <strong>$160K transaction volume</strong> within 2 weeks."
          />
        </div>
      </section>
    </div>
  );
}

function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <Navigate to="/" replace />;
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
