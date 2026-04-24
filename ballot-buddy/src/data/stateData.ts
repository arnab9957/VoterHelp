export type StateData = {
  state: string;
  abbrev: string;
  registrationDeadline: string;
  earlyVotingStart: string;
  earlyVotingEnd: string;
  absenteeRequestDeadline: string;
  idRequired: boolean;
  idType: 'strict' | 'non-strict';
  voterRegistrationUrl: string;
  electionOfficeUrl: string;
};

export const stateData: Record<string, StateData> = {
  AL: {
    state: 'Alabama',
    abbrev: 'AL',
    registrationDeadline: '15 days before',
    earlyVotingStart: '45 days before',
    earlyVotingEnd: '3 days before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.alabamavotes.gov',
    electionOfficeUrl: 'https://www.alabamavotes.gov'
  },
  AK: {
    state: 'Alaska',
    abbrev: 'AK',
    registrationDeadline: '30 days before',
    earlyVotingStart: '15 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '10 days before',
    idRequired: true,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.elections.alaska.gov',
    electionOfficeUrl: 'https://www.elections.alaska.gov'
  },
  AZ: {
    state: 'Arizona',
    abbrev: 'AZ',
    registrationDeadline: '29 days before',
    earlyVotingStart: '27 days before',
    earlyVotingEnd: 'Friday before',
    absenteeRequestDeadline: '11 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.azsos.gov/elections',
    electionOfficeUrl: 'https://www.azsos.gov/elections'
  },
  CA: {
    state: 'California',
    abbrev: 'CA',
    registrationDeadline: '15 days before',
    earlyVotingStart: '29 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '7 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.sos.ca.gov/elections',
    electionOfficeUrl: 'https://www.sos.ca.gov/elections'
  },
  CO: {
    state: 'Colorado',
    abbrev: 'CO',
    registrationDeadline: '8 days before (online), 20 days before (mail)',
    earlyVotingStart: '22 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '8 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.elections.co.gov',
    electionOfficeUrl: 'https://www.elections.co.gov'
  },
  CT: {
    state: 'Connecticut',
    abbrev: 'CT',
    registrationDeadline: '7 days before',
    earlyVotingStart: '14 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://portal.ct.gov/sots/election-services',
    electionOfficeUrl: 'https://portal.ct.gov/sots/election-services'
  },
  FL: {
    state: 'Florida',
    abbrev: 'FL',
    registrationDeadline: '29 days before',
    earlyVotingStart: '10 days before',
    earlyVotingEnd: '3 days before',
    absenteeRequestDeadline: '10 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.registertovoteflorida.gov',
    electionOfficeUrl: 'https://www.dos.myflorida.com/elections'
  },
  GA: {
    state: 'Georgia',
    abbrev: 'GA',
    registrationDeadline: '29 days before',
    earlyVotingStart: '22 days before',
    earlyVotingEnd: 'Friday before',
    absenteeRequestDeadline: '11 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.mvp.sos.ga.gov',
    electionOfficeUrl: 'https://www.mvp.sos.ga.gov'
  },
  IL: {
    state: 'Illinois',
    abbrev: 'IL',
    registrationDeadline: '28 days before',
    earlyVotingStart: '40 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '10 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.elections.il.gov',
    electionOfficeUrl: 'https://www.elections.il.gov'
  },
  IN: {
    state: 'Indiana',
    abbrev: 'IN',
    registrationDeadline: '29 days before',
    earlyVotingStart: '28 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '12 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.in.gov/sos/elections',
    electionOfficeUrl: 'https://www.in.gov/sos/elections'
  },
  IA: {
    state: 'Iowa',
    abbrev: 'IA',
    registrationDeadline: '10 days before',
    earlyVotingStart: '29 days before',
    earlyVotingEnd: 'Monday before',
    absenteeRequestDeadline: '15 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://sos.iowa.gov/elections',
    electionOfficeUrl: 'https://sos.iowa.gov/elections'
  },
  KS: {
    state: 'Kansas',
    abbrev: 'KS',
    registrationDeadline: '21 days before',
    earlyVotingStart: '20 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.sos.ks.gov/elections',
    electionOfficeUrl: 'https://www.sos.ks.gov/elections'
  },
  KY: {
    state: 'Kentucky',
    abbrev: 'KY',
    registrationDeadline: '29 days before',
    earlyVotingStart: '12 days before',
    earlyVotingEnd: 'Monday before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.elect.ky.gov',
    electionOfficeUrl: 'https://www.elect.ky.gov'
  },
  LA: {
    state: 'Louisiana',
    abbrev: 'LA',
    registrationDeadline: '30 days before',
    earlyVotingStart: '14 days before',
    earlyVotingEnd: '7 days before',
    absenteeRequestDeadline: '15 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.sos.la.gov/elections',
    electionOfficeUrl: 'https://www.sos.la.gov/elections'
  },
  MA: {
    state: 'Massachusetts',
    abbrev: 'MA',
    registrationDeadline: '10 days before',
    earlyVotingStart: '20 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '7 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.sec.state.ma.us',
    electionOfficeUrl: 'https://www.sec.state.ma.us'
  },
  MD: {
    state: 'Maryland',
    abbrev: 'MD',
    registrationDeadline: '21 days before',
    earlyVotingStart: '8 days before',
    earlyVotingEnd: 'Thursday before',
    absenteeRequestDeadline: '7 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.elections.maryland.gov',
    electionOfficeUrl: 'https://www.elections.maryland.gov'
  },
  MI: {
    state: 'Michigan',
    abbrev: 'MI',
    registrationDeadline: '15 days before',
    earlyVotingStart: '9 days before',
    earlyVotingEnd: 'Sunday before',
    absenteeRequestDeadline: '15 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.michigan.gov/sos/elections',
    electionOfficeUrl: 'https://www.michigan.gov/sos/elections'
  },
  MN: {
    state: 'Minnesota',
    abbrev: 'MN',
    registrationDeadline: '21 days before',
    earlyVotingStart: '46 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '7 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.sos.state.mn.us/elections',
    electionOfficeUrl: 'https://www.sos.state.mn.us/elections'
  },
  MS: {
    state: 'Mississippi',
    abbrev: 'MS',
    registrationDeadline: '30 days before',
    earlyVotingStart: '14 days before',
    earlyVotingEnd: '4 days before',
    absenteeRequestDeadline: '11 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.sos.ms.gov/elections',
    electionOfficeUrl: 'https://www.sos.ms.gov/elections'
  },
  MO: {
    state: 'Missouri',
    abbrev: 'MO',
    registrationDeadline: '27 days before',
    earlyVotingStart: '19 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '13 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.sos.mo.gov/elections',
    electionOfficeUrl: 'https://www.sos.mo.gov/elections'
  },
  MT: {
    state: 'Montana',
    abbrev: 'MT',
    registrationDeadline: '30 days before (mail), 24 hours (online)',
    earlyVotingStart: '30 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '1 day before (noon)',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.mtsos.gov/elections',
    electionOfficeUrl: 'https://www.mtsos.gov/elections'
  },
  NE: {
    state: 'Nebraska',
    abbrev: 'NE',
    registrationDeadline: '18 days before',
    earlyVotingStart: '30 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '10 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://sos.nebraska.gov/elections',
    electionOfficeUrl: 'https://sos.nebraska.gov/elections'
  },
  NV: {
    state: 'Nevada',
    abbrev: 'NV',
    registrationDeadline: '28 days before',
    earlyVotingStart: '14 days before',
    earlyVotingEnd: 'Friday before',
    absenteeRequestDeadline: '14 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.nvsos.gov/elections',
    electionOfficeUrl: 'https://www.nvsos.gov/elections'
  },
  NH: {
    state: 'New Hampshire',
    abbrev: 'NH',
    registrationDeadline: '13 days before',
    earlyVotingStart: '7 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://sos.nh.gov/elections',
    electionOfficeUrl: 'https://sos.nh.gov/elections'
  },
  NJ: {
    state: 'New Jersey',
    abbrev: 'NJ',
    registrationDeadline: '21 days before',
    earlyVotingStart: '45 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '13 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.nj.gov/state/elections',
    electionOfficeUrl: 'https://www.nj.gov/state/elections'
  },
  NM: {
    state: 'New Mexico',
    abbrev: 'NM',
    registrationDeadline: '28 days before',
    earlyVotingStart: '28 days before',
    earlyVotingEnd: 'Saturday before',
    absenteeRequestDeadline: '14 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.sos.nm.gov/elections',
    electionOfficeUrl: 'https://www.sos.nm.gov/elections'
  },
  NY: {
    state: 'New York',
    abbrev: 'NY',
    registrationDeadline: '25 days before',
    earlyVotingStart: '10 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '15 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.elections.ny.gov',
    electionOfficeUrl: 'https://www.elections.ny.gov'
  },
  NC: {
    state: 'North Carolina',
    abbrev: 'NC',
    registrationDeadline: '25 days before',
    earlyVotingStart: '19 days before',
    earlyVotingEnd: 'Thursday before',
    absenteeRequestDeadline: '7 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.ncsbe.gov',
    electionOfficeUrl: 'https://www.ncsbe.gov'
  },
  ND: {
    state: 'North Dakota',
    abbrev: 'ND',
    registrationDeadline: 'No deadline (same day)',
    earlyVotingStart: 'No designated early voting period',
    earlyVotingEnd: 'N/A',
    absenteeRequestDeadline: 'Day before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://vip.sos.nd.gov',
    electionOfficeUrl: 'https://vip.sos.nd.gov'
  },
  OH: {
    state: 'Ohio',
    abbrev: 'OH',
    registrationDeadline: '30 days before',
    earlyVotingStart: '39 days before',
    earlyVotingEnd: 'Monday before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.ohiosos.gov/elections',
    electionOfficeUrl: 'https://www.ohiosos.gov/elections'
  },
  OK: {
    state: 'Oklahoma',
    abbrev: 'OK',
    registrationDeadline: '25 days before',
    earlyVotingStart: '14 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '11 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.oklahoma.gov/elections',
    electionOfficeUrl: 'https://www.oklahoma.gov/elections'
  },
  OR: {
    state: 'Oregon',
    abbrev: 'OR',
    registrationDeadline: '21 days before',
    earlyVotingStart: 'N/A (all vote-by-mail)',
    earlyVotingEnd: 'N/A (all vote-by-mail)',
    absenteeRequestDeadline: 'N/A (automatic)',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://sos.oregon.gov/elections',
    electionOfficeUrl: 'https://sos.oregon.gov/elections'
  },
  PA: {
    state: 'Pennsylvania',
    abbrev: 'PA',
    registrationDeadline: '15 days before',
    earlyVotingStart: 'No designated early voting period',
    earlyVotingEnd: 'N/A',
    absenteeRequestDeadline: '15 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.pa.gov/elections',
    electionOfficeUrl: 'https://www.pa.gov/elections'
  },
  RI: {
    state: 'Rhode Island',
    abbrev: 'RI',
    registrationDeadline: '30 days before',
    earlyVotingStart: '20 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '21 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://elect.ri.gov',
    electionOfficeUrl: 'https://elect.ri.gov'
  },
  SC: {
    state: 'South Carolina',
    abbrev: 'SC',
    registrationDeadline: '30 days before',
    earlyVotingStart: '24 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.scvotes.gov',
    electionOfficeUrl: 'https://www.scvotes.gov'
  },
  SD: {
    state: 'South Dakota',
    abbrev: 'SD',
    registrationDeadline: '15 days before',
    earlyVotingStart: '46 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://sdsos.gov/elections',
    electionOfficeUrl: 'https://sdsos.gov/elections'
  },
  TN: {
    state: 'Tennessee',
    abbrev: 'TN',
    registrationDeadline: '30 days before',
    earlyVotingStart: '20 days before',
    earlyVotingEnd: '5 days before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.tn.gov/sos/elections',
    electionOfficeUrl: 'https://www.tn.gov/sos/elections'
  },
  TX: {
    state: 'Texas',
    abbrev: 'TX',
    registrationDeadline: '30 days before',
    earlyVotingStart: '12 days before',
    earlyVotingEnd: '4 days before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.votetexas.gov',
    electionOfficeUrl: 'https://www.votetexas.gov'
  },
  UT: {
    state: 'Utah',
    abbrev: 'UT',
    registrationDeadline: '11 days before',
    earlyVotingStart: '14 days before',
    earlyVotingEnd: 'Friday before',
    absenteeRequestDeadline: '11 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://vote.utah.gov',
    electionOfficeUrl: 'https://vote.utah.gov'
  },
  VT: {
    state: 'Vermont',
    abbrev: 'VT',
    registrationDeadline: 'Same day registration available',
    earlyVotingStart: 'N/A (all vote-by-mail)',
    earlyVotingEnd: 'N/A',
    absenteeRequestDeadline: 'N/A (automatic)',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.sec.state.vt.us/elections',
    electionOfficeUrl: 'https://www.sec.state.vt.us/elections'
  },
  VA: {
    state: 'Virginia',
    abbrev: 'VA',
    registrationDeadline: '22 days before',
    earlyVotingStart: '45 days before',
    earlyVotingEnd: 'Saturday before',
    absenteeRequestDeadline: '10 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.elections.virginia.gov',
    electionOfficeUrl: 'https://www.elections.virginia.gov'
  },
  WA: {
    state: 'Washington',
    abbrev: 'WA',
    registrationDeadline: '8 days before',
    earlyVotingStart: 'N/A (all vote-by-mail)',
    earlyVotingEnd: 'N/A',
    absenteeRequestDeadline: 'N/A (automatic)',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://www.sos.wa.gov/elections',
    electionOfficeUrl: 'https://www.sos.wa.gov/elections'
  },
  WV: {
    state: 'West Virginia',
    abbrev: 'WV',
    registrationDeadline: '21 days before',
    earlyVotingStart: '13 days before',
    earlyVotingEnd: 'Saturday before',
    absenteeRequestDeadline: '7 days before',
    idRequired: true,
    idType: 'strict',
    voterRegistrationUrl: 'https://www.sos.wv.gov/elections',
    electionOfficeUrl: 'https://www.sos.wv.gov/elections'
  },
  WI: {
    state: 'Wisconsin',
    abbrev: 'WI',
    registrationDeadline: '20 days before',
    earlyVotingStart: 'No designated early voting period',
    earlyVotingEnd: 'N/A',
    absenteeRequestDeadline: '5 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://elections.wi.gov',
    electionOfficeUrl: 'https://elections.wi.gov'
  },
  WY: {
    state: 'Wyoming',
    abbrev: 'WY',
    registrationDeadline: '14 days before',
    earlyVotingStart: '40 days before',
    earlyVotingEnd: 'Day before',
    absenteeRequestDeadline: '7 days before',
    idRequired: false,
    idType: 'non-strict',
    voterRegistrationUrl: 'https://sos.wyo.gov/elections',
    electionOfficeUrl: 'https://sos.wyo.gov/elections'
  }
};

export function getStateByAbbrev(abbrev: string): StateData | undefined {
  return stateData[abbrev.toUpperCase()];
}

export function getStateByName(name: string): StateData | undefined {
  const normalized = name.toLowerCase();
  return Object.values(stateData).find(
    s => s.state.toLowerCase() === normalized || s.abbrev.toLowerCase() === normalized
  );
}

export function getAllStates(): StateData[] {
  return Object.values(stateData);
}