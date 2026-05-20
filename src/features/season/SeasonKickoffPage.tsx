import { Link, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { getCountryFlag } from '../../lib/countryFlags';
import { useGameStore } from '../../store/gameStore';
import type { UpdatePlanMode } from './types';

export function SeasonKickoffPage() {
    const navigate = useNavigate();
    const seasonNumber = useGameStore((state) => state.seasonNumber);
    const currentRound = useGameStore((state) => state.currentRound);
    const updatePlan = useGameStore((state) => state.updatePlan);
    const updatesRemaining = useGameStore((state) => state.updatesRemaining);
    const updatePlanConfirmed = useGameStore((state) => state.updatePlanConfirmed);
    const setUpdatePlan = useGameStore((state) => state.setUpdatePlan);
    const confirmUpdatePlan = useGameStore((state) => state.confirmUpdatePlan);
    const seasonSummaries = useGameStore((state) => state.seasonSummaries);
    const drivers = useGameStore((state) => state.drivers);
    const teams = useGameStore((state) => state.teams);

    const latestSummary = seasonSummaries[seasonSummaries.length - 1];

    const topTeams = [...teams].sort((a, b) => b.points - a.points).slice(0, 3);
    const topDrivers = [...drivers].sort((a, b) => b.overall - a.overall).slice(0, 3);

    if (currentRound > 0 || updatePlanConfirmed) {
        return (
            <div className="space-y-6">
                <SectionHeader eyebrow="Season Start" title="Season Already Started" description="Your update plan is already locked in for this year." />
                <Card title="Continue">
                    <Link to="/" className="rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white inline-block">Back to Dashboard</Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <SectionHeader eyebrow="Season Start" title={`${seasonNumber} Season Kickoff`} description="Review key changes, then lock your factory update strategy." />

            <div className="grid gap-4 xl:grid-cols-2">
                <Card title="Last Season Top 3 Teams">
                    <div className="space-y-2 text-sm text-zinc-200">
                        {topTeams.map((team, index) => (
                            <div key={team.id}>
                                #{index + 1} {getCountryFlag(team.country)} {team.name} · {team.points} pts
                            </div>
                        ))}
                    </div>
                </Card>
                <Card title="Hall of Fame Snapshot (Top OVR Drivers)">
                    <div className="space-y-2 text-sm text-zinc-200">
                        {topDrivers.map((driver, index) => (
                            <div key={driver.id}>
                                #{index + 1} {getCountryFlag(driver.country)} {driver.name} · OVR {driver.overall}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {latestSummary ? (
                <Card title="What changed this offseason">
                    <p className="text-sm text-zinc-300">Retirements: {latestSummary.retirements.length} · New drivers: {latestSummary.newDrivers.length}</p>
                </Card>
            ) : null}

            <Card title="Choose and confirm your update plan">
                <div className="grid gap-3 md:grid-cols-3">
                    {(['safe', 'medium', 'aggressive'] as UpdatePlanMode[]).map((plan) => (
                        <button key={plan} onClick={() => setUpdatePlan(plan)} className={`rounded-2xl border px-4 py-3 text-left ${updatePlan === plan ? 'border-red-400/60 bg-red-500/20' : 'border-white/10 bg-white/5'}`}>
                            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">{plan}</div>
                        </button>
                    ))}
                </div>
                <p className="mt-3 text-sm text-zinc-300">Planned updates this season: <span className="font-semibold text-white">{updatesRemaining}</span></p>
                <button
                    onClick={() => {
                        const result = confirmUpdatePlan();
                        if (result.ok) navigate('/team');
                    }}
                    className="mt-4 rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white hover:opacity-90"
                >
                    Confirm Plan & Start Season
                </button>
            </Card>
        </div>
    );
}
