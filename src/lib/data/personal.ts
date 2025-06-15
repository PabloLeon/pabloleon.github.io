import type { PersonalInfo } from '../types';

export const personalInfo: PersonalInfo = {
  name: "Pablo León-Villagrá",
  title: "Postdoctoral Research Associate",
  affiliation: "Brown University",
  email: "pablo.leon-villagra@brown.edu",

  social_links: {
    // mastodon: "https://fediscience.org/@pleon",
    linkedin: "https://www.linkedin.com/in/pablo-leon-villagra/",
    google_scholar: "https://scholar.google.com/citations?user=sEzxpMcAAAAJ",
    // github: "", // placeholder if needed
    bluesky: "https://bsky.app/profile/pleonv.bsky.social", // Update with your actual Bluesky handle
    email: "mailto:pablo_leon_villagra@brown.edu",
  },
  research_areas: [
    "cognitive science",
    "developmental psychology", 
    "computational modeling",
    "function learning",
    "representational learning",
    "experimental psychology"
  ],
  skills: {
    "Methods & Concepts": [
      "Bayesian Methods",
      "Deep Learning",
      "Full-stack web development",
      "Machine Learning"
    ],
    "Tools": [
      "GPy",
      "GPFlow",
      "MATLAB",
      "PyMC3",
      "PyTorch",
      "R",
      "SPSS",
      "Stan",
      "Psychtoolbox",
      "PsychoPy"
    ],
    "Programming Languages": [
      "Actionscript",
      "JavaScript",
      "TypeScript",
      "Python",
      "React",
      "SQL",
      "Scala",
      "Svelte"
    ]
  }
}; 