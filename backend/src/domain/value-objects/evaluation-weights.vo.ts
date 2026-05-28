export class EvaluationWeights {
  public price: number;
  public leadTime: number;
  public defect: number;

  constructor(price: number, leadTime: number, defect: number) {
    this.price = price;
    this.leadTime = leadTime;
    this.defect = defect;
  }
}
