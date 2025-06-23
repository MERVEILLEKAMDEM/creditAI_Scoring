'use client';

import { useState } from 'react';
import { predictCreditRisk } from '@/lib/api';
import { predictionStorage } from '@/lib/predictions';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

const industryOptions = ['Construction', 'Retail', 'Manufacturing', 'Services', 'Agriculture'];
const creditTypeOptions = ['Overdraft', 'Term Loan', 'Line of Credit', 'Credit Card'];
const hasGuaranteeOptions = ['True', 'False'];
const guaranteeTypeOptions = ['Collateral', 'Personal', 'Corporate', 'None'];
const repaymentFrequencyOptions = ['Monthly', 'Quarterly', 'Annually', 'Bi-weekly'];

export default function NewApplicationPage() {
  const [form, setForm] = useState({
    age: 30,
    income: 50000,
    loan_amount: 20000,
    interest_rate: 5.0,
    turnover: 100000,
    customer_tenure: 2,
    num_late_payments_current: 0,
    unpaid_amount: 0,
    industry_sector: industryOptions[0],
    credit_type: creditTypeOptions[0],
    has_guarantee: hasGuaranteeOptions[0],
    guarantee_type: guaranteeTypeOptions[0],
    repayment_frequency: repaymentFrequencyOptions[0],
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === 'number' ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const prediction = await predictCreditRisk(form);
      setResult(prediction);
      
      // Save the prediction to storage
      predictionStorage.savePrediction(form, prediction);
      
    } catch (err) {
      setResult({ error: 'Prediction failed' });
    }
    setLoading(false);
  };

  const chartData = [
    { name: 'Good (Will repay)', value: result ? result.probability_good * 100 : 0 },
    { name: 'Bad (Likely to default)', value: result ? result.probability_bad * 100 : 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-12">
        <h1 className="text-3xl font-bold mb-6 text-center">Submit a new credit application for AI-powered risk analysis</h1>
        <form onSubmit={handleSubmit} className="space-y-12">
          <div>
            <h2 className="text-xl font-semibold mb-6 border-b pb-3">Loan Applicant Assessment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-base font-medium mb-2">Age</label>
                <input type="number" name="age" min={18} max={100} value={form.age} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 text-lg" />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Annual Income</label>
                <input type="number" name="income" value={form.income} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 text-lg" />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Loan Amount</label>
                <input type="number" name="loan_amount" value={form.loan_amount} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 text-lg" />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Interest Rate (%)</label>
                <input type="number" name="interest_rate" min={0} max={30} step={0.01} value={form.interest_rate} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 text-lg" />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Business Turnover</label>
                <input type="number" name="turnover" value={form.turnover} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 text-lg" />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Customer Tenure (years)</label>
                <input type="number" name="customer_tenure" min={0} max={50} value={form.customer_tenure} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 text-lg" />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Number of Late Payments (current)</label>
                <input type="number" name="num_late_payments_current" min={0} value={form.num_late_payments_current} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 text-lg" />
              </div>
              <div>
                <label className="block text-base font-medium mb-2">Unpaid Amount</label>
                <input type="number" name="unpaid_amount" min={0} value={form.unpaid_amount} onChange={handleChange} required className="w-full border rounded-lg px-4 py-3 text-lg" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-base font-medium mb-2">Industry Sector</label>
              <select name="industry_sector" value={form.industry_sector} onChange={handleChange} className="w-full border rounded-lg px-4 py-3 text-lg">
                {industryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Credit Type</label>
              <select name="credit_type" value={form.credit_type} onChange={handleChange} className="w-full border rounded-lg px-4 py-3 text-lg">
                {creditTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Has Guarantee?</label>
              <select name="has_guarantee" value={form.has_guarantee} onChange={handleChange} className="w-full border rounded-lg px-4 py-3 text-lg">
                {hasGuaranteeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Guarantee Type</label>
              <select name="guarantee_type" value={form.guarantee_type} onChange={handleChange} className="w-full border rounded-lg px-4 py-3 text-lg">
                {guaranteeTypeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium mb-2">Repayment Frequency</label>
              <select name="repayment_frequency" value={form.repayment_frequency} onChange={handleChange} className="w-full border rounded-lg px-4 py-3 text-lg">
                {repaymentFrequencyOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-3 rounded-xl shadow-lg text-lg transition-all">
              {loading ? 'Predicting...' : 'Assess Credit Risk'}
            </button>
      </div>
        </form>
        {loading && <div className="text-center mt-6 text-lg">Loading...</div>}
        {result && !result.error && (
          <div className="mt-12 p-8 bg-blue-50 rounded-2xl shadow-inner">
            <h3 className="text-xl font-bold mb-4 text-center">
              Result: {result.prediction === 1 ? 'High Risk (Potential default)' : 'Low Risk (Likely to repay)'}
            </h3>
            <div className="w-full h-56 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2563eb">
                    <LabelList dataKey="value" position="right" formatter={(v: number) => `${v.toFixed(2)}%`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
      </div>
            <h4 className="font-semibold mb-3">Input Summary</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2 text-base">
              {Object.entries(form).map(([key, value]) => (
                <li key={key}><span className="font-medium capitalize">{key.replace(/_/g, ' ')}:</span> {value.toString()}</li>
              ))}
            </ul>
        </div>
        )}
        {result && result.error && (
          <div className="text-red-600 text-center mt-6 text-lg">{result.error}</div>
        )}
      </div>
    </div>
  );
}
