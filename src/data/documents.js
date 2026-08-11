export const mockDocuments = [
  {
    id: 'service-agreement',
    title: 'Service Agreement',
    riskScore: 82,
    highRisk: 3,
    mediumRisk: 7,
    archived: false,
    content: {
      title: 'MEMORANDUM OF UNDERSTANDING',
      date: 'Dated as of November 15, 2024',
      sections: [
        {
          id: 'sec-intro',
          heading: '',
          prefix: 'This Memorandum of Understanding (the "MOU") is entered into by and between ',
          bold1: 'AlphaTech Solutions Inc.',
          mid: ' ("Party A") and ',
          bold2: 'BetaCorp Global Ltd.',
          suffix: ' ("Party B"), collectively referred to herein as the "Parties".'
        },
        {
          id: 'sec-purpose',
          heading: '1. PURPOSE',
          prefix: "The purpose of this MOU is to establish a framework for collaboration between the Parties regarding the joint development and distribution of the 'Project Zenith' software suite. ",
          highlight: "This framework shall supersede all prior agreements, oral or written, between the Parties relating to this subject matter.",
          highlightType: 'purple',
          highlightId: 'issue-purpose',
          suffix: ""
        },
        {
          id: 'sec-confidentiality',
          heading: '2. CONFIDENTIALITY',
          prefix: "Each Party agrees to maintain the confidentiality of all proprietary information disclosed ",
          highlight: "during the term of this MOU. The obligations of confidentiality shall survive the termination of this MOU for a period of one (1) year.",
          highlightType: 'yellow',
          highlightId: 'issue-confidentiality',
          suffix: ""
        }
      ]
    },
    issues: [
      {
        id: 'issue-confidentiality',
        label: 'Confidentiality',
        title: 'Survival period is too short',
        description: 'Standard duration is 3-5 years; current is 1 year.',
        risk: 'high',
        sectionId: 'sec-confidentiality'
      },
      {
        id: 'issue-purpose',
        label: 'Liability',
        title: 'Missing Limitation of Liability',
        description: 'Clause exposes Party A to uncapped damages.',
        risk: 'high',
        sectionId: 'sec-purpose'
      }
    ]
  },
  {
    id: 'contract-2024-a',
    title: 'Contract-2024-A',
    riskScore: 94,
    highRisk: 1,
    mediumRisk: 2,
    archived: false,
    content: {
      title: 'MASTER SOFTWARE LICENSE AGREEMENT',
      date: 'Dated as of June 12, 2024',
      sections: [
        {
          id: 'sec-intro',
          heading: '',
          prefix: 'This Master Software License Agreement ("Agreement") is made and entered into by and between ',
          bold1: 'DeveloperStudio LLC',
          mid: ' ("Licensor") and ',
          bold2: 'EnterpriseSolutions Corp',
          suffix: ' ("Licensee"), collectively referred to herein as the "Parties".'
        },
        {
          id: 'sec-license',
          heading: '1. LICENSE GRANT',
          prefix: 'Licensor hereby grants Licensee a non-exclusive, non-transferable, worldwide license to use the Software solely for its internal business operations. ',
          highlight: 'The license is restricted to fifty (50) concurrent users, and any excess users require additional written addenda.',
          highlightType: 'purple',
          highlightId: 'issue-users',
          suffix: ' Licensee shall not sublicense or distribute the Software.'
        },
        {
          id: 'sec-payment',
          heading: '2. PAYMENT TERMS',
          prefix: 'Licensee shall pay all invoices in full. ',
          highlight: 'Licensee shall pay all fees within sixty (60) days from the invoice date. Late payments shall accrue interest at a rate of 1.5% per month.',
          highlightType: 'yellow',
          highlightId: 'issue-payment',
          suffix: ''
        }
      ]
    },
    issues: [
      {
        id: 'issue-users',
        label: 'License Scope',
        title: 'Concurrent user limit restriction',
        description: 'Limit of 50 concurrent users may be exceeded during peak operational hours.',
        risk: 'medium',
        sectionId: 'sec-license'
      },
      {
        id: 'issue-payment',
        label: 'Payment Terms',
        title: 'Invoice payment terms are 60 days',
        description: 'Standard payment term is 30 days. 60 days increases working capital drag.',
        risk: 'high',
        sectionId: 'sec-payment'
      }
    ]
  },
  {
    id: 'nda-agreement',
    title: 'NDA Agreement',
    riskScore: 71,
    highRisk: 4,
    mediumRisk: 5,
    archived: false,
    content: {
      title: 'MUTUAL NON-DISCLOSURE AGREEMENT',
      date: 'Dated as of January 5, 2024',
      sections: [
        {
          id: 'sec-intro',
          heading: '',
          prefix: 'This Mutual Non-Disclosure Agreement ("NDA") is executed by the signing parties, ',
          bold1: 'InnovateCorp Labs',
          mid: ' and ',
          bold2: 'GlobalPartners LLC',
          suffix: ', to protect proprietary information exchanged during discussions.'
        },
        {
          id: 'sec-definition',
          heading: '1. DEFINITION OF CONFIDENTIAL INFO',
          prefix: 'Confidential Information shall only include written information clearly marked as confidential. ',
          highlight: 'Unmarked oral disclosures are not covered under this agreement unless reduced to writing within 5 days.',
          highlightType: 'purple',
          highlightId: 'issue-marking',
          suffix: ''
        },
        {
          id: 'sec-remedies',
          heading: '2. REMEDIES FOR BREACH',
          prefix: 'In the event of a breach of confidentiality, the disclosing party shall seek injunctive relief. ',
          highlight: 'The receiving party agrees to indemnify the disclosing party for all consequential damages, lost profits, and attorney fees.',
          highlightType: 'yellow',
          highlightId: 'issue-indemnity',
          suffix: ''
        }
      ]
    },
    issues: [
      {
        id: 'issue-marking',
        label: 'NDA Clause',
        title: 'Strict marking requirement',
        description: 'Unmarked verbal disclosures will not be protected under this clause.',
        risk: 'high',
        sectionId: 'sec-definition'
      },
      {
        id: 'issue-indemnity',
        label: 'Indemnity',
        title: 'Uncapped attorney fee indemnity',
        description: 'Obligates receiving party to pay all attorney fees regardless of litigation outcome.',
        risk: 'high',
        sectionId: 'sec-remedies'
      }
    ]
  },
  {
    id: 'mou-draft',
    title: 'MOU Draft',
    riskScore: 89,
    highRisk: 2,
    mediumRisk: 3,
    archived: false,
    content: {
      title: 'MEMORANDUM OF UNDERSTANDING (PARTNERSHIP)',
      date: 'Dated as of October 1, 2024',
      sections: [
        {
          id: 'sec-intro',
          heading: '',
          prefix: 'This Memorandum of Understanding outlines the terms of partnership between ',
          bold1: 'GreenEnergy Corp',
          mid: ' and ',
          bold2: 'EcoTransit Solutions',
          suffix: ' for building charging station infrastructure.'
        },
        {
          id: 'sec-exclusivity',
          heading: '1. EXCLUSIVITY',
          prefix: 'The Parties agree to work exclusively with each other. ',
          highlight: 'Neither party shall engage in discussions or agreements with any green energy competitors for a period of six (6) months.',
          highlightType: 'purple',
          highlightId: 'issue-exclusivity',
          suffix: ''
        },
        {
          id: 'sec-termination',
          heading: '2. TERMINATION ON DEMAND',
          prefix: 'Either party may terminate this partnership for convenience. ',
          highlight: 'Either party may terminate this MOU at any time with five (5) days prior written notice without any liability.',
          highlightType: 'yellow',
          highlightId: 'issue-termination',
          suffix: ''
        }
      ]
    },
    issues: [
      {
        id: 'issue-exclusivity',
        label: 'Exclusivity',
        title: '6-month exclusivity period lock',
        description: 'Restricts other commercial opportunities for both parties for 180 days.',
        risk: 'medium',
        sectionId: 'sec-exclusivity'
      },
      {
        id: 'issue-termination',
        label: 'Termination',
        title: 'Short 5-day notice period',
        description: 'Allows either party to walk away abruptly with very little notice.',
        risk: 'high',
        sectionId: 'sec-termination'
      }
    ]
  }
];
