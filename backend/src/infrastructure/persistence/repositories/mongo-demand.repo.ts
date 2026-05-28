import mongoose, { PipelineStage, QueryFilter } from "mongoose";
import { AuthUser } from "../../../application/common/auth-user";
import {
  DemandListQuery,
  DemandRepository,
  DemandListResult,
} from "../../../application/repositories/demand.repo";
import { Demand } from "../../../domain/entities/demand.entity";
import { UserRole } from "../../../domain/enums/user-role.enum";
import { DemandMapper } from "../mappers/demand.mapper";
import DemandModel, { DemandDocument } from "../schemas/demand.schema";
import { DemandStatus } from "../../../domain/enums/demand-status.enum";

export class MongoDemandRepository implements DemandRepository {
  async getList(
    authUser: AuthUser,
    query: DemandListQuery,
  ): Promise<DemandListResult> {
    const page = query.page > 0 ? query.page : 1;

    const limit = query.limit > 0 ? query.limit : 10;

    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      // ================= JOIN CUSTOMER =================
      {
        $lookup: {
          from: "users",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },

      {
        $unwind: {
          path: "$customer",
          preserveNullAndEmptyArrays: true,
        },
      },

      // ================= JOIN EMPLOYEE =================
      {
        $lookup: {
          from: "users",
          localField: "assignedEmployeeId",
          foreignField: "_id",
          as: "assignedEmployee",
        },
      },

      {
        $unwind: {
          path: "$assignedEmployee",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    // ================= ROLE VISIBILITY =================

    switch (authUser.role) {
      case UserRole.CUSTOMER:
        pipeline.push({
          $match: {
            customerId: new mongoose.Types.ObjectId(authUser.id),
          },
        });
        break;

      case UserRole.EMPLOYEE:
        pipeline.push({
          $match: {
            $or: [
              {
                status: DemandStatus.SUBMITTED,
              },
              {
                assignedEmployeeId: new mongoose.Types.ObjectId(authUser.id),
              },
            ],
          },
        });
        break;

      default:
        break;
    }

    // ================= STATUS FILTER =================

    if (query.statuses && query.statuses.length > 0) {
      pipeline.push({
        $match: {
          status: {
            $in: query.statuses,
          },
        },
      });
    }

    // ================= SEARCH =================

    if (query.search) {
      const regex = {
        $regex: query.search,
        $options: "i",
      };

      const searchConditions: any[] = [
        // demand id
        {
          _id: regex,
        },
        // customer id
        {
          customerId: regex,
        },
        // customer username (name)
        {
          "customer.username": regex,
        },
        // assigned employee id
        {
          assignedEmployeeId: regex,
        },
        // product sku
        {
          "product.sku": regex,
        },
        // product name
        {
          "product.name": regex,
        },
      ];

      // employee search customer name
      if (authUser.role === UserRole.EMPLOYEE) {
        searchConditions.push({ "customer.username": regex });
      }

      // admin search employee name
      if (authUser.role === UserRole.ADMIN) {
        searchConditions.push({
          "assignedEmployee.username": regex,
        });
      }

      pipeline.push({
        $match: {
          $or: searchConditions,
        },
      });
    }

    // ================= SORT =================

    pipeline.push({
      $sort: {
        createdAt: -1,
      },
    });

    // ================= PAGINATION =================

    pipeline.push({
      $skip: skip,
    });

    pipeline.push({
      $limit: limit,
    });

    // ================= EXECUTE =================

    const [documents, totalResult] = await Promise.all([
      DemandModel.aggregate(pipeline),

      DemandModel.aggregate([
        ...pipeline.filter(
          (stage) =>
            !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage),
        ),
        {
          $count: "total",
        },
      ]),
    ]);

    const total = totalResult[0]?.total || 0;

    const items: Demand[] = documents.map((document) =>
      DemandMapper.toDomain(document),
    );

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async save(demand: Demand): Promise<Demand> {
    try {
      const data = DemandMapper.toPersistence(demand);
      let savedDemand: any;
      if (demand.id) {
        savedDemand = await DemandModel.findByIdAndUpdate(demand.id, data, {
          new: true,
        });
      } else {
        savedDemand = new DemandModel(data);
        await savedDemand.save();
      }

      return DemandMapper.toDomain(savedDemand);
    } catch (error: any) {
      throw new Error(`Failed to save demand: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Demand | null> {
    try {
      const demandDoc = await DemandModel.findById(id);

      if (!demandDoc) {
        return null;
      }

      return DemandMapper.toDomain(demandDoc);
    } catch (error: any) {
      throw new Error(`Failed to find demand by id: ${error.message}`);
    }
  }

  async findMany(params: DemandListQuery): Promise<DemandListResult> {
    try {
      const { search, statuses, page, limit } = params;
      const filter: any = {};

      if (statuses && statuses.length > 0) {
        filter.status = { $in: statuses };
      }

      if (search) {
        filter.$or = [
          { id: { $regex: search, $options: "i" } },
          { "product.sku": { $regex: search, $options: "i" } },
        ];
      }
      const skip = (page - 1) * limit;
      const [items, total] = await Promise.all([
        DemandModel.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        DemandModel.countDocuments(filter),
      ]);

      // Transform to domain entities
      const domainItems = items.map((item) => DemandMapper.toDomain(item));

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
      throw new Error(`Failed to find demands: ${error.message}`);
    }
  }
}
