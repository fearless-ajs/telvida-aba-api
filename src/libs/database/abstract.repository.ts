import {HttpException, HttpStatus, Logger, NotAcceptableException, NotFoundException} from '@nestjs/common';
import mongoose, {
  FilterQuery,
  Model,
  Types,
  UpdateQuery,
  SaveOptions,
  Connection,
} from 'mongoose';
import { AbstractDocument } from './abstract.entity';
import {Request} from "express";
import APIFeatures from "@libs/helpers/api_features";

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(
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
    const document = await this.model.findOneAndUpdate(filterQuery, update, {
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

   isObjectIdValid(objectId: string, modelName?: string): Boolean{
        // Check if the ID is valid
    if (!mongoose.isValidObjectId(objectId)){
      throw new HttpException(`Invalid ${modelName} id`, HttpStatus.NOT_ACCEPTABLE)
    }

    return true;
  }


  async startTransaction() {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
