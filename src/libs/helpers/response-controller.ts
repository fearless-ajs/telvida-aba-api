import {HttpException, HttpStatus} from "@nestjs/common";
import { NextFunction, Response } from "express";

export interface IResponseWithMessage {
    status: string,
    message: string
}

export interface IResponseWithData {
    status: string,
    data: any
}

export interface IResponseWithDataCollection {
    status: string,
    results?: number
    data: any[]
}

export interface IFilterableCollection {
    length: number
    data: any,
}

class ResponseController {

    public sendRPCResponseMessage(message: any, status): IResponseWithMessage{
       return  {
           status: status,
           message
       };
    }

    public sendRPCResponseMessageWithData(data: any, status): IResponseWithData{
        return  {
            status,
            data
        };
    }


    public response(message: any){
        return {
            status: 'SUCCESS',
        }
    }

    public responseMessage(message: string): IResponseWithMessage {
        return {
            status: 'SUCCESS',
            message
        }
    }

    public responseWithData(data: any): IResponseWithData{
        return {
            status: 'SUCCESS',
            data
        }
    }

    public responseWithDataCollection(response_data: IFilterableCollection): IResponseWithDataCollection {
        const { length, data } = response_data;
        return {
            status: 'SUCCESS',
            results: length,
            data: data,
        }
    }


    public responseWithCollection(data: any[], collection_length : number): IResponseWithDataCollection {
        return {
            status: 'SUCCESS',
            results: collection_length,
            data: data,
        }
    }

}

export default ResponseController;