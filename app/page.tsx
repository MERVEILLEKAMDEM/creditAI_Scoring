import Image from "next/image";
import Link from "next/link";

const currentYear = new Date().getFullYear();

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="w-full border-b bg-white/80 backdrop-blur sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-2">
            <Image src="/th.jpg" alt="Logo" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold text-primary">AI Credit Risk</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-base font-medium text-gray-700 hover:text-primary">Home</Link>
            <Link href="/about" className="text-base font-medium text-gray-700 hover:text-primary">About</Link>
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition">Get Started</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section with CSS background-image fallback */}
      <section
        className="relative flex flex-col items-center justify-center text-center min-h-[60vh] py-20"
        style={{
          backgroundImage: "url('/coins-jar.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 -z-10 bg-black/60" />
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">
          Artificial Intelligence in the <span className="text-blue-400">Analysis of Credit Risk</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-200 mb-8">
          Revolutionizing credit scoring through AI-powered analysis, promoting financial inclusion and reducing bias in lending decisions for underserved populations.
        </p>
        <Link href="/login" className="px-8 py-3 bg-blue-600 text-white rounded-md font-semibold text-lg hover:bg-blue-700 transition">Get Started</Link>
      </section>

      {/* Features Section with background image */}
      <section className="relative py-16">
        <div className="absolute inset-0 -z-10">
          <Image src="/2676163.jpg" alt="Background" fill className="object-cover w-full h-full opacity-60" />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/90 rounded-lg shadow-lg p-6 flex flex-col items-center">
              <span className="text-3xl mb-2">🤖</span>
              <h3 className="font-bold text-lg mb-2">AI-Powered Scoring</h3>
              <p className="text-gray-700 text-center mb-2">Advanced machine learning algorithms for accurate credit risk assessment</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>XGBoost & Random Forest models</li>
                <li>Streamlined application process</li>
              </ul>
            </div>
            <div className="bg-white/90 rounded-lg shadow-lg p-6 flex flex-col items-center">
              <span className="text-3xl mb-2">👥</span>
              <h3 className="font-bold text-lg mb-2">Financial Inclusion</h3>
              <p className="text-gray-700 text-center mb-2">Expanding credit access for underserved populations</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Thin-file borrowers</li>
                <li>Emerging economies focus</li>
              </ul>
            </div>
            <div className="bg-white/90 rounded-lg shadow-lg p-6 flex flex-col items-center">
              <span className="text-3xl mb-2">⏱️</span>
              <h3 className="font-bold text-lg mb-2">Real-Time Processing</h3>
              <p className="text-gray-700 text-center mb-2">Instant credit decisions with sub-5 second response times</p>
              <ul className="text-sm text-gray-600 list-disc list-inside">
                <li>Cloud-based architecture</li>
                <li>Scalable & Fast</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* For Financial Institutions / For the Population */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-purple-500 text-white flex items-center justify-center">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-16 text-center">
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 justify-center"> <span>↗️</span> For Financial Institutions</h3>
            <ul className="list-disc list-inside space-y-2 text-base mx-auto inline-block text-left">
              <li>Enhanced risk management capabilities</li>
              <li>Improved lending decision accuracy</li>
              <li>Reduced default rates and bad debt</li>
              <li>Automated compliance monitoring</li>
            </ul>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 justify-center"> <span>👥</span> For the Population</h3>
            <ul className="list-disc list-inside space-y-2 text-base mx-auto inline-block text-left">
              <li>Increased access to credit</li>
              <li>Economic empowerment opportunities</li>
              <li>Protection against over-indebtedness</li>
              <li>Fair and unbiased lending practices</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-200 py-10 mt-auto">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact */}
          <div>
            <h4 className="font-bold mb-2">CONTACT</h4>
            <div className="flex items-center gap-2 mb-1">
              <span>📍</span> <span>Douala, Cameroon</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span>📞</span> <span>+237691046263</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span>✉️</span> <span>merveillekamdem019@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span>👤</span> <span>MERVEILLE KAMDEM</span>
            </div>
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-2">QUICK LINKS</h4>
            <ul className="space-y-1">
              <li><Link href="/" className="hover:underline">Home</Link></li>
              <li><Link href="/about" className="hover:underline">About</Link></li>
              <li><Link href="/dashboard" className="hover:underline">Dashboard</Link></li>
            </ul>
          </div>
          {/* Legal */}
          <div>
            <h4 className="font-bold mb-2">LEGAL</h4>
            <ul className="space-y-1">
              <li><Link href="#" className="hover:underline">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:underline">Terms of Service</Link></li>
              <li><Link href="#" className="hover:underline">Support</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center mt-8 text-xs text-gray-400">
          <div className="mb-1">AI Credit Risk Analysis evaluates a borrower's likelihood of defaulting on a loan, helping lenders make informed financial decisions.</div>
          <div className="mb-1 font-semibold">DEVELOPED by MERVEILLE KAMDEM | Cloud Computing / B.TECH 3 CSE</div>
          <div>© {currentYear} Merveille Kamdem Meguia / Credit Risk Analysis. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
