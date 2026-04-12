import defaultProjects from "./projects.default";
import { loadSiteContent } from "../lib/siteContentStorage";

const stored = loadSiteContent();
const projects = stored?.projects ?? defaultProjects;

export default projects;
