import React from 'react';
import { Listing } from '../context/ListingsContext';
interface BeneficiaryOrg {
  id: string;
  name: string;
  county: string;
  distance: number;
  capacity: number;
}
const beneficiaries: BeneficiaryOrg[] = [{
  id: '1',
  name: 'Nairobi Food Bank',
  county: 'Nairobi',
  distance: 2.5,
  capacity: 100
}, {
  id: '2',
  name: 'Kisumu Care Centre',
  county: 'Kisumu',
  distance: 1.8,
  capacity: 50
}, {
  id: '3',
  name: 'Mombasa Community Kitchen',
  county: 'Mombasa',
  distance: 3.2,
  capacity: 75
}, {
  id: '4',
  name: 'Eldoret Feeding Program',
  county: 'Eldoret',
  distance: 4.1,
  capacity: 60
}, {
  id: '5',
  name: 'Nakuru Charity Centre',
  county: 'Nakuru',
  distance: 2.9,
  capacity: 80
}, {
  id: '6',
  name: 'Machakos Outreach',
  county: 'Machakos',
  distance: 5.3,
  capacity: 40
}];
export const matchListings = (listing: Omit<Listing, 'id' | 'postedAt' | 'status' | 'matches'>) => {
  if (listing.type === 'Biodegradable' || listing.type === 'Non-Biodegradable') {
    return [];
  }
  const {
    county
  } = listing;
  const sortedBeneficiaries = [...beneficiaries].sort((a, b) => {
    if (a.county === county && b.county !== county) return -1;
    if (a.county !== county && b.county === county) return 1;
    if (a.county === county && b.county === county) {
      return a.distance - b.distance;
    }
    return a.distance - b.distance;
  });
  const matches = sortedBeneficiaries.slice(0, 3).map(ben => {
    const sameCounty = ben.county === county;
    let score = 0;
    let rationale = '';
    if (sameCounty) {
      score += 50;
      rationale = `Same county match (${ben.county})`;
    } else {
      score += 25;
      rationale = `Nearby county (${ben.distance.toFixed(1)}km away)`;
    }
    if (ben.capacity > 70) {
      score += 30;
      rationale += `, High capacity (${ben.capacity}%)`;
    } else if (ben.capacity > 40) {
      score += 15;
      rationale += `, Medium capacity (${ben.capacity}%)`;
    } else {
      rationale += `, Limited capacity (${ben.capacity}%)`;
    }
    return {
      id: ben.id,
      name: ben.name,
      distance: ben.distance,
      score,
      rationale
    };
  });
  return matches;
};