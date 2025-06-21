export interface Prediction {
  id: string;
  timestamp: string;
  input: {
    age: number;
    income: number;
    loan_amount: number;
    interest_rate: number;
    turnover: number;
    customer_tenure: number;
    num_late_payments_current: number;
    unpaid_amount: number;
    industry_sector: string;
    credit_type: string;
    has_guarantee: string;
    guarantee_type: string;
    repayment_frequency: string;
  };
  result: {
    prediction: number;
    probability_good: number;
    probability_bad: number;
    risk_level: string;
  };
}

class PredictionStorage {
  private storageKey = 'credit_predictions';

  // Save a new prediction
  savePrediction(input: any, result: any): Prediction {
    const prediction: Prediction = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      input,
      result
    };

    const predictions = this.getAllPredictions();
    predictions.push(prediction);
    localStorage.setItem(this.storageKey, JSON.stringify(predictions));

    return prediction;
  }

  // Get all predictions
  getAllPredictions(): Prediction[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  // Get predictions by date range
  getPredictionsByDateRange(startDate: Date, endDate: Date): Prediction[] {
    const predictions = this.getAllPredictions();
    return predictions.filter(prediction => {
      const predDate = new Date(prediction.timestamp);
      return predDate >= startDate && predDate <= endDate;
    });
  }

  // Get prediction statistics
  getPredictionStats() {
    const predictions = this.getAllPredictions();
    
    if (predictions.length === 0) {
      return {
        total: 0,
        highRisk: 0,
        lowRisk: 0,
        highRiskPercentage: 0,
        lowRiskPercentage: 0,
        averageProbabilityGood: 0,
        averageProbabilityBad: 0
      };
    }

    const highRisk = predictions.filter(p => p.result.prediction === 1).length;
    const lowRisk = predictions.filter(p => p.result.prediction === 0).length;
    const avgProbGood = predictions.reduce((sum, p) => sum + p.result.probability_good, 0) / predictions.length;
    const avgProbBad = predictions.reduce((sum, p) => sum + p.result.probability_bad, 0) / predictions.length;

    return {
      total: predictions.length,
      highRisk,
      lowRisk,
      highRiskPercentage: (highRisk / predictions.length) * 100,
      lowRiskPercentage: (lowRisk / predictions.length) * 100,
      averageProbabilityGood: avgProbGood,
      averageProbabilityBad: avgProbBad
    };
  }

  // Get recent predictions
  getRecentPredictions(limit: number = 10): Prediction[] {
    const predictions = this.getAllPredictions();
    return predictions.slice(-limit).reverse();
  }

  // Delete a prediction
  deletePrediction(id: string): boolean {
    const predictions = this.getAllPredictions();
    const filtered = predictions.filter(p => p.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    return filtered.length !== predictions.length;
  }

  // Clear all predictions
  clearAllPredictions(): void {
    localStorage.removeItem(this.storageKey);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export const predictionStorage = new PredictionStorage(); 