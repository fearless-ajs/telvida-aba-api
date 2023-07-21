import {
  HttpException,
  HttpStatus,
  Logger,
  NotAcceptableException,
  NotFoundException,
  Query,
  Req
} from "@nestjs/common";
import mongoose, { Connection, FilterQuery, Model, SaveOptions, Types, UpdateQuery } from "mongoose";
import { AbstractDocument } from "./abstract.entity";
import { Request } from "express";
import APIFeatures from "@libs/helpers/api_features";
import { IFilterableCollection } from "@libs/helpers/response-controller";

export type TQuery = {
  page: number,
  perPage: number,
  sortBy: string,
  sortOrder: 'asc' | 'desc',
  filter?:any,
}

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  protected constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  async create(
    document: Omit<TDocument, '_id' | 'createdAt' | 'updatedAt'>,
    options?: SaveOptions,
  ): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    return (
      await createdDocument.save(options)
    ).toJSON() as unknown as TDocument;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.documentExist(filterQuery);

    if (!document) {
      this.logger.warn(`${this.model.modelName} not found with filterQuery:`, filterQuery);
      throw new NotFoundException(`${this.model.modelName} not found.`);
    }

    return document;
  }


  async findLastOne(filterQuery: FilterQuery<TDocument> = {}): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true }).sort({createdAt: -1})
    if (!document) {
      return null
    }

    return document;
  }

  async findFirstOne(filterQuery: FilterQuery<TDocument> = {}): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true }).sort({createdAt: 1})
    if (!document) {
      return null
    }

    return document;
  }

  async findById(id: string): Promise<TDocument> {
    // check if the id is valid
    if (!mongoose.isValidObjectId(id)){
      throw new NotAcceptableException(`Invalid ${this.model.modelName} id: ${id}`)
    }

    const document = await this.documentExist({ _id: id });

    if (!document) {
      this.logger.warn(`${this.model.modelName} not found with id:`, id);
      throw new NotFoundException(`${this.model.modelName} not found.`);
    }

    return document;
  }

  async documentExist(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });
    if (!document) {
        return null
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ) {
    const document = await this.model.findOneAndUpdate(filterQuery, {
      ...update,
      updatedAt: Date.now()
    }, {
      new: true,
      runValidators: true
    });

    if (!document) {
      this.logger.warn(`Document not found with filterQuery:`, filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async upsert(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
    });
  }

  async find(filterQuery?: FilterQuery<TDocument>) {
    return this.model.find(filterQuery, {}, { lean: true });
  }

  async findAllFiltered(@Req() request: Request): Promise<IFilterableCollection> {
    const {
      page = 1,
      perPage = 15,
      sortBy,
      sortOrder = 'asc',
      filter,
    }  = request.query as unknown as TQuery;


    const startIndex = (page - 1) * perPage;
    const endIndex = page * perPage;

    // Create a query object to build the MongoDB query
    const queryObject = {};

    // Apply the filter if it is provided
    if (filter) {
      // Assuming `filter` is an object containing the filter criteria
      Object.assign(queryObject, filter);
    }

    // Create a sort object based on sortBy and sortOrder
    const sortObject = {};
    if (sortBy) {
      sortObject[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // Perform the database query with the filter, sort, skip, and limit
    const [collection, total] = await Promise.all([
      this.model
        .find(queryObject)
        .sort(sortObject)
        .skip(startIndex)
        .limit(perPage)
        .exec(),
      this.model.countDocuments(queryObject).exec(),
    ]);

    const currentPage = page;
    const lastPage = Math.ceil(total / perPage);
    const baseUrl = request.originalUrl; // Retrieve the base URL dynamically from the request object

    const firstPageUrl = `${baseUrl}?page=1`;
    const lastPageUrl = `${baseUrl}?page=${lastPage}`;

    // Construct the dynamic pagination links
    const links = [];
    if (currentPage > 1) {
      links.push({ url: `${baseUrl}?page=${currentPage - 1}`, label: '&laquo; Previous', active: false });
    }
    for (let i = 1; i <= lastPage; i++) {
      const isActive = i === currentPage;
      links.push({ url: `${baseUrl}?page=${i}`, label: i.toString(), active: isActive });
    }
    if (currentPage < lastPage) {
      links.push({ url: `${baseUrl}?page=${currentPage + 1}`, label: 'Next &raquo;', active: false });
    }

    const data = {
      current_page: currentPage,
      data: collection,
      first_page_url: firstPageUrl,
      from: startIndex + 1,
      last_page: lastPage,
      last_page_url: lastPageUrl,
      links: links,
      next_page_url: currentPage < lastPage ? `${baseUrl}?page=${currentPage + 1}` : null,
      path: baseUrl, // Use the full request URL as the path
      per_page: perPage,
      prev_page_url: currentPage > 1 ? `${baseUrl}?page=${currentPage - 1}` : null,
      to: endIndex,
      total: total,
    };

    return {
      length: collection.length,
      data: data,
    };
  }

  findAll  = async (req:Request, filter?:any)   => {

    // To allow for nested GET reviews on tour(hack)
    // let filter = {};
    // if (req.params.tourId) filter = { tour: req.params.tourId};

    //BUILD THE QUERY
    const features = new APIFeatures(this.model.find(filter?filter:{}), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    //EXECUTE THE QUERY
    const docs = await features.query;

    return docs;
  };

  async findAndDelete(
      filterQuery: FilterQuery<TDocument>
  ) {
    return this.model.findOneAndDelete(filterQuery);
  }

  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
