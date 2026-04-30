// ============================================================================
// BASE SERVICE
// ============================================================================

import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { PaginationOptions, PaginatedResult } from '../types/pagination.types';
import { calculatePagination, calculateSkip } from '../utils/pagination.util';

/**
 * Base Service Class
 * All services should extend this class for common CRUD operations
 */
export class BaseService<T extends Document> {
  constructor(protected model: Model<T>) {}

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  /**
   * Find document by ID
   */
  async findById(id: string, populate?: string | string[]): Promise<T | null> {
    let query = this.model.findById(id);
    
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(path => {
          query = query.populate(path);
        });
      } else {
        query = query.populate(populate);
      }
    }
    
    return query.exec();
  }

  /**
   * Find one document by filter
   */
  async findOne(
    filter: FilterQuery<T>,
    populate?: string | string[]
  ): Promise<T | null> {
    let query = this.model.findOne(filter);
    
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(path => {
          query = query.populate(path);
        });
      } else {
        query = query.populate(populate);
      }
    }
    
    return query.exec();
  }

  /**
   * Find all documents by filter
   */
  async findAll(
    filter: FilterQuery<T> = {},
    populate?: string | string[]
  ): Promise<T[]> {
    let query = this.model.find(filter);
    
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(path => {
          query = query.populate(path);
        });
      } else {
        query = query.populate(populate);
      }
    }
    
    return query.exec();
  }

  /**
   * Find documents with pagination
   */
  async findPaginated(
    filter: FilterQuery<T>,
    options: PaginationOptions,
    populate?: string | string[]
  ): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10, sort = '-createdAt' } = options;
    const skip = calculateSkip(page, limit);

    // Build query
    let query = this.model.find(filter).sort(sort).skip(skip).limit(limit);
    
    if (populate) {
      if (Array.isArray(populate)) {
        populate.forEach(path => {
          query = query.populate(path);
        });
      } else {
        query = query.populate(populate);
      }
    }

    // Execute query and count in parallel
    const [data, total] = await Promise.all([
      query.exec(),
      this.model.countDocuments(filter),
    ]);

    const pagination = calculatePagination(options, total);

    return {
      data,
      pagination,
    };
  }

  /**
   * Update document by ID
   */
  async update(
    id: string,
    data: UpdateQuery<T>
  ): Promise<T | null> {
    return this.model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Update one document by filter
   */
  async updateOne(
    filter: FilterQuery<T>,
    data: UpdateQuery<T>
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    });
  }

  /**
   * Delete document by ID (hard delete)
   */
  async delete(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id);
  }

  /**
   * Soft delete document by ID
   */
  async softDelete(id: string): Promise<T | null> {
    return this.model.findByIdAndUpdate(
      id,
      { isDeleted: true } as any,
      { new: true }
    );
  }

  /**
   * Count documents by filter
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter);
  }

  /**
   * Check if document exists
   */
  async exists(filter: FilterQuery<T>): Promise<boolean> {
    const count = await this.model.countDocuments(filter);
    return count > 0;
  }
}
