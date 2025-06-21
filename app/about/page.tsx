import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Image src="/th.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold text-primary">AI Credit Risk</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-base font-medium text-gray-700 hover:text-primary">Home</Link>
            <Link href="/about" className="text-base font-medium text-primary hover:text-primary">About</Link>
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">About AI in Credit Risk Analysis</h1>
          
          <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
            The convergence of Artificial Intelligence and credit risk assessment marks a pivotal transformation in the financial industry. This technology is not just an incremental improvement but a paradigm shift, enabling more accurate, efficient, and equitable lending decisions that fuel economic growth.
          </p>

          {/* Section 1: The Evolution of Credit Risk */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-blue-500 pb-2">The Evolution of Credit Risk</h2>
            <p className="text-gray-700 leading-relaxed">
              For decades, credit risk assessment was a largely manual process, relying on limited financial records and the subjective judgment of loan officers. The introduction of traditional credit scoring models, like FICO, was a major step forward, but these systems were often rigid and slow, relying on a narrow set of historical data. This approach frequently excluded individuals with limited credit histories ("thin-file" borrowers) and was susceptible to inherent human biases, creating barriers to financial inclusion.
            </p>
          </div>

          {/* Section 2: The AI Revolution */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-blue-500 pb-2">The AI Revolution in Lending</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Artificial Intelligence and Machine Learning have shattered these old limitations. Modern AI models can analyze vast and diverse datasets in real-time, going far beyond traditional credit reports. By leveraging advanced algorithms like Gradient Boosting, Random Forests, and Neural Networks, our system can identify complex patterns and correlations that are invisible to the human eye.
            </p>
            <p className="text-gray-700 leading-relaxed">
              This allows for the use of alternative data sources—such as payment history for utilities, rent, or even business turnover data—to build a more holistic and accurate picture of an applicant's creditworthiness. The result is a more dynamic, predictive, and nuanced assessment of risk.
            </p>
          </div>

          {/* Section 3: Economic Benefits */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b-2 border-blue-500 pb-2">Economic Benefits and Impact</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">For Financial Institutions</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Reduced Defaults:</strong> More accurate predictions lead to lower default rates and reduced financial losses.</li>
                  <li><strong>Increased Efficiency:</strong> Automated decision-making processes dramatically reduce the time and cost associated with loan approvals.</li>
                  <li><strong>Enhanced Competitiveness:</strong> Institutions can offer better rates and reach new market segments securely.</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-600 mb-2">For the Economy & Population</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  <li><strong>Greater Financial Inclusion:</strong> Individuals and small businesses previously excluded from the credit system can now gain access to capital.</li>
                  <li><strong>Economic Empowerment:</strong> Access to fair credit fuels entrepreneurship, education, and personal growth, driving overall economic prosperity.</li>
                  <li><strong>Fair and Unbiased Decisions:</strong> AI models can be trained to reduce or eliminate the biases that have historically plagued lending, promoting equity.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

       {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-6 mt-auto">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Merveille Kamdem Meguia / Credit Risk Analysis. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 