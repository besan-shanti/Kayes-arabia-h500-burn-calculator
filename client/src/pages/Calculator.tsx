import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Info, Zap } from 'lucide-react';

const BURN_RATE = 500; // kg/hr during burning stage (3rd stage)

export default function Calculator() {
  const [wasteWeight, setWasteWeight] = useState<string>('');
  const [showHowModal, setShowHowModal] = useState(false);

  const calculateTotalTime = (weight: number): { preheat: number; evaporation: number; burning: number; ashing: number; total: number } => {
    if (weight <= 0) return { preheat: 0, evaporation: 0, burning: 0, ashing: 0, total: 0 };
    
    const preheat = 20 / 60; // 20 minutes in hours
    const evaporation = weight / BURN_RATE; // Scales with weight at 500 kg/hr (1-2 hrs for 500kg)
    const burning = weight / BURN_RATE; // Based on 500 kg/hr
    const ashing = weight / BURN_RATE; // Scales with weight at 500 kg/hr (same ratio as evaporation)
    const total = preheat + evaporation + burning + ashing;
    
    return { preheat, evaporation, burning, ashing, total };
  };

  const burnCycle = wasteWeight ? calculateTotalTime(parseFloat(wasteWeight)) : { preheat: 0, evaporation: 0, burning: 0, ashing: 0, total: 0 };
  const isValidInput = wasteWeight && !isNaN(parseFloat(wasteWeight)) && parseFloat(wasteWeight) > 0;

  const formatTime = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    if (wholeHours === 0 && minutes === 0) return '0 min';
    if (wholeHours === 0) return `${minutes} min`;
    if (minutes === 0) return `${wholeHours} hr`;
    return `${wholeHours} hr ${minutes} min`;
  };

  const formatTimeDetailed = (hours: number): string => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  const getInputFormat = (): string => {
    const wholeHours = Math.floor(burnCycle.total);
    const minutes = Math.round((burnCycle.total - wholeHours) * 60);
    return `${wholeHours} ${minutes}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
      {/* Header with Kayes Arabia Branding */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-lg border-b-4 border-green-600">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/manus-storage/KayesArabiaLogowcontact_6e2e901e.png" 
                alt="Kayes Arabia Logo" 
                className="h-20 w-20 object-contain"
              />
            </div>
            {/* Brand Text */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white display-mono">Burn Time Calculator</h1>
              <p className="text-blue-100 text-sm mt-1">Kayes Arabia for Trading | H500 Incinerator</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Input Card */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-blue-100">
            <div className="space-y-6">
              {/* Input Section */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-blue-900">
                  Weight of Waste (kg)
                </label>
                <Input
                  type="number"
                  placeholder="Enter weight in kilograms"
                  value={wasteWeight}
                  onChange={(e) => setWasteWeight(e.target.value)}
                  className="text-lg h-12 border-2 border-blue-300 focus:border-blue-700 focus:ring-blue-700"
                  min="0"
                  step="100"
                />
                <p className="text-xs text-blue-700">
                  Burning rate: {BURN_RATE.toLocaleString()} kg/hr (during burning stage)
                </p>
              </div>

              {/* Result Section */}
              {isValidInput && (
                <div className="space-y-4">
                  {/* Total Time */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border-2 border-green-300">
                    <p className="text-sm font-medium text-blue-900 mb-2">Total Cycle Time</p>
                    <div className="text-5xl font-bold text-blue-900 display-mono mb-3">
                      {formatTime(burnCycle.total)}
                    </div>
                    <p className="text-xs text-blue-800">
                      {parseFloat(wasteWeight).toLocaleString()} kg waste
                    </p>
                    <div className="mt-3 pt-3 border-t border-green-300">
                      <p className="text-xs text-blue-900 font-semibold">Enter on machine: <span className="font-mono bg-white px-2 py-1 rounded">{getInputFormat()}</span></p>
                    </div>
                  </div>

                  {/* Cycle Breakdown */}
                  <div className="grid grid-cols-2 gap-3">
                    {/* Stage 1: Preheat */}
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-600">
                      <p className="text-xs font-semibold text-blue-900 mb-1">Stage 1: Preheat</p>
                      <p className="text-2xl font-bold text-blue-900 display-mono">{formatTimeDetailed(burnCycle.preheat)}</p>
                      <p className="text-xs text-blue-700 mt-1">~20 minutes</p>
                    </div>

                    {/* Stage 2: Evaporation */}
                    <div className="bg-amber-50 rounded-lg p-4 border-l-4 border-amber-600">
                      <p className="text-xs font-semibold text-amber-900 mb-1">Stage 2: Evaporation</p>
                      <p className="text-2xl font-bold text-amber-900 display-mono">{formatTimeDetailed(burnCycle.evaporation)}</p>
                      <p className="text-xs text-amber-700 mt-1">500 kg/hr</p>
                    </div>

                    {/* Stage 3: Burning */}
                    <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
                      <p className="text-xs font-semibold text-red-900 mb-1">Stage 3: Burning</p>
                      <p className="text-2xl font-bold text-red-900 display-mono">{formatTimeDetailed(burnCycle.burning)}</p>
                      <p className="text-xs text-red-700 mt-1">{BURN_RATE} kg/hr</p>
                    </div>

                    {/* Stage 4: Ashing */}
                    <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-slate-600">
                      <p className="text-xs font-semibold text-slate-900 mb-1">Stage 4: Ashing</p>
                      <p className="text-2xl font-bold text-slate-900 display-mono">{formatTimeDetailed(burnCycle.ashing)}</p>
                      <p className="text-xs text-slate-700 mt-1">500 kg/hr</p>
                    </div>
                  </div>
                </div>
              )}

              {!isValidInput && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-300">
                  <p className="text-blue-400 text-lg display-mono text-center">
                    Enter weight to calculate cycle time
                  </p>
                </div>
              )}

              {/* How Button */}
              <Button
                onClick={() => setShowHowModal(true)}
                className="w-full h-11 bg-blue-900 hover:bg-blue-800 text-white font-semibold flex items-center justify-center gap-2 border-2 border-blue-900"
              >
                <Info className="w-4 h-4" />
                How Does This Work?
              </Button>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
            <p className="text-sm text-orange-900">
              <span className="font-semibold">💡 Tip:</span> This calculator shows the complete burn cycle including preheat, evaporation, burning, and ashing stages. Always follow the <a href="/manus-storage/kayesarabiaH1000Flowchart_6d7d040f.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-semibold">operational flowchart</a> procedures.
            </p>
          </div>
        </div>
      </main>

      {/* How Modal */}
      <Dialog open={showHowModal} onOpenChange={setShowHowModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl display-mono text-blue-900">H500 Burn Cycle Explained</DialogTitle>
            <DialogDescription>
              Understanding the 5-stage incineration process and machine display
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Overview */}
            <div className="bg-blue-50 border-2 border-blue-300 p-4 rounded">
              <p className="text-sm font-semibold text-blue-900 mb-2">📊 The Complete Burn Cycle</p>
              <p className="text-sm text-blue-900">
                The H500 incinerator automatically goes through 5 stages. Your calculated time is split across these stages. The machine will display different status messages as it progresses through each stage.
              </p>
            </div>

            {/* Stage 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold display-mono">
                1
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Preheat (~20 minutes)</h3>
                <p className="text-slate-700 mb-2">
                  The incinerator heats up to the proper temperature before any waste is burned. During this stage, the machine's display shows: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm font-semibold">PREHEAT</span>
                </p>
                <p className="text-xs text-slate-600">
                  What's happening: Burners ignite and heat the combustion chamber to operating temperature.
                </p>
              </div>
            </div>

            {/* Stage 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold display-mono">
                2
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Evaporation (500 kg/hr)</h3>
                <p className="text-slate-700 mb-2">
                  Water and moisture in the waste evaporate. The display shows: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm font-semibold">BURNING</span>
                </p>
                <p className="text-xs text-slate-600">
                  What's happening: The waste begins to dry out as heat removes all moisture content. Time scales with waste weight (1 hr for 500 kg, 2 hrs for 1000 kg, etc.).
                </p>
              </div>
            </div>

            {/* Stage 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold display-mono">
                3
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Burning (500 kg/hr)</h3>
                <p className="text-slate-700 mb-2">
                  The main combustion phase where waste is actively burned. The display shows: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm font-semibold">BURNING</span>
                </p>
                <p className="text-xs text-slate-600">
                  What's happening: Waste is incinerated at 500 kg per hour. This is the primary burning stage.
                </p>
              </div>
            </div>

            {/* Stage 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-slate-600 text-white rounded-full flex items-center justify-center font-bold display-mono">
                4
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Ashing (500 kg/hr)</h3>
                <p className="text-slate-700 mb-2">
                  Remaining ash is processed and cooled. The display shows: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm font-semibold">BURNING</span>
                </p>
                <p className="text-xs text-slate-600">
                  What's happening: Any remaining residue is reduced to ash and prepared for removal. Time scales with waste weight (1 hr for 500 kg, 2 hrs for 1000 kg, etc.).
                </p>
              </div>
            </div>

            {/* Stage 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold display-mono">
                5
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Cool Down (Automatic)</h3>
                <p className="text-slate-700 mb-2">
                  The machine cools down automatically after burning is complete. The display shows: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-sm font-semibold">COOL DOWN</span>
                </p>
                <p className="text-xs text-slate-600">
                  What's happening: Temperature gradually decreases until the machine returns to safe operating temperature.
                </p>
              </div>
            </div>

            {/* Machine Display Status */}
            <div className="bg-green-50 border-2 border-green-300 p-4 rounded">
              <p className="text-sm font-semibold text-green-900 mb-3">📺 What You'll See on the Machine Display</p>
              <div className="space-y-2 text-sm text-green-900">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-white px-3 py-1 rounded border border-green-300 font-semibold">STANDBY</span>
                  <span>→ Machine is ready (before cycle starts)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-white px-3 py-1 rounded border border-green-300 font-semibold">PREHEAT</span>
                  <span>→ Stage 1 in progress (heating up)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-white px-3 py-1 rounded border border-green-300 font-semibold">BURNING</span>
                  <span>→ Stages 2, 3, 4 in progress (evaporation, burning, ashing)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-white px-3 py-1 rounded border border-green-300 font-semibold">COOL DOWN</span>
                  <span>→ Stage 5 in progress (cooling)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-white px-3 py-1 rounded border border-green-300 font-semibold">STANDBY</span>
                  <span>→ Cycle complete, ready for next batch</span>
                </div>
              </div>
            </div>

            {/* How to Start the Burn Cycle */}
            <div className="bg-slate-50 border-2 border-slate-300 p-4 rounded">
              <p className="text-sm font-semibold text-slate-900 mb-3">⏱️ How to Start the Burn Cycle on the Machine</p>
              <div className="space-y-3 text-sm text-slate-900">
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Step 1: Use the Calculator</p>
                  <p className="text-xs text-slate-700">Enter the waste weight in this calculator and note the <span className="font-semibold">total cycle time</span> shown in the green box (e.g., <span className="font-mono bg-white px-2 py-1 rounded border border-slate-300">"5 hr 30 min"</span> or <span className="font-mono bg-white px-2 py-1 rounded border border-slate-300">"8 hr 20 min"</span>).</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Step 2: Click "Burn Time" Button</p>
                  <p className="text-xs text-slate-700">On the H500 control panel, press the <span className="font-mono bg-white px-2 py-1 rounded border border-slate-300 font-semibold">BURN TIME</span> button to access the cycle timer input.</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Step 3: Enter the Calculated Cycle Time</p>
                  {isValidInput ? (
                    <p className="text-xs text-slate-700">Use the numeric keypad to enter: <span className="font-mono bg-white px-2 py-1 rounded border border-slate-300 font-semibold">{getInputFormat()}</span> ({formatTime(burnCycle.total)}).</p>
                  ) : (
                    <p className="text-xs text-slate-700">Enter a waste weight above to see the cycle time you need to enter on the machine.</p>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-1">Step 4: Click "Start" to Begin the Cycle</p>
                  <p className="text-xs text-slate-700">Press the <span className="font-mono bg-white px-2 py-1 rounded border border-slate-300 font-semibold">START</span> button on the H500 control panel. The machine will automatically begin the 5-stage burn cycle and count down the timer.</p>
                </div>
              </div>
            </div>

            {/* Safety Note */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <p className="text-sm text-red-900">
                <span className="font-semibold">⚠️ Safety First:</span> Always follow the official <a href="/manus-storage/kayesarabiaH1000Flowchart_6d7d040f.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline font-semibold">operational flowchart</a> and safety procedures. This calculator provides estimated times. Actual cycle duration may vary based on waste composition and machine conditions.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              onClick={() => setShowHowModal(false)}
              className="bg-blue-900 hover:bg-blue-800 text-white"
            >
              Got It!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
