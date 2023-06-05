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

    public responseWithDataCollection(data: any[]): IResponseWithDataCollection {
       return {
           status: 'SUCCESS',
           results: data.length,
           data
       }
    }

}

export default ResponseController;