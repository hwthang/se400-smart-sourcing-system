// =========================================================
// INFRASTRUCTURE LAYER: MONGO BUYER CRITERIA REPOSITORY
// =========================================================

import {
  BuyerCriteriaRepository,
  BuyerCriteriaQuery,
  BuyerCriteriaSearchResult,
} from "../../../application/repositories/buyer-criteria.repo";
import { BuyerCriteria } from "../../../domain/entities/buyer-criteria.entity";
import { BuyerCriteriaMapper } from "../mappers/buyer-criteria.mapper";
import { BuyerCriteriaModel } from "../schemas/buyer-criteria.schema";
import SupplierRegistrationModel from "../schemas/supplier-registration.schema";

export class MongoBuyerCriteriaRepository implements BuyerCriteriaRepository {
  async findAllCriteriaOfContract(
    contractId: string,
  ): Promise<BuyerCriteria[]> {
    try {
      const registrations = await SupplierRegistrationModel.find({
        contractId,
      }).select("_id");

      const registrationIds = registrations.map(
        (r: { _id: { toString: () => any } }) => r._id.toString(),
      );

      const criteriaDocs = await BuyerCriteriaModel.find({
        registrationId: {
          $in: registrationIds,
        },
      }).sort({
        createdAt: -1,
      });

      return criteriaDocs.map(BuyerCriteriaMapper.toDomain);
    } catch (error: any) {
      throw new Error(`Failed to find criteria for contract: ${error.message}`);
    }
  }

  async save(criteria: BuyerCriteria): Promise<BuyerCriteria> {
    try {
      const data = BuyerCriteriaMapper.toPersistence(criteria);
      let savedCriteria: any;

      if (criteria.id) {
        // Update existing criteria
        savedCriteria = await BuyerCriteriaModel.findByIdAndUpdate(
          criteria.id,
          data,
          { new: true },
        );
      } else {
        // Create new criteria
        savedCriteria = new BuyerCriteriaModel(data);
        await savedCriteria.save();
      }

      return BuyerCriteriaMapper.toDomain(savedCriteria);
    } catch (error: any) {
      throw new Error(`Failed to save buyer criteria: ${error.message}`);
    }
  }

  async findById(id: string): Promise<BuyerCriteria | null> {
    try {
      const criteriaDoc = await BuyerCriteriaModel.findById(id);

      if (!criteriaDoc) {
        return null;
      }

      return BuyerCriteriaMapper.toDomain(criteriaDoc);
    } catch (error: any) {
      throw new Error(`Failed to find buyer criteria by id: ${error.message}`);
    }
  }

  async findByRegistrationId(
    registrationId: string,
  ): Promise<BuyerCriteria | null> {
    try {
      const criteriaDoc = await BuyerCriteriaModel.findOne({ registrationId });

      if (!criteriaDoc) {
        return null;
      }

      return BuyerCriteriaMapper.toDomain(criteriaDoc);
    } catch (error: any) {
      throw new Error(
        `Failed to find buyer criteria by registration id: ${error.message}`,
      );
    }
  }

  async findMany(
    params: BuyerCriteriaQuery,
  ): Promise<BuyerCriteriaSearchResult> {
    try {
      const {
        registrationId,
        statuses,
        minPurchaseQuantity,
        maxPurchaseQuantity,
        minAllocationPercent,
        maxAllocationPercent,
        page,
        limit,
      } = params;

      const filter: any = {};

      if (registrationId) {
        filter.registrationId = registrationId;
      }

      if (statuses && statuses.length > 0) {
        filter.status = { $in: statuses };
      }

      // Filter by purchase quantity range
      if (
        minPurchaseQuantity !== undefined ||
        maxPurchaseQuantity !== undefined
      ) {
        filter.minPurchaseQuantity = {};
        if (minPurchaseQuantity !== undefined) {
          filter.minPurchaseQuantity.$gte = minPurchaseQuantity;
        }
        if (maxPurchaseQuantity !== undefined) {
          filter.minPurchaseQuantity.$lte = maxPurchaseQuantity;
        }
      }

      // Filter by allocation percent range
      if (
        minAllocationPercent !== undefined ||
        maxAllocationPercent !== undefined
      ) {
        filter.maxAllocationPercent = {};
        if (minAllocationPercent !== undefined) {
          filter.maxAllocationPercent.$gte = minAllocationPercent;
        }
        if (maxAllocationPercent !== undefined) {
          filter.maxAllocationPercent.$lte = maxAllocationPercent;
        }
      }

      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        BuyerCriteriaModel.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        BuyerCriteriaModel.countDocuments(filter),
      ]);

      // Transform to domain entities
      const domainItems = items.map((item) =>
        BuyerCriteriaMapper.toDomain(item),
      );

      // Calculate total pages
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
      throw new Error(`Failed to find buyer criteria: ${error.message}`);
    }
  }
}
