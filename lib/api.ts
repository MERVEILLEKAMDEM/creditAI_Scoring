// lib/api.ts
export async function predictCreditRisk(data: any) {
    const response = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Prediction failed');
    return response.json();
  }