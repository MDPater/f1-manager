import { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useGameStore } from '../../store/gameStore';
import type { UpdatePlanMode } from '../season/types';

export function FactoryPage() {
  const playerEngineer = useGameStore((s) => s.engineers.find((e) => e.id === s.playerEngineerId));
  const playerChief = useGameStore((s) => s.pitCrewChiefs.find((c) => c.id === s.playerPitCrewChiefId));
  const updatePlan = useGameStore((s) => s.updatePlan);
  const updatePlanConfirmed = useGameStore((s) => s.updatePlanConfirmed);
  const plannedUpgrades = useGameStore((s) => s.plannedUpgrades);
  const updatesRemaining = useGameStore((s) => s.updatesRemaining);
  const setUpdatePlan = useGameStore((s) => s.setUpdatePlan);
  const confirmUpdatePlan = useGameStore((s) => s.confirmUpdatePlan);
  const currentRound = useGameStore((s) => s.currentRound);
  const lastUpgradeReport = useGameStore((s) => s.lastUpgradeReport);
  const [msg, setMsg] = useState<string | null>(null);

  const planDescriptions: Record<UpdatePlanMode, string> = {
    safe: '2-3 updates, better consistency and stronger average gains.',
    medium: 'Balanced cadence and risk through the year.',
    aggressive: 'Around 5 updates with more volatility and lower reliability.',
  };

  return <div className="space-y-6 md:space-y-8">
    <SectionHeader eyebrow="Development" title="Factory" description="Choose and confirm your yearly update plan before Round 1. After confirmation, updates arrive automatically during the season." />
    <Card title="Factory leadership">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-zinc-200">Engineer: <span className="font-semibold text-white">{playerEngineer?.name ?? 'Unassigned'}</span><div className="text-sm">Dev {playerEngineer?.developmentSkill ?? 0} · Consistency {playerEngineer?.consistency ?? 0}</div></div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-zinc-200">Pit Crew Chief: <span className="font-semibold text-white">{playerChief?.name ?? 'Unassigned'}</span><div className="text-sm">Reliability {playerChief?.reliabilitySkill ?? 0} · Consistency {playerChief?.consistencySkill ?? 0}</div></div>
      </div>
    </Card>
    <Card title="Season plan selection">
      <div className="grid gap-3 md:grid-cols-3">
        {(['safe', 'medium', 'aggressive'] as UpdatePlanMode[]).map((plan) => (
          <button key={plan} disabled={updatePlanConfirmed} onClick={() => setMsg(setUpdatePlan(plan).message)} className={`rounded-2xl border px-4 py-4 text-left ${updatePlan === plan ? 'border-red-400/60 bg-red-500/20' : 'border-white/10 bg-white/5'} ${updatePlanConfirmed ? 'opacity-60' : 'hover:bg-white/10'}`}>
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">{plan}</div>
            <div className="mt-2 text-sm text-zinc-200">{planDescriptions[plan]}</div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-zinc-300">Selected: <span className="font-semibold text-white">{updatePlan}</span> · Planned updates: <span className="font-semibold text-white">{updatesRemaining}</span> · Current round: <span className="font-semibold text-white">{currentRound + 1}</span></p>
      <div className="mt-4">
        <button disabled={updatePlanConfirmed} className="rounded-xl border border-red-400/40 bg-red-500/20 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500/35 disabled:opacity-60" onClick={() => setMsg(confirmUpdatePlan().message)}>Confirm Update Plan</button>
      </div>
      {msg ? <p className="mt-3 text-sm text-red-100">{msg}</p> : null}
    </Card>
    <Card title="Scheduled upgrades (after confirmation)">
      {plannedUpgrades.length === 0 ? <p className="text-sm text-zinc-400">No schedule yet. Confirm your plan before the season starts.</p> : <div className="space-y-2">{plannedUpgrades.map((u) => <div key={u.id} className="rounded-xl bg-white/5 p-3 text-sm text-zinc-200">Round {u.roundNumber}: <span className="font-semibold text-white">{u.part}</span> (+{u.minGain} to +{u.maxGain}) · est. ${u.estimatedCost.toLocaleString()} · {u.applied ? 'Applied' : 'Pending'}</div>)}</div>}
    </Card>
    <Card title="Latest factory update result">
      {lastUpgradeReport ? (
        <p className="text-sm text-zinc-200">
          Season {lastUpgradeReport.seasonNumber}, Round {lastUpgradeReport.roundNumber}: {lastUpgradeReport.part} improved by +{lastUpgradeReport.gain} for ${lastUpgradeReport.cost.toLocaleString()}.
        </p>
      ) : (
        <p className="text-sm text-zinc-400">No update has been applied yet this season.</p>
      )}
    </Card>
  </div>;
}
