import { useState } from 'react';
import Wizard from './components/Wizard';
import Results from './pages/Results';
import type { CalculationBreakdown } from './types/wizard';

function App() {
  const [calculationResult, setCalculationResult] = useState<CalculationBreakdown | null>(null);
  const [showWizard, setShowWizard] = useState(true);

  const handleCalculationComplete = (result: CalculationBreakdown) => {
    setCalculationResult(result);
    setShowWizard(false);
  };

  const handleRestart = () => {
    setCalculationResult(null);
    setShowWizard(true);
  };

  return (
    <div className="usa-prose">
      <header className="bg-primary-dark text-white padding-2">
        <div className="grid-container">
          <h1 className="margin-0">Georgia Child Support Calculator</h1>
          <p className="margin-bottom-0">Estimate child support obligations under Georgia law</p>
        </div>
      </header>

      <main className="grid-container padding-y-4">
        {showWizard ? (
          <Wizard onComplete={handleCalculationComplete} />
        ) : (
          calculationResult && <Results result={calculationResult} onRestart={handleRestart} />
        )}
      </main>

      <footer className="bg-base-lightest padding-2 margin-top-4">
        <div className="grid-container">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-8">
              <p className="margin-0">
                Based on O.C.G.A. § 19-6-15 | Georgia Child Support Commission Guidelines
              </p>
            </div>
            <div className="tablet:grid-col-4 text-right">
              <a
                href="https://csc.georgiacourts.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="usa-link"
              >
                Official Calculator
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
