import { spawn } from 'child_process';
import path from 'path';

export interface ModelInput {
  employment_status: string;
  annual_income: number;
  loan_amount: number;
  loan_purpose: string;
  credit_history: string;
}

export interface ModelOutput {
  credit_score: number;
  risk_level: 'Low' | 'Medium' | 'High';
  probability: number;
  recommendations: string[];
}

export async function analyzeCreditRisk(input: ModelInput): Promise<ModelOutput> {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn('python', [
      path.join(process.cwd(), 'scripts', 'predict.py'),
      JSON.stringify(input)
    ]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process failed: ${error}`));
        return;
      }

      try {
        const output = JSON.parse(result);
        resolve(output);
      } catch (e) {
        reject(new Error('Failed to parse model output'));
      }
    });
  });
} 