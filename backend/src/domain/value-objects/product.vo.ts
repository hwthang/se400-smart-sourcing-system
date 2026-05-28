type ProductData = {
  sku: string;
  name: string;
  description: string;
  specifications: Record<string, string>;
};

export class Product {
  public sku: string;
  public name: string;
  public description: string;
  public specifications: Record<string, string>;

  constructor(data: ProductData) {
    this.sku = data.sku;
    this.specifications = data.specifications;
    this.name = data.name;
    this.description = data.description;
  }
}
