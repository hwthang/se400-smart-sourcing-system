import {
  ContractListQuery,
  ContractRepository,
  ContractListResult,
} from "../../../application/repositories/contract.repo";
import { Contract } from "../../../domain/entities/contract.entity";
import ContractModel from "../schemas/contract.schema";
import { ContractMapper } from "../mappers/contract.mapper";
import { ContractStatus } from "../../../domain/enums/contract-status.enum";
import { AuthUser } from "../../../application/common/auth-user";
import { UserRole } from "../../../domain/enums/user-role.enum";
import mongoose, { PipelineStage } from "mongoose";

export class MongoContractRepository implements ContractRepository {
  // async getList(
  //   authUser: AuthUser,
  //   query: ContractListQuery,
  // ): Promise<ContractListResult> {
  //   const page = Math.max(1, query.page);
  //   const limit = Math.max(1, query.limit);
  //   const skip = (page - 1) * limit;

  //   const pipeline: PipelineStage[] = [
  //     // ================= JOIN DEMAND =================
  //     {
  //       $lookup: {
  //         from: "demands",
  //         localField: "demandId",
  //         foreignField: "_id",
  //         as: "demand",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$demand",
  //         preserveNullAndEmptyArrays: false,
  //       },
  //     },

  //     // ================= JOIN CUSTOMER =================
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "demand.customerId",
  //         foreignField: "_id",
  //         as: "customer",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$customer",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },

  //     // ================= JOIN EMPLOYEE =================
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "demand.assignedEmployeeId",
  //         foreignField: "_id",
  //         as: "assignedEmployee",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$assignedEmployee",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //   ];

  //   // ================= ROLE VISIBILITY =================
  //   switch (authUser.role) {
  //     case UserRole.CUSTOMER:
  //       pipeline.push({
  //         $match: {
  //           "demand.customerId": new mongoose.Types.ObjectId(authUser.id),
  //         },
  //       });
  //       break;

  //     case UserRole.EMPLOYEE:
  //       pipeline.push({
  //         $match: {
  //           $or: [
  //             {
  //               "demand.assignedEmployeeId": new mongoose.Types.ObjectId(
  //                 authUser.id,
  //               ),
  //             },
  //             { "demand.status": "SUBMITTED" },
  //           ],
  //         },
  //       });
  //       break;

  //     case UserRole.SUPPLIER:
  //       pipeline.push({
  //         $match: {
  //           status: ContractStatus.SUPPLIER_REGISTRATION_OPENED,
  //         },
  //       });
  //       break;

  //     default:
  //       break;
  //   }

  //   // ================= STATUS FILTER =================
  //   if (query.statuses && query.statuses.length > 0) {
  //     pipeline.push({
  //       $match: {
  //         status: { $in: query.statuses },
  //       },
  //     });
  //   }

  //   // ================= SEARCH BY CONTRACT NUMBER ONLY =================
  //   if (query.search && query.search.trim()) {
  //     pipeline.push({
  //       $match: {
  //         externalId: {
  //           $regex: query.search,
  //           $options: "i", // case-insensitive
  //         },
  //       },
  //     });
  //   }

  //   // ================= SORT =================
  //   pipeline.push({
  //     $sort: { createdAt: -1 },
  //   });

  //   // ================= COUNT TOTAL =================
  //   const countPipeline = [...pipeline];
  //   countPipeline.push({ $count: "total" });

  //   // ================= PAGINATION =================
  //   pipeline.push({ $skip: skip });
  //   pipeline.push({ $limit: limit });

  //   // ================= EXECUTE =================
  //   const [items, totalResult] = await Promise.all([
  //     ContractModel.aggregate(pipeline),
  //     ContractModel.aggregate(countPipeline),
  //   ]);

  //   const total = totalResult[0]?.total || 0;

  //   return {
  //     items: items.map((item) => ContractMapper.toDomain(item)),
  //     pagination: {
  //       page,
  //       limit,
  //       total,
  //       totalPages: Math.ceil(total / limit),
  //     },
  //   };
  // }

  async getList(
    authUser: AuthUser,
    query: ContractListQuery,
  ): Promise<ContractListResult> {
    const page = Math.max(1, query.page);
    const limit = Math.max(1, query.limit);
    const skip = (page - 1) * limit;

    const pipeline: PipelineStage[] = [
      // ================= JOIN DEMAND =================
      {
        $lookup: {
          from: "demands",
          localField: "demandId",
          foreignField: "_id",
          as: "demand",
        },
      },
      {
        $unwind: {
          path: "$demand",
          preserveNullAndEmptyArrays: false,
        },
      },

      // ================= JOIN CUSTOMER =================
      {
        $lookup: {
          from: "users",
          localField: "demand.customerId",
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
          localField: "demand.assignedEmployeeId",
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
            "demand.customerId": new mongoose.Types.ObjectId(authUser.id),
          },
        });
        break;

      case UserRole.EMPLOYEE:
        pipeline.push({
          $match: {
            $or: [
              {
                "demand.assignedEmployeeId": new mongoose.Types.ObjectId(
                  authUser.id,
                ),
              },
              { "demand.status": "SUBMITTED" },
            ],
          },
        });
        break;

case UserRole.SUPPLIER:
  // ================= JOIN SUPPLIER REGISTRATIONS =================
  pipeline.push({
    $lookup: {
      from: "supplierregistrations",
      let: { contractId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$contractId", "$$contractId"] },
                { $eq: ["$supplierId", new mongoose.Types.ObjectId(authUser.id)] },
              ],
            },
          },
        },
      ],
      as: "registrations",
    },
  });
  
  // Chỉ lấy contracts mà supplier đã có registration HOặc contract đang mở đăng ký
  pipeline.push({
    $match: {
      $or: [
        { "registrations.0": { $exists: true } },  // Đã đăng ký
        { status: ContractStatus.SUPPLIER_REGISTRATION_OPENED },  // Hoặc đang mở đăng ký
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
          status: { $in: query.statuses },
        },
      });
    }

    // ================= SEARCH BY CONTRACT NUMBER ONLY =================
    if (query.search && query.search.trim()) {
      pipeline.push({
        $match: {
          externalId: {
            $regex: query.search,
            $options: "i", // case-insensitive
          },
        },
      });
    }

    // ================= SORT =================
    pipeline.push({
      $sort: { createdAt: -1 },
    });

    // ================= COUNT TOTAL =================
    const countPipeline = [...pipeline];
    countPipeline.push({ $count: "total" });

    // ================= PAGINATION =================
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    // ================= EXECUTE =================
    const [items, totalResult] = await Promise.all([
      ContractModel.aggregate(pipeline),
      ContractModel.aggregate(countPipeline),
    ]);

    const total = totalResult[0]?.total || 0;

    return {
      items: items.map((item) => ContractMapper.toDomain(item)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async findByAddress(address: string): Promise<Contract | null> {
    try {
      const demandDoc = await ContractModel.findOne({ address });

      if (!demandDoc) {
        return null;
      }

      return ContractMapper.toDomain(demandDoc);
    } catch (error: any) {
      throw new Error(`Failed to find demand by address: ${error.message}`);
    }
  }
  async save(contract: Contract): Promise<Contract> {
    try {
      const persistenceData = ContractMapper.toPersistence(contract);
      let savedContract: any;
      if (contract.id) {
        // Update existing contract
        savedContract = await ContractModel.findByIdAndUpdate(
          contract.id,
          persistenceData,
          {
            new: true,
            runValidators: true,
          },
        );
      } else {
        // Create new contract
        const newContract = new ContractModel(persistenceData);
        savedContract = await newContract.save();
      }

      return ContractMapper.toDomain(savedContract);
    } catch (error) {
      console.error("Error saving contract:", error);
      throw new Error("Failed to save contract");
    }
  }

  async findById(id: string): Promise<Contract | null> {
    try {
      const demandDoc = await ContractModel.findById(id);

      if (!demandDoc) {
        return null;
      }

      return ContractMapper.toDomain(demandDoc);
    } catch (error: any) {
      throw new Error(`Failed to find demand by id: ${error.message}`);
    }
  }

  async findByIdWithDetail(id: string): Promise<any | null> {
    const result = await ContractModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "demands",
          localField: "demandId",
          foreignField: "_id",
          as: "demand",
        },
      },
      {
        $unwind: "$demand",
      },
      {
        $lookup: {
          from: "users",
          localField: "demand.customerId",
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
      {
        $lookup: {
          from: "users",
          localField: "demand.assignedEmployeeId",
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
      {
        $addFields: {
          "demand.customer": "$customer",
          "demand.assignedEmployee": "$assignedEmployee",
        },
      },
      {
        $project: {
          customer: 0,
          assignedEmployee: 0,
          "demand.customerId": 0,
          "demand.assignedEmployeeId": 0,
        },
      },
    ]);

    return result[0] || null;
  }

  async findByDemandId(demandId: string): Promise<Contract | null> {
    try {
      const contractDoc = await ContractModel.findOne({ demandId });

      if (!contractDoc) {
        return null;
      }

      return ContractMapper.toDomain(contractDoc);
    } catch (error) {
      console.error("Error finding contract by demandId:", error);
      throw new Error("Failed to find contract by demandId");
    }
  }

  async findByExternalId(externalId: string): Promise<Contract | null> {
    try {
      const contractDoc = await ContractModel.findOne({ externalId });

      if (!contractDoc) {
        return null;
      }

      return ContractMapper.toDomain(contractDoc);
    } catch (error) {
      console.error("Error finding contract by demandId:", error);
      throw new Error("Failed to find contract by demandId");
    }
  }

  async findMany(params: ContractListQuery): Promise<ContractListResult> {
    try {
      const { search, statuses, page, limit } = params;

      // Build filter
      const filter: any = {};

      if (statuses && statuses.length > 0) {
        filter.status = { $in: statuses };
      }

      if (search) {
        filter.$or = [
          { externalId: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Execute queries in parallel
      const [items, total] = await Promise.all([
        ContractModel.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        ContractModel.countDocuments(filter),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        items: items.map((doc) => ContractMapper.toDomain(doc as any)),
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      console.error("Error finding contracts:", error);
      throw new Error("Failed to find contracts");
    }
  }

  async findAllUnCompleted(): Promise<Contract[]> {
    try {
      const filter = {
        status: { $ne: ContractStatus.COMPLETED },
      };

      const contracts = await ContractModel.find(filter).lean();
      return contracts.map((doc) => ContractMapper.toDomain(doc));
    } catch (error: any) {
      throw new Error(`Failed to find uncompleted contracts: ${error.message}`);
    }
  }
}
