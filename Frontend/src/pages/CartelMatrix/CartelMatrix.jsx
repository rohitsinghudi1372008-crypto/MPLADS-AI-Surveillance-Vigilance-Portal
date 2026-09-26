import React, { useState, useEffect, useRef } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/common/Button';
import { api } from '../../services/api';
import {
  Network,
  Building,
  User,
  FolderGit2,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Info,
  Layers,
  Scale,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Fingerprint,
  Share2,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PentagonCard } from '../../components/common/PentagonCard';
import { useLanguage } from '../../context/LanguageContext';

// Comprehensive Syndicate Master Data with rich institutional forensic evidence
const SYNDICATE_NODES = {
  'DIR-01': {
    id: 'DIR-01',
    name: 'R. K. Agarwal',
    type: 'director',
    category: 'Common Director / ROC',
    risk: 95,
    title: 'Shared Managing Director & Shadow Controller',
    badge: '95% COLLUSION PROBABILITY',
    din: 'DIN: 08923411 (ROC Kanpur)',
    details: 'Central mastermind behind the Eastern UP syndicate. Holds 40% equity in Apex Infra, acts as common authorized bank signatory for Shiva Buildcon, and registered identical mobile and email on MCA portal for Purvanchal Infratech.',
    connectedVendors: ['Apex Infra & BuildTech Pvt Ltd', 'Shiva Buildcon Pvt Ltd', 'Purvanchal Infratech'],
    totalClusterProjects: 17,
    totalDisbursedCr: 8.40,
    forensicEvidence: [
      'Identical registered ROC phone (+91 94150 XXXXX) across 3 competing bidding firms',
      'Common authorized signatory on Axis Bank Escrow accounts',
      'Cross-guarantee collateral submitted in 5 municipal infrastructure tenders'
    ],
    districts: ['Varanasi', 'Jaunpur', 'Kamrup Metro', 'Mirzapur', 'Ghazipur']
  },
  'V-01': {
    id: 'V-01',
    name: 'Apex Infra & BuildTech Pvt Ltd',
    type: 'vendor',
    category: 'Primary Contractor (High Risk)',
    risk: 89,
    title: 'L1 Awarded Contractor (Syndicate Leader)',
    badge: 'L1 PRIMARY RECIPIENT',
    gstin: 'GSTIN: 09AAACA1234F1Z5',
    details: 'Primary beneficiary of Varanasi & Jaunpur civil works tenders. Consistently wins bids within 0.8% of government reserve price while dummy sister firms submit inflated cover bids.',
    districts: ['Varanasi', 'Jaunpur', 'Kamrup Metro'],
    projects: 8,
    disbursedCr: 4.20,
    avgRiskScore: 89,
    alerts: 4,
    forensicEvidence: [
      'Milestone photos for MPLAD-00124 duplicated from historical 2024 Jaunpur road project (dHash match)',
      'ROC address identical to registered corporate office of Shiva Buildcon',
      '8 out of 9 recent tenders won without competitive price variance'
    ],
    targetProjects: ['PRJ-124', 'PRJ-892', 'PRJ-518']
  },
  'V-02': {
    id: 'V-02',
    name: 'Shiva Buildcon Pvt Ltd',
    type: 'vendor',
    category: 'Cover Bidder / L2 Tender Ring',
    risk: 84,
    title: 'L2 Cover / Courtesy Bidder',
    badge: 'L2 COURTESY BIDDER',
    gstin: 'GSTIN: 09BBBCA5678G2Z1',
    details: 'Participated in 6 consecutive tenders alongside Apex Infra, intentionally submitting bids priced exactly 3.8% – 4.2% higher to simulate competitive bidding compliance without risking loss.',
    districts: ['Varanasi', 'Mirzapur'],
    projects: 5,
    disbursedCr: 2.40,
    avgRiskScore: 84,
    alerts: 3,
    forensicEvidence: [
      'Mathematical bid clustering: Every tender submission exactly +4% over Apex Infra',
      'Bank guarantee counter-indemnified by R. K. Agarwal personal assets',
      'Shares primary chartered accountant firm with Apex Infra'
    ],
    targetProjects: ['PRJ-124', 'PRJ-892']
  },
  'V-03': {
    id: 'V-03',
    name: 'Purvanchal Infratech',
    type: 'vendor',
    category: 'Shadow Bidder / L3 Disqualified',
    risk: 79,
    title: 'L3 Disqualified / Compliance Dummy',
    badge: 'L3 SHADOW PARTICIPANT',
    gstin: 'GSTIN: 09CCCCA9012H3Z8',
    details: 'Used to fulfill the statutory 3-bidder minimum procurement mandate. Regularly uploads technically defective documentation to ensure timely disqualification after bid opening.',
    districts: ['Varanasi', 'Ghazipur', 'Kamrup Metro'],
    projects: 4,
    disbursedCr: 1.80,
    avgRiskScore: 79,
    alerts: 2,
    forensicEvidence: [
      'Submitted e-tenders from identical public IP address (122.161.44.18) within 4 minutes of Apex Infra',
      'Technical envelope intentionally lacked standard structural engineer vetting certificate',
      'Won Guwahati LED infrastructure contract via inter-state proxy arrangement'
    ],
    targetProjects: ['PRJ-124', 'PRJ-518']
  },
  'PRJ-124': {
    id: 'PRJ-124',
    name: 'MPLAD-2026-00124',
    title: 'Varanasi Multi-Modal Arterial Road & Paver Upgrade',
    type: 'project',
    category: 'Public Work (Flagged Tender)',
    risk: 94,
    badge: 'CRITICAL AUDIT HOLD',
    details: 'Sewapuri constituency civil work sanctioned at ₹48.0 Lakhs. Awarded to Apex Infra following a 3-firm tender where all 3 participants were controlled by R. K. Agarwal.',
    cost: '₹48.0 Lakhs',
    district: 'Varanasi (Sewapuri)',
    awardedTo: 'Apex Infra & BuildTech Pvt Ltd',
    bidders: ['Apex Infra (L1 - ₹47.8L)', 'Shiva Buildcon (L2 - ₹49.7L)', 'Purvanchal Infratech (L3 - DQ)'],
    forensicEvidence: [
      'Photographic milestone evidence re-used from 2024 Jaunpur road completion',
      'HHI concentration score 10,000 within ward cluster',
      'Payments frozen under PFMS Rule 109 vigilance order'
    ]
  },
  'PRJ-892': {
    id: 'PRJ-892',
    name: 'MPLAD-2024-00892',
    title: 'Jaunpur Rural Link Corridor (Completed 2024)',
    type: 'project',
    category: 'Public Work (Evidence Source)',
    risk: 76,
    badge: 'HISTORICAL BENCHMARK',
    details: 'Completed civil construction work in Jaunpur district. Identified by computer vision forensic engine as the genuine ground-truth source from which photos were cropped and reused.',
    cost: '₹64.0 Lakhs',
    district: 'Jaunpur (Machhlishahr)',
    awardedTo: 'Apex Infra & BuildTech Pvt Ltd',
    bidders: ['Apex Infra (L1 - ₹63.5L)', 'Shiva Buildcon (L2 - ₹66.1L)'],
    forensicEvidence: [
      'Original camera EXIF metadata timestamp: November 14, 2024',
      'Identical GPS polygon boundary coordinates matching 2026 Varanasi claim'
    ]
  },
  'PRJ-518': {
    id: 'PRJ-518',
    name: 'MPLAD-2026-00518',
    title: 'Kamrup Metro Solar High-Mast LED Lighting Grid',
    type: 'project',
    category: 'Public Work (Inter-State Link)',
    risk: 82,
    badge: 'INTER-STATE SYNDICATE',
    details: 'Guwahati constituency electrical installation work awarded to Purvanchal Infratech. Demonstrates inter-state spillover of the Uttar Pradesh contractor ring.',
    cost: '₹51.0 Lakhs',
    district: 'Kamrup Metro (Guwahati)',
    awardedTo: 'Purvanchal Infratech',
    bidders: ['Purvanchal Infratech (L1 - ₹50.6L)', 'Apex Infra (L2 - ₹52.4L)'],
    forensicEvidence: [
      'Inter-state bank guarantee issued from same Varanasi SBI branch counter',
      'Identical equipment procurement serial numbers logged on e-Way bill'
    ]
  }
};

// All network connection edges with relationship semantics
const EDGES = [
  // Director -> Vendors (Ownership / ROC)
  { id: 'E-DIR-V1', source: 'DIR-01', target: 'V-01', type: 'ownership', label: '40% Equity & ROC', color: '#DB2777', dash: '6,4' },
  { id: 'E-DIR-V2', source: 'DIR-01', target: 'V-02', type: 'ownership', label: 'Signatory Partner', color: '#DB2777', dash: '6,4' },
  { id: 'E-DIR-V3', source: 'DIR-01', target: 'V-03', type: 'ownership', label: 'Common Phone/GST', color: '#DB2777', dash: '6,4' },

  // Apex Infra -> Projects (Primary Awards)
  { id: 'E-V1-P1', source: 'V-01', target: 'PRJ-124', type: 'awarded', label: 'L1 Awarded (₹48L)', color: '#DC2626', width: 3 },
  { id: 'E-V1-P2', source: 'V-01', target: 'PRJ-892', type: 'awarded', label: 'Historical Award (₹64L)', color: '#DC2626', width: 2 },
  { id: 'E-V1-P3', source: 'V-01', target: 'PRJ-518', type: 'bid', label: 'L2 Complementary Bid', color: '#94A3B8', dash: '4,4', width: 1.5 },

  // Shiva Buildcon -> Projects (Cover Bidding)
  { id: 'E-V2-P1', source: 'V-02', target: 'PRJ-124', type: 'cover', label: 'L2 Cover Bid (+4%)', color: '#F59E0B', dash: '5,4', width: 2 },
  { id: 'E-V2-P2', source: 'V-02', target: 'PRJ-892', type: 'cover', label: 'L2 Cover Bid (+4%)', color: '#F59E0B', dash: '5,4', width: 1.5 },

  // Purvanchal Infratech -> Projects (Shadow / Inter-state Award)
  { id: 'E-V3-P1', source: 'V-03', target: 'PRJ-124', type: 'shadow', label: 'L3 Disqualified (Same IP)', color: '#94A3B8', dash: '4,4', width: 1.5 },
  { id: 'E-V3-P3', source: 'V-03', target: 'PRJ-518', type: 'awarded', label: 'L1 Awarded (₹51L)', color: '#DC2626', width: 2.5 }
];

export const CartelMatrix = () => {
  const { t } = useLanguage();
  const [selectedNodeId, setSelectedNodeId] = useState('V-01');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'ownership' | 'bidding' | 'projects'
  const [hoveredNodeId, setHoveredNodeId] = useState(null);
  const navigate = useNavigate();

  const selectedNode = SYNDICATE_NODES[selectedNodeId] || SYNDICATE_NODES['V-01'];

  const getNodeIcon = (type) => {
    switch (type) {
      case 'director': return User;
      case 'project': return FolderGit2;
      default: return Building;
    }
  };

  // Determine if a link should be highlighted based on active selection / hover
  const isEdgeHighlighted = (edge) => {
    const focusId = hoveredNodeId || selectedNodeId;
    if (!focusId) return true;
    return edge.source === focusId || edge.target === focusId;
  };

  // Determine if an edge passes the active category filter
  const isEdgeVisible = (edge) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'ownership') return edge.type === 'ownership';
    if (activeFilter === 'bidding') return edge.type === 'cover' || edge.type === 'shadow';
    if (activeFilter === 'projects') return edge.type === 'awarded';
    return true;
  };

  return (
    <PageLayout
      title={t('cartel_matrix_title', 'Vendor Cartel & Monopoly Matrix')}
      subtitle={t('cartel_matrix_sub', 'Graph-neural and ROC intelligence tracking cross-company directorships, collusive cover bidding, and monopolistic public works allocation.')}
      breadcrumbs={[t('nav_exec_dashboard', 'Dashboard'), t('nav_cartel_matrix', 'Cartel Matrix')]}
      badge={
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-xs flex items-center gap-1.5">
          <Scale className="w-3.5 h-3.5 text-amber-700" />
          {t('MONOPOLY SYNDICATE ALERT (HHI: 4,820)', 'MONOPOLY SYNDICATE ALERT (HHI: 4,820)')}
        </span>
      }
    >
      {/* 3 Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <PentagonCard
          index={0}
          title={t('Monopolized Districts', 'Monopolized Districts')}
          value={t('3 Districts', '3 Districts')}
          subtitle={t('Varanasi, Jaunpur & Kamrup', 'Varanasi, Jaunpur & Kamrup')}
          icon={MapPin}
          variant="danger"
        />

        <PentagonCard
          index={1}
          title={t('Syndicate Tender Outlay', 'Syndicate Tender Outlay')}
          value="₹8.40 Cr"
          subtitle={t('17 Interlinked Public Works', '17 Interlinked Public Works')}
          icon={Building}
          variant="warning"
        />

        <PentagonCard
          index={2}
          title={t('Shared Shadow Directors', 'Shared Shadow Directors')}
          value={t('1 Syndicate Ring', '1 Syndicate Ring')}
          subtitle={t('R. K. Agarwal across 3 firms', 'R. K. Agarwal across 3 firms')}
          icon={User}
          variant="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Network Graph Canvas */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs relative flex flex-col min-h-[580px]">
          {/* Graph Header & Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-100 shadow-2xs">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900 block">{t('cartel_syndicate_map', 'Eastern UP Infrastructure Tender Syndicate Cluster')}</span>
                <span className="text-[11px] text-slate-500 font-medium">{t('cartel_interactive_topology', 'Bipartite Projection: Common Director ➔ Contractor Entities ➔ Municipal Works')}</span>
              </div>
            </div>

            {/* Filter Toggle Pills */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200 text-[11px] font-semibold">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('cartel_all_links', 'All Links')}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('ownership')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'ownership'
                    ? 'bg-pink-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('cartel_roc_ownership', 'ROC Ownership')}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('bidding')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'bidding'
                    ? 'bg-amber-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('cartel_cover_bids', 'Cover Bids')}
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('projects')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  activeFilter === 'projects'
                    ? 'bg-rose-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t('cartel_tender_awards', 'Tender Awards')}
              </button>
            </div>
          </div>

          {/* Interactive Visual Graph Canvas */}
          <div className="flex-1 w-full relative min-h-[460px] bg-gradient-to-b from-slate-50/70 via-slate-50/40 to-slate-100/60 rounded-xl border border-slate-200/90 overflow-hidden select-none">
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* SVG Connecting Links Layer with Mathematical Coordinates */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="directorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DB2777" />
                  <stop offset="100%" stopColor="#BE185D" />
                </linearGradient>
                <linearGradient id="awardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DC2626" />
                  <stop offset="100%" stopColor="#B91C1C" />
                </linearGradient>
                <linearGradient id="coverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              {/* Render Every Link with Clean Dynamic Coordinates */}
              {EDGES.map((edge) => {
                if (!isEdgeVisible(edge)) return null;
                const isHighlight = isEdgeHighlighted(edge);

                // Precise Anchor Percentage Map
                const anchorMap = {
                  'DIR-01': { x: '50%', y: '16%' },
                  'V-01':   { x: '19%', y: '48%' },
                  'V-02':   { x: '50%', y: '48%' },
                  'V-03':   { x: '81%', y: '48%' },
                  'PRJ-124':{ x: '19%', y: '84%' },
                  'PRJ-892':{ x: '50%', y: '84%' },
                  'PRJ-518':{ x: '81%', y: '84%' }
                };

                const sourcePt = anchorMap[edge.source];
                const targetPt = anchorMap[edge.target];
                if (!sourcePt || !targetPt) return null;

                const strokeColor = isHighlight ? edge.color : '#CBD5E1';
                const strokeWidth = isHighlight ? (edge.width || 2.5) : 1;
                const opacity = isHighlight ? 1 : 0.25;

                return (
                  <g key={edge.id} className="transition-all duration-300">
                    <line
                      x1={sourcePt.x}
                      y1={sourcePt.y}
                      x2={targetPt.x}
                      y2={targetPt.y}
                      stroke={strokeColor}
                      strokeWidth={strokeWidth}
                      strokeDasharray={edge.dash || undefined}
                      strokeOpacity={opacity}
                      strokeLinecap="round"
                    />
                    {/* Glowing highlight indicator for active connections */}
                    {isHighlight && (
                      <circle
                        cx={`calc((${sourcePt.x} + ${targetPt.x}) / 2)`}
                        cy={`calc((${sourcePt.y} + ${targetPt.y}) / 2)`}
                        r="3"
                        fill={edge.color}
                        opacity="0.8"
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Positioned Interactive Nodes */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              {/* LEVEL 1: Master Director Node (Top Center) */}
              <div
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                style={{ left: '50%', top: '15%' }}
                onMouseEnter={() => setHoveredNodeId('DIR-01')}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <button
                  type="button"
                  onClick={() => setSelectedNodeId('DIR-01')}
                  className={`px-4 py-2.5 rounded-xl border-2 flex items-center gap-2.5 text-xs font-bold transition-all shadow-md cursor-pointer ${
                    selectedNodeId === 'DIR-01'
                      ? 'bg-pink-50 border-pink-600 text-pink-900 ring-4 ring-pink-200 scale-105'
                      : 'bg-white border-pink-300 text-pink-900 hover:border-pink-500 hover:shadow-lg'
                  }`}
                >
                  <div className="p-1 rounded-lg bg-pink-100 text-pink-700">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block font-bold">R. K. Agarwal (Common Director)</span>
                    <span className="text-[10px] text-pink-700 font-mono font-normal">DIN: 08923411 • 3 Linked Companies</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-pink-600 text-white font-mono font-bold tracking-tight">
                    95% COLLUSION
                  </span>
                </button>
              </div>

              {/* LEVEL 2: Vendor Nodes (Middle Tier: 19%, 50%, 81%) */}
              {/* Vendor 1: Apex Infra (L1) */}
              <div
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 w-[28%] max-w-[210px]"
                style={{ left: '19%', top: '48%' }}
                onMouseEnter={() => setHoveredNodeId('V-01')}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <button
                  type="button"
                  onClick={() => setSelectedNodeId('V-01')}
                  className={`w-full p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 text-xs transition-all shadow-md cursor-pointer ${
                    selectedNodeId === 'V-01'
                      ? 'bg-rose-50 border-rose-600 text-rose-950 ring-4 ring-rose-200 scale-105'
                      : 'bg-white border-rose-300 text-slate-800 hover:border-rose-500 hover:shadow-lg'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-rose-100 text-rose-700">
                    <Building className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-center leading-tight">Apex Infra & BuildTech</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-rose-700 font-mono font-bold">8 Works</span>
                    <span className="text-slate-300">•</span>
                    <span className="px-1.5 py-0.2 rounded bg-rose-100 text-rose-800 font-mono font-bold">89% Risk</span>
                  </div>
                </button>
              </div>

              {/* Vendor 2: Shiva Buildcon (L2) */}
              <div
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 w-[28%] max-w-[210px]"
                style={{ left: '50%', top: '48%' }}
                onMouseEnter={() => setHoveredNodeId('V-02')}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <button
                  type="button"
                  onClick={() => setSelectedNodeId('V-02')}
                  className={`w-full p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 text-xs transition-all shadow-md cursor-pointer ${
                    selectedNodeId === 'V-02'
                      ? 'bg-amber-50 border-amber-600 text-amber-950 ring-4 ring-amber-200 scale-105'
                      : 'bg-white border-amber-300 text-slate-800 hover:border-amber-500 hover:shadow-lg'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
                    <Building className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-center leading-tight">Shiva Buildcon Pvt Ltd</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-amber-800 font-mono font-bold">5 Works</span>
                    <span className="text-slate-300">•</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono font-bold">84% Risk</span>
                  </div>
                </button>
              </div>

              {/* Vendor 3: Purvanchal Infratech (L3) */}
              <div
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 w-[28%] max-w-[210px]"
                style={{ left: '81%', top: '48%' }}
                onMouseEnter={() => setHoveredNodeId('V-03')}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <button
                  type="button"
                  onClick={() => setSelectedNodeId('V-03')}
                  className={`w-full p-3 rounded-xl border-2 flex flex-col items-center gap-1.5 text-xs transition-all shadow-md cursor-pointer ${
                    selectedNodeId === 'V-03'
                      ? 'bg-amber-50 border-amber-600 text-amber-950 ring-4 ring-amber-200 scale-105'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-amber-500 hover:shadow-lg'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                    <Building className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-center leading-tight">Purvanchal Infratech</span>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <span className="text-amber-800 font-mono font-bold">4 Works</span>
                    <span className="text-slate-300">•</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-mono font-bold">79% Risk</span>
                  </div>
                </button>
              </div>

              {/* LEVEL 3: Project Nodes (Bottom Tier: 19%, 50%, 81%) */}
              {/* Project 1: MPLAD-00124 */}
              <div
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                style={{ left: '19%', top: '84%' }}
                onMouseEnter={() => setHoveredNodeId('PRJ-124')}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <button
                  type="button"
                  onClick={() => setSelectedNodeId('PRJ-124')}
                  className={`px-3 py-2 rounded-xl border-2 text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    selectedNodeId === 'PRJ-124'
                      ? 'bg-blue-100 border-blue-600 text-blue-950 ring-4 ring-blue-200 scale-105'
                      : 'bg-white border-blue-300 text-blue-900 hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <FolderGit2 className="w-4 h-4 text-blue-600" />
                  <span>MPLAD-00124 (Varanasi Road)</span>
                </button>
              </div>

              {/* Project 2: MPLAD-00892 */}
              <div
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                style={{ left: '50%', top: '84%' }}
                onMouseEnter={() => setHoveredNodeId('PRJ-892')}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <button
                  type="button"
                  onClick={() => setSelectedNodeId('PRJ-892')}
                  className={`px-3 py-2 rounded-xl border-2 text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    selectedNodeId === 'PRJ-892'
                      ? 'bg-blue-100 border-blue-600 text-blue-950 ring-4 ring-blue-200 scale-105'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <FolderGit2 className="w-4 h-4 text-slate-600" />
                  <span>MPLAD-00892 (Jaunpur 2024)</span>
                </button>
              </div>

              {/* Project 3: MPLAD-00518 */}
              <div
                className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                style={{ left: '81%', top: '84%' }}
                onMouseEnter={() => setHoveredNodeId('PRJ-518')}
                onMouseLeave={() => setHoveredNodeId(null)}
              >
                <button
                  type="button"
                  onClick={() => setSelectedNodeId('PRJ-518')}
                  className={`px-3 py-2 rounded-xl border-2 text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                    selectedNodeId === 'PRJ-518'
                      ? 'bg-blue-100 border-blue-600 text-blue-950 ring-4 ring-blue-200 scale-105'
                      : 'bg-white border-slate-300 text-slate-700 hover:border-blue-500 hover:shadow-md'
                  }`}
                >
                  <FolderGit2 className="w-4 h-4 text-slate-600" />
                  <span>MPLAD-00518 (Guwahati LED)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Legend Footnote */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-pink-600" />
              <span>Pink Dashed: <strong>Shared Director / ROC Ownership</strong></span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Amber Dashed: <strong>Cover Bid Pattern (+4%)</strong></span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Red Solid: <strong>Primary L1 Tender Award</strong></span>
            </span>
          </div>
        </div>

        {/* Right Sidebar: Selected Entity Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <Card
            title={selectedNode.name}
            subtitle={selectedNode.title || 'Entity Intelligence Dossier'}
            icon={getNodeIcon(selectedNode.type)}
            riskAccent={selectedNode.risk >= 85 ? 'critical' : 'high'}
            className="space-y-4 shadow-sm border-slate-200/90"
          >
            {/* Node Role & Registration Header */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-xs text-slate-500 font-medium">{t('Syndicate Role:', 'Syndicate Role:')}</span>
              <span className="text-xs font-bold uppercase font-mono text-purple-900 bg-purple-100/80 px-2 py-0.5 rounded border border-purple-200">
                {t(selectedNode.badge, selectedNode.badge || selectedNode.type)}
              </span>
            </div>

            {/* Economic Monopoly HHI Metric */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50 border border-rose-200/80">
              <div className="flex items-center gap-1.5 text-xs text-rose-900 font-bold">
                <Scale className="w-4 h-4 text-rose-700" />
                <span>{t('Market Concentration:', 'Market Concentration:')}</span>
              </div>
              <span className="text-xs font-black font-mono text-rose-800">
                {t('4,820 HHI (Severe Monopoly)', '4,820 HHI (Severe Monopoly)')}
              </span>
            </div>

            {/* Risk / Collusion Level */}
            {selectedNode.risk && (
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-xs text-slate-600 font-medium">{t('Collusion Risk Score:', 'Collusion Risk Score:')}</span>
                <span className="text-sm font-black font-mono text-rose-700 flex items-center gap-1">
                  <ShieldAlert className="w-4 h-4 text-rose-600 inline" />
                  {selectedNode.risk}% {t('cartel_critical_risk', 'Critical Risk')}
                </span>
              </div>
            )}

            {/* Primary Details Text */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-1">{t('Intelligence Summary:', 'Intelligence Summary:')}</span>
              {t(selectedNode.details, selectedNode.details)}
            </div>

            {/* Forensic Evidence Checklist */}
            {selectedNode.forensicEvidence && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                  <Fingerprint className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t('cartel_forensic_evidence', 'Key Audit Evidence:')}</span>
                </span>
                <div className="space-y-1.5">
                  {selectedNode.forensicEvidence.map((ev, i) => (
                    <div key={i} className="p-2 rounded-lg bg-rose-50/60 border border-rose-100 text-[11px] text-slate-800 flex items-start gap-1.5 leading-snug">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                      <span>{t(ev, ev)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Affected Districts */}
            {selectedNode.districts && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t('Active Districts:', 'Active Districts:')}</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedNode.districts.map((d, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-md text-xs bg-slate-100 text-slate-800 border border-slate-200 font-medium">
                      {t(d, d)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Connected Partner Companies */}
            {selectedNode.connectedVendors && (
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider flex items-center gap-1">
                  <Share2 className="w-3.5 h-3.5 text-pink-600" />
                  <span>{t('cartel_director_interlocking', 'Interlinked Sister Companies:')}</span>
                </span>
                <div className="space-y-1">
                  {selectedNode.connectedVendors.map((v, i) => (
                    <div key={i} className="p-2 rounded-lg bg-pink-50/60 text-xs text-pink-950 border border-pink-200 flex items-center justify-between">
                      <span className="font-semibold">{v}</span>
                      <span className="text-[10px] text-pink-700 font-mono font-bold bg-pink-100 px-1.5 py-0.5 rounded border border-pink-300">
                        {t('Common ROC', 'Common ROC')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            {selectedNode.id === 'PRJ-124' || selectedNode.id === 'V-01' ? (
              <Button
                variant="danger"
                size="md"
                onClick={() => navigate('/project/MPLAD-2026-00124')}
                className="w-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                icon={ArrowRight}
                iconPosition="right"
              >
                {t('Investigate Flagged Tender (MPLAD-00124)', 'Investigate Flagged Tender (MPLAD-00124)')}
              </Button>
            ) : selectedNode.id === 'DIR-01' ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => setSelectedNodeId('V-01')}
                className="w-full text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shadow-xs"
                icon={Eye}
                iconPosition="right"
              >
                {t('Inspect Primary Operating Firm (Apex Infra)', 'Inspect Primary Operating Firm (Apex Infra)')}
              </Button>
            ) : null}
          </Card>

          {/* Institutional Statutory Guidance Box */}
          <div className="p-4 sm:p-5 bg-white border border-blue-200/90 rounded-2xl space-y-2 text-xs text-slate-600 border-l-4 border-l-blue-600 shadow-xs">
            <span className="font-bold flex items-center gap-2 text-slate-900">
              <div className="p-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                <Info className="w-3.5 h-3.5" />
              </div>
              <span>{t('Why is this flagged by MoSPI AI?', 'Why is this flagged by MoSPI AI?')}</span>
            </span>
            <p className="text-slate-600 leading-relaxed pl-7">
              {t('Competition Act Section 3 warning', 'Section 3(3) of the Competition Act, 2002 prohibits bid rigging and cartelization. When common directors control competing bidders who submit synthetic higher bids, government procurement funds are disbursed at inflated rates without authentic market discovery.')}
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
export default CartelMatrix;
