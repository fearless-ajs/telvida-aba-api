import {HttpException, HttpStatus} from "@nestjs/common";
import { NextFunction, Response } from "express";

class ApiResponse {

    public successMessage(message: string, status_code: number, res:Response){
        res.status(status_code).json({
            status: 'SUCCESS',
            message
        });
    }

    public sendPlainErrorMessage(message: string, status_code: number, res:Response){
        res.status(status_code).json({
            status: 'SUCCESS',
            message
        });
    }

    public successMessageWithData(data: any, status_code: number, res:Response){
        res.status(status_code).json({
            status: 'SUCCESS',
            data
        });
    }

    public errorMessageWithData(data: any, status_code: number=400, status, res:Response){
        res.status(status_code).json({
            status: status,
            data
        });
    }

    public successMessageWithDataCollection(data: any, status_code: number, res:Response){
        res.status(status_code).json({
            status: 'SUCCESS',
            results: data.length,
            data
        });
    }
}

export default ApiResponse;