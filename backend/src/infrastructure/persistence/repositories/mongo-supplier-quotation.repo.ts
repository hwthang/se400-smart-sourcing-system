// =========================================================
// INFRASTRUCTURE LAYER: MONGO SUPPLIER QUOTATION REPOSITORY
// =========================================================

import {
  SupplierQuotationRepository,
  SupplierQuotationQuery,
  SupplierQuotationSearchResult,
} from "../../../application/repositories/supplier-quotation.repo";
import { SupplierQuotation } from "../../../domain/entities/supplier-quotation.entity";
import { SupplierQuotationMapper } from "../mappers/supplier-quotation.mapper";
import { SupplierQuotationModel } from "../schemas/supplier-quotation.schema";
import SupplierRegistrationModel from "../schemas/supplier-registration.schema";

export class MongoSupplierQuotationRepository implements SupplierQuotationRepository {
  async save(quotation: SupplierQuotation): Promise<SupplierQuotation> {
    try {
      const data = SupplierQuotationMapper.toPersistence(quotation);
      let savedQuotation: any;

      if (quotation.id) {
        // Update existing quotation
        savedQuotation = await SupplierQuotationModel.findByIdAndUpdate(
          quotation.id,
          data,
          { new: true },
        );
      } else {
        // Create new quotation
        savedQuotation = new SupplierQuotationModel(data);
        await savedQuotation.save();
      }

      return SupplierQuotationMapper.toDomain(savedQuotation);
    } catch (error: any) {
      throw new Error(`Failed to save supplier quotation: ${error.message}`);
    }
  }

  async findById(id: string): Promise<SupplierQuotation | null> {
    try {
      const quotationDoc = await SupplierQuotationModel.findById(id);

      if (!quotationDoc) {
        return null;
      }

      return SupplierQuotationMapper.toDomain(quotationDoc);
    } catch (error: any) {
      throw new Error(
        `Failed to find supplier quotation by id: ${error.message}`,
      );
    }
  }

  async findByRegistrationId(
    registrationId: string,
  ): Promise<SupplierQuotation | null> {
    try {
      const quotationDoc = await SupplierQuotationModel.findOne({
        registrationId,
      });

      if (!quotationDoc) {
        return null;
      }

      return SupplierQuotationMapper.toDomain(quotationDoc);
    } catch (error: any) {
      throw new Error(
        `Failed to find supplier quotation by registration id: ${error.message}`,
      );
    }
  }

  async findAllQuotationsOfContract(
    contractId: string,
  ): Promise<SupplierQuotation[]> {
    try {
      const registrations = await SupplierRegistrationModel.find({
        contractId,
      }).select("_id");

      const registrationIds = registrations.map((registration) =>
        registration._id.toString(),
      );

      const quotationDocs = await SupplierQuotationModel.find({
        registrationId: {
          $in: registrationIds,
        },
      }).sort({
        createdAt: -1,
      });

      return quotationDocs.map((doc) => SupplierQuotationMapper.toDomain(doc));
    } catch (error: any) {
      throw new Error(
        `Failed to find quotations for contract: ${error.message}`,
      );
    }
  }

  async findMany(
    params: SupplierQuotationQuery,
  ): Promise<SupplierQuotationSearchResult> {
    try {
      const {
        registrationId,
        statuses,
        minUnitPrice,
        maxUnitPrice,
        minLeadTimeDays,
        maxLeadTimeDays,
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

      if (minUnitPrice !== undefined || maxUnitPrice !== undefined) {
        filter.unitPrice = {};
        if (minUnitPrice !== undefined) {
          filter.unitPrice.$gte = minUnitPrice;
        }
        if (maxUnitPrice !== undefined) {
          filter.unitPrice.$lte = maxUnitPrice;
        }
      }

      if (minLeadTimeDays !== undefined || maxLeadTimeDays !== undefined) {
        filter.maxLeadTimeDays = {};
        if (minLeadTimeDays !== undefined) {
          filter.maxLeadTimeDays.$gte = minLeadTimeDays;
        }
        if (maxLeadTimeDays !== undefined) {
          filter.maxLeadTimeDays.$lte = maxLeadTimeDays;
        }
      }

      const skip = (page - 1) * limit;

      const [items, total] = await Promise.all([
        SupplierQuotationModel.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        SupplierQuotationModel.countDocuments(filter),
      ]);

      // Transform to domain entities
      const domainItems = items.map((item) =>
        SupplierQuotationMapper.toDomain(item),
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
      throw new Error(`Failed to find supplier quotations: ${error.message}`);
    }
  }
}
