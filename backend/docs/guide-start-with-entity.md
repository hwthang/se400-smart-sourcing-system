### 🧩 1. Core Source: Domain Entity

src/domain/entities/demand.entity.ts

```ts id="demand_entity_sample"
import { DemandStatus } from "../enums/demand-status.enum";
import { Product } from "../value-objects/product.vo";

export interface DemandData {
  id?: string;
  customerId: string;
  assignedEmployeeId: string;
  product: Product;
  requestedQuantity: number;
  requestedDeliveryDate: Date;
  status: DemandStatus;
  rejectReason: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateDemandProps {
  customerId: string;
  product: Product;
  requestedQuantity: number;
  requestedDeliveryDate: Date;
}

export interface UpdateDemandProps {
  product?: Product;
  requestedQuantity?: number;
  requestedDeliveryDate?: Date;
}

export class Demand {
  // 1. STRICT ENCAPSULATION (Private & Underscored)
  private _id?: string;
  private _customerId: string;
  private _assignedEmployeeId: string;
  private _product: Product;
  private _requestedQuantity: number;
  private _requestedDeliveryDate: Date;
  private _status: DemandStatus;
  private _rejectReason: string;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  // Constructor used for re-hydration via Mapper
  public constructor(data: DemandData) {
    this._id = data.id;
    this._customerId = data.customerId;
    this._assignedEmployeeId = data.assignedEmployeeId;
    this._product = data.product;
    this._requestedQuantity = data.requestedQuantity;
    this._requestedDeliveryDate = data.requestedDeliveryDate;
    this._status = data.status;
    this._rejectReason = data.rejectReason;
    this._createdAt = data.createdAt;
    this._updatedAt = data.updatedAt;
  }

  // 2. DUAL-GATE INITIALIZATION (Static create for new entities)
  public static create(props: CreateDemandProps): Demand {
    if (props.requestedQuantity <= 0) {
      throw new Error("Requested quantity must be greater than zero");
    }

    return new Demand({
      customerId: props.customerId,
      assignedEmployeeId: "", // Default lifecycle state
      product: props.product,
      requestedQuantity: props.requestedQuantity,
      requestedDeliveryDate: props.requestedDeliveryDate,
      status: DemandStatus.CREATED, // Default lifecycle state
      rejectReason: "",
    });
  }

  // 3. METHOD-BASED GETTERS
  get id(): string | undefined { return this._id; }
  get customerId(): string { return this._customerId; }
  get assignedEmployeeId(): string { return this._assignedEmployeeId; }
  get product(): Product { return this._product; }
  get requestedQuantity(): number { return this._requestedQuantity; }
  get requestedDeliveryDate(): Date { return this._requestedDeliveryDate; }
  get status(): DemandStatus { return this._status; }
  get rejectReason(): string { return this._rejectReason; }
  get createdAt(): Date | undefined { return this._createdAt; }
  get updatedAt(): Date | undefined { return this._updatedAt; }

  // 4. BEHAVIORAL MUTATORS WITH INVARIANT VALIDATION
  public update(props: UpdateDemandProps): void {
    this.validateStatus([DemandStatus.CREATED, DemandStatus.REJECTED]);

    if (props.product !== undefined) this._product = props.product;
    if (props.requestedQuantity !== undefined) {
      if (props.requestedQuantity <= 0) throw new Error("Invalid quantity");
      this._requestedQuantity = props.requestedQuantity;
    }
    if (props.requestedDeliveryDate !== undefined) this._requestedDeliveryDate = props.requestedDeliveryDate;
  }

  private validateStatus(allowedStatuses: DemandStatus[]): void {
    if (!allowedStatuses.includes(this._status)) {
      throw new Error(`Action not allowed in current status: ${this._status}`);
    }
  }
}

```

---

### 💾 2. Persistence Layout: Database Schema

src/infrastructure/schemas/demand.schema.ts

```ts id="demand_schema_sample"
import mongoose, { Schema, Document } from "mongoose";
import { DemandStatus } from "../../domain/enums/demand-status.enum";

export interface DemandDocument extends Document {
  customerId: string;
  assignedEmployeeId: string;
  product: {
    sku: string;
    specifications: Record<string, any>;
  };
  requestedQuantity: number;
  requestedDeliveryDate: Date;
  status: DemandStatus;
  rejectReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const DemandSchema = new Schema<DemandDocument>(
  {
    customerId: { type: String, required: true },
    assignedEmployeeId: { type: String, default: "" },
    // FLATTENING COMPLEX TYPES: Flat representation of Product Value Object
    product: {
      sku: { type: String, required: true },
      specifications: { type: Map, of: Schema.Types.Mixed, default: {} },
    },
    // DATABASE CONSTRAINTS
    requestedQuantity: { type: Number, required: true, min: 1 },
    requestedDeliveryDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: Object.values(DemandStatus), 
      default: DemandStatus.CREATED, 
      required: true 
    },
    rejectReason: { type: String, default: "" }
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt
    versionKey: false,
  }
);

export const DemandModel = mongoose.model<DemandDocument>("Demand", DemandSchema);

```

---

### 📦 3. Client Contract: Data Transfer Object

src/application/dtos/demand.dto.ts

```ts id="demand_dto_sample"
import { DemandStatus } from "../../domain/enums/demand-status.enum";

export interface DemandDto {
  id: string; // Guaranteed non-optional for the client
  customerId: string;
  assignedEmployeeId: string;
  // PRIMITIVE TYPES ONLY: No complex domain Value Objects leaking here
  product: {
    sku: string;
    specifications: Record<string, any>;
  };
  requestedQuantity: number;
  requestedDeliveryDate: string; // ISO String format preferred for APIs
  status: DemandStatus;
  rejectReason: string;
  createdAt: string;
  updatedAt: string;
}

```

---

### 🔄 4. Bridge: Data Mapper

src/infrastructure/mappers/demand.mapper.ts

```ts id="demand_mapper_sample"
import { Demand } from "../../domain/entities/demand.entity";
import { Product } from "../../domain/value-objects/product.vo";
import { DemandDocument } from "../schemas/demand.schema";
import { DemandDto } from "../../application/dtos/demand.dto";

export class DemandMapper {
  // A. DOMAIN ENTITY ➡️ DATABASE DOCUMENT
  // Rule: Invokes the Entity's method-based getters
  public static toPersistence(entity: Demand): Partial<DemandDocument> {
    return {
      customerId: entity.customerId(),
      assignedEmployeeId: entity.assignedEmployeeId(),
      product: {
        sku: entity.product().sku,
        specifications: entity.product().specifications,
      },
      requestedQuantity: entity.requestedQuantity(),
      requestedDeliveryDate: entity.requestedDeliveryDate(),
      status: entity.status(),
      rejectReason: entity.rejectReason(),
    };
  }

  // B. DATABASE DOCUMENT ➡️ DOMAIN ENTITY
  // Rule: Re-instantiates internal complex structures (Value Objects)
  public static toDomain(doc: DemandDocument): Demand {
    const productValueObject = new Product(
      doc.product.sku,
      doc.product.specifications
    );

    return new Demand({
      id: doc._id.toString(),
      customerId: doc.customerId,
      assignedEmployeeId: doc.assignedEmployeeId,
      product: productValueObject,
      requestedQuantity: doc.requestedQuantity,
      requestedDeliveryDate: doc.requestedDeliveryDate,
      status: doc.status,
      rejectReason: doc.rejectReason,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  // C. DOMAIN ENTITY ➡️ CLEAN DTO
  // Rule: Applies fallback values to satisfy strict API contract types
  public static toDto(entity: Demand): DemandDto {
    return {
      id: entity.id() ?? "", // Fallback applied safely
      customerId: entity.customerId(),
      assignedEmployeeId: entity.assignedEmployeeId(),
      product: {
        sku: entity.product().sku,
        specifications: entity.product().specifications,
      },
      requestedQuantity: entity.requestedQuantity(),
      requestedDeliveryDate: entity.requestedDeliveryDate().toISOString(),
      status: entity.status(),
      rejectReason: entity.rejectReason(),
      createdAt: (entity.createdAt() ?? new Date()).toISOString(),
      updatedAt: (entity.updatedAt() ?? new Date()).toISOString(),
    };
  }
}

```