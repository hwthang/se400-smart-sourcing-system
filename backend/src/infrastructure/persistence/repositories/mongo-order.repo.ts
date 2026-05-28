// =========================================================
// INFRASTRUCTURE LAYER: MONGO ORDER REPOSITORY
// =========================================================
// File: infrastructure/repositories/mongo-order.repository.ts

import {
  OrderRepository,
  FindAllOrdersFilter,
  OrderQuery,
  OrderSearchResult,
} from "../../../application/repositories/order.repo";
import { Order } from "../../../domain/entities/order.entity";
import { OrderMapper } from "../mappers/order.mapper";
import { OrderModel } from "../schemas/order.schema";

export class MongoOrderRepository implements OrderRepository {
  
  async save(order: Order): Promise<Order> {
    try {
      const data = OrderMapper.toPersistence(order);
      let savedOrder: any;
      
      if (order.id) {
        // Update existing order
        savedOrder = await OrderModel.findByIdAndUpdate(
          order.id, 
          data, 
          { new: true }
        );
      } else {
        // Create new order
        savedOrder = new OrderModel(data);
        await savedOrder.save();
      }

      return OrderMapper.toDomain(savedOrder);
    } catch (error: any) {
      throw new Error(`Failed to save order: ${error.message}`);
    }
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const orderDoc = await OrderModel.findById(id);

      if (!orderDoc) {
        return null;
      }

      return OrderMapper.toDomain(orderDoc);
    } catch (error: any) {
      throw new Error(`Failed to find order by id: ${error.message}`);
    }
  }

  async findByRegistrationId(registrationId: string): Promise<Order | null> {
    try {
      const orderDoc = await OrderModel.findOne({ registrationId });

      if (!orderDoc) {
        return null;
      }

      return OrderMapper.toDomain(orderDoc);
    } catch (error: any) {
      throw new Error(`Failed to find order by registration id: ${error.message}`);
    }
  }

  async findAll(filter?: FindAllOrdersFilter): Promise<Order[]> {
    try {
      const queryFilter: any = {};
      
      if (filter) {
        if (filter.contractId) {
          queryFilter.contractId = filter.contractId;
        }
        if (filter.registrationId) {
          queryFilter.registrationId = filter.registrationId;
        }
        if (filter.supplierId) {
          queryFilter.supplierId = filter.supplierId;
        }
        if (filter.status) {
          queryFilter.status = filter.status;
        }
      }
      
      const orderDocs = await OrderModel.find(queryFilter)
        .sort({ createdAt: -1 });

      return orderDocs.map((doc) => OrderMapper.toDomain(doc));
    } catch (error: any) {
      throw new Error(`Failed to find orders: ${error.message}`);
    }
  }

  async findMany(params: OrderQuery): Promise<OrderSearchResult> {
    try {
      const { 
        contractId,
        registrationId,
        supplierId,
        statuses,
        minTotalAmount,
        maxTotalAmount,
        startDate,
        endDate,
        page, 
        limit 
      } = params;
      
      const filter: any = {};
      
      if (contractId) {
        filter.contractId = contractId;
      }
      
      if (registrationId) {
        filter.registrationId = registrationId;
      }
      
      if (supplierId) {
        filter.supplierId = supplierId;
      }
      
      if (statuses && statuses.length > 0) {
        filter.status = { $in: statuses };
      }

      // Filter by total amount range
      if (minTotalAmount !== undefined || maxTotalAmount !== undefined) {
        filter.totalAmount = {};
        if (minTotalAmount !== undefined) {
          filter.totalAmount.$gte = minTotalAmount;
        }
        if (maxTotalAmount !== undefined) {
          filter.totalAmount.$lte = maxTotalAmount;
        }
      }

      // Filter by date range
      if (startDate || endDate) {
        filter.createdAt = {};
        if (startDate) {
          filter.createdAt.$gte = startDate;
        }
        if (endDate) {
          filter.createdAt.$lte = endDate;
        }
      }

      const skip = (page - 1) * limit;
      
      const [items, total] = await Promise.all([
        OrderModel.find(filter)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .lean(),
        OrderModel.countDocuments(filter),
      ]);

      // Transform to domain entities
      const domainItems = items.map((item) => OrderMapper.toDomain(item));

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
      throw new Error(`Failed to find orders: ${error.message}`);
    }
  }
}