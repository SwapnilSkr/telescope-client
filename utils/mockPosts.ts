export const mockPosts = [
  {
    id: 1,
    channel: "Cyber Intelligence Hub",
    timestamp: "2024-01-29T12:00:00Z",
    content:
      'New ransomware strain "BlackCat" detected targeting healthcare sector with double extortion tactics. This sophisticated malware encrypts data and exfiltrates sensitive information, posing a significant threat to patient privacy and hospital operations.',
    tags: ["Ransomware", "Healthcare", "Critical"],
    media: {
      type: "image",
      url: "/images/ransomware-attack.jpg",
      alt: "Ransomware attack visualization",
    },
  },
  {
    id: 2,
    channel: "Threat Intel Network",
    timestamp: "2024-01-29T11:30:00Z",
    content:
      "Sophisticated phishing campaign targeting financial institutions using compromised OAuth tokens. Attackers are leveraging stolen credentials to bypass multi-factor authentication, gaining unauthorized access to sensitive financial data.",
    tags: ["Phishing", "Finance", "OAuth"],
    media: {
      type: "video",
      url: "/videos/phishing-demo.mp4",
      thumbnail: "/images/phishing-thumbnail.jpg",
    },
  },
  {
    id: 3,
    channel: "Security Alerts",
    timestamp: "2024-01-29T11:00:00Z",
    content:
      "Critical zero-day vulnerability discovered in popular WordPress plugin with over 1M+ installations. This flaw allows remote code execution, potentially affecting millions of websites worldwide.",
    tags: ["Zero-day", "WordPress", "Critical"],
  },
  {
    id: 4,
    channel: "APT Tracking",
    timestamp: "2024-01-29T10:30:00Z",
    content:
      "APT29 group observed using new malware variant in recent diplomatic sector attacks. The advanced persistent threat group, also known as Cozy Bear, has deployed a sophisticated backdoor to maintain long-term access to compromised networks.",
    tags: ["APT29", "Malware", "Government"],
    media: {
      type: "file",
      url: "/files/apt29-analysis.pdf",
      name: "APT29 Threat Analysis Report.pdf",
    },
  },
  {
    id: 5,
    channel: "Ransomware Watch",
    timestamp: "2024-01-29T10:00:00Z",
    content:
      "LockBit ransomware group claims responsibility for major automotive manufacturer breach. The group has threatened to release 100GB of stolen data, including proprietary designs and employee information, if ransom demands are not met.",
    tags: ["LockBit", "Automotive", "Data Breach"],
    media: {
      type: "image",
      url: "/images/lockbit-screenshot.jpg",
      alt: "LockBit ransom note screenshot",
    },
  },
  {
    id: 6,
    channel: "Vulnerability Intel",
    timestamp: "2024-01-29T09:30:00Z",
    content:
      "Multiple critical vulnerabilities patched in popular industrial control systems",
    tags: ["ICS", "Patch", "Industrial"],
  },
  {
    id: 7,
    channel: "Dark Web Monitor",
    timestamp: "2024-01-29T09:00:00Z",
    content:
      "New marketplace observed trading zero-day exploits for cloud infrastructure",
    tags: ["Dark Web", "Cloud", "Zero-day"],
  },
  {
    id: 8,
    channel: "Cyber Crime Watch",
    timestamp: "2024-01-29T08:30:00Z",
    content:
      "Banking trojan evolves with new capabilities to bypass 2FA authentication",
    tags: ["Banking", "Trojan", "Authentication"],
  },
  {
    id: 9,
    channel: "Infrastructure Security",
    timestamp: "2024-01-29T08:00:00Z",
    content:
      "Critical infrastructure targeting campaign using modified Industroyer malware",
    tags: ["Infrastructure", "Malware", "Critical"],
  },
  {
    id: 10,
    channel: "Mobile Security",
    timestamp: "2024-01-29T07:30:00Z",
    content:
      "New Android banking malware spreading through fake cryptocurrency apps",
    tags: ["Android", "Malware", "Cryptocurrency"],
  },
  {
    id: 11,
    channel: "Cloud Security",
    timestamp: "2024-01-29T07:00:00Z",
    content:
      "Major cloud service provider reports increased DDoS attacks targeting API endpoints",
    tags: ["DDoS", "Cloud", "API"],
  },
  {
    id: 12,
    channel: "Supply Chain Watch",
    timestamp: "2024-01-29T06:30:00Z",
    content: "Software supply chain attack compromises popular npm packages",
    tags: ["Supply Chain", "npm", "JavaScript"],
  },
  {
    id: 13,
    channel: "IoT Security",
    timestamp: "2024-01-29T06:00:00Z",
    content:
      "Botnet targeting vulnerable IoT devices for cryptocurrency mining operations",
    tags: ["IoT", "Botnet", "Cryptojacking"],
  },
  {
    id: 14,
    channel: "Ransomware Intel",
    timestamp: "2024-01-29T05:30:00Z",
    content:
      "New ransomware variant implementing intermittent encryption to evade detection",
    tags: ["Ransomware", "Evasion", "Detection"],
  },
  {
    id: 15,
    channel: "Network Security",
    timestamp: "2024-01-29T05:00:00Z",
    content:
      "BGP hijacking attempt affecting major ISPs detected and mitigated",
    tags: ["BGP", "Network", "ISP"],
  },
  {
    id: 16,
    channel: "Malware Analysis",
    timestamp: "2024-01-29T04:30:00Z",
    content:
      "New stealer malware targeting stored credentials in multiple browsers",
    tags: ["Malware", "Credentials", "Browser"],
  },
  {
    id: 17,
    channel: "Threat Research",
    timestamp: "2024-01-29T04:00:00Z",
    content:
      "Advanced persistent threat group targeting satellite communications infrastructure",
    tags: ["APT", "Satellite", "Infrastructure"],
  },
  {
    id: 18,
    channel: "Zero Day Track",
    timestamp: "2024-01-29T03:30:00Z",
    content:
      "Zero-day vulnerability in popular VPN solution actively exploited in the wild",
    tags: ["Zero-day", "VPN", "Exploitation"],
  },
  {
    id: 19,
    channel: "Financial Security",
    timestamp: "2024-01-29T03:00:00Z",
    content:
      "New banking trojan campaign targeting mobile banking applications",
    tags: ["Banking", "Mobile", "Trojan"],
  },
  {
    id: 20,
    channel: "Cyber Defense",
    timestamp: "2024-01-29T02:30:00Z",
    content:
      "Nation-state actor leveraging new backdoor in targeted espionage campaign",
    tags: ["Nation-state", "Backdoor", "Espionage"],
  },
];

export const mockThreatActors = [
  {
    id: 1,
    name: "APT29",
    type: "APT",
    status: "Active",
    region: "Russia",
    messageCount: 1500,
    lastMessage: {
      content:
        "New phishing campaign targeting government institutions detected.",
      timestamp: "2024-01-30T14:23:00Z",
    },
  },
  {
    id: 2,
    name: "Lazarus Group",
    type: "APT",
    status: "Active",
    region: "North Korea",
    messageCount: 2300,
    lastMessage: {
      content: "Cryptocurrency exchange hack attributed to the group.",
      timestamp: "2024-01-30T10:15:00Z",
    },
  },
  {
    id: 3,
    name: "FIN7",
    type: "Cybercrime",
    status: "Active",
    region: "Eastern Europe",
    messageCount: 1800,
    lastMessage: {
      content: "New malware strain targeting point-of-sale systems identified.",
      timestamp: "2024-01-29T22:45:00Z",
    },
  },
  {
    id: 4,
    name: "Anonymous",
    type: "Hacktivist",
    status: "Active",
    region: "Global",
    messageCount: 5000,
    lastMessage: {
      content: "Operation announced targeting corrupt government officials.",
      timestamp: "2024-01-30T18:30:00Z",
    },
  },
  {
    id: 5,
    name: "Carbanak",
    type: "Cybercrime",
    status: "Dormant",
    region: "Russia",
    messageCount: 1200,
    lastMessage: {
      content:
        "No recent activity detected. Group possibly disbanded or rebranded.",
      timestamp: "2023-12-15T09:00:00Z",
    },
  },
  // Add more mock threat actors here...
];
