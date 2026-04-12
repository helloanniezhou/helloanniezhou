import {
  airwallexDetail as defaultAirwallex,
  fitbitDetail as defaultFitbit,
  googleGoDetail as defaultGo
} from "./projectDetails.default";
import { loadSiteContent } from "../lib/siteContentStorage";

const overlays = loadSiteContent()?.details ?? {};

export const fitbitDetail = overlays["fitness-for-fitbit"] ?? defaultFitbit;
export const googleGoDetail = overlays["google-go"] ?? defaultGo;
export const airwallexDetail = overlays["airwallex"] ?? defaultAirwallex;
