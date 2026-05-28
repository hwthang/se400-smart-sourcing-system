import {
  SupplierRegistrationQuery,
  SupplierRegistrationRepository,
  SupplierRegistrationSearchResult,
} from "../../../application/repositories/supplier-registration.repo";
import { SupplierRegistration } from "../../../domain/entities/supplier-registration.entity";
import { SupplierRegistrationMapper } from "../mappers/supplier-registration.mapper";
import SupplierRegistrationModel from "../schemas/supplier-registration.schema";

export class MongoSupplierRegistrationRepository implements SupplierRegistrationRepository {
  async findAllByContractId(
    contractId: string,
  ): Promise<SupplierRegistration[]> {
    const registrations = await SupplierRegistrationModel.find({ contractId });

    return registrations.map(SupplierRegistrationMapper.toDomain);
  }

  async save(
    registration: SupplierRegistration,
  ): Promise<SupplierRegistration> {
    try {
      const data = SupplierRegistrationMapper.toPersistence(registration);
      let savedRegistration: any;

      if (registration.id) {
        savedRegistration = await SupplierRegistrationModel.findByIdAndUpdate(
          registration.id,
          data,
          { new: true },
        );
      } else {
        savedRegistration = new SupplierRegistrationModel(data);
        await savedRegistration.save();
      }

      return SupplierRegistrationMapper.toDomain(savedRegistration);
    } catch (error: any) {
      throw new Error(`Failed to save supplier registration: ${error.message}`);
    }
  }

  async findById(id: string): Promise<SupplierRegistration | null> {
    try {
      const registrationDoc = await SupplierRegistrationModel.findById(id);

      if (!registrationDoc) {
        return null;
      }

      return SupplierRegistrationMapper.toDomain(registrationDoc);
    } catch (error: any) {
      throw new Error(
        `Failed to find supplier registration by id: ${error.message}`,
      );
    }
  }

  async findBySupplierIdAndContractId(
    supplierId: string,
    contractId: string,
  ): Promise<SupplierRegistration | null> {
    try {
      const registrationDoc = await SupplierRegistrationModel.findOne({
        supplierId,
        contractId,
      });

      if (!registrationDoc) {
        return null;
      }

      return SupplierRegistrationMapper.toDomain(registrationDoc);
    } catch (error: any) {
      throw new Error(
        `Failed to find supplier registration by supplier and contract: ${error.message}`,
      );
    }
  }

  async findMany(
    params: SupplierRegistrationQuery,
  ): Promise<SupplierRegistrationSearchResult> {
    try {
      const { supplierId, contractId, statuses, search, page, limit } = params;
      const filter: any = {};

      if (supplierId) {
        filter.supplierId = supplierId;
      }

      if (contractId) {
        filter.contractId = contractId;
      }

      if (statuses && statuses.length > 0) {
        filter.status = { $in: statuses };
      }

      if (search) {
        filter.$or = [
          { supplierId: { $regex: search, $options: "i" } },
          { contractId: { $regex: search, $options: "i" } },
        ];
      }

      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        SupplierRegistrationModel.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        SupplierRegistrationModel.countDocuments(filter),
      ]);

      const domainItems = items.map((item) =>
        SupplierRegistrationMapper.toDomain(item),
      );
      const totalPages = Math.ceil(total / limit);

      return {
        items: domainItems,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error: any) {
      throw new Error(
        `Failed to find supplier registrations: ${error.message}`,
      );
    }
  }
}
